import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Account } from "../models/account.model";
import { Bono } from '../models/bonos.mode';
import { Honorary } from "../models/honorary.mode";
import {irr} from 'node-irr'
export const createBono = async (req: Request, res: Response) => {
  let {
    VNominal,
    VComercial,
    NA, //numero de anios
    Fcupon, // Frecuencia cupon
    DXA, // DiasxAnios
    TDeTasa, // Tipo de interes , Efectiva o Nominal
    Capit, // Capitlizacion, if (TDeTasa == Nominal)
    TI, // Tasa de interes
    TAD, // TAsa anual de descuento
    IR, // Importe a la renta
    FEmision, // Fecha de Emision
    inv, // Inversion
    moneda,
    accountId,
    saveBD = false
  } = req.body;

    TI = (TI*1.0) / 100;
    console.log({TI});
    
    TAD = (TAD*1.0) / 100;
    console.log({TAD});
    
    IR = (IR*1.0) / 100;
    console.log({IR});

    let CE = (VComercial*2.2)/100;
    console.log({CE});
    
    let CB = (VComercial*0.95)/100;
    console.log({CB});
    

    let FreCupon = 0;
    switch (Fcupon) {
      case 'm':
        FreCupon = 30;
        break;
      case 'b':
        FreCupon = 60;
        break;
      case 't':
        FreCupon = 90;
        break;
      case 'c':
        FreCupon = 120;
        break;
      case 's':
        FreCupon = 180;
        break;
      case 'a':
        FreCupon = 360;
        break;
    
      default:
        break;
    }

    console.log({FreCupon});
    
    let DiasCapt = 0;
    switch (Capit) {
      case 'd':
        DiasCapt = 1;
        break;
      case 'q':
        DiasCapt = 15;
        break;
      case 'm':
        DiasCapt = 30;
        break;
      case 'b':
        DiasCapt = 60;
        break;
      case 't':
        DiasCapt = 90;
        break;
      case 'c':
        DiasCapt = 120;
        break;
      case 's':
        DiasCapt = 180;
        break;
      case 'a':
        DiasCapt = 360;
        break;
    
      default:
        break;
    }
    console.log({DiasCapt});

    
    let PerAnno = (DXA* 1.0) / (FreCupon * 1.0)
    console.log({PerAnno});
    
    let TPeriodo = (PerAnno * NA)
    console.log({TPeriodo});

    let TEA = 0.0;
    switch (TDeTasa) {
      case "e":
        TEA = TI
        break;
      
      case "n":
        TEA = (Math.pow((1+TI/(DXA/DiasCapt)),(DXA/DiasCapt))-1)
        break;
      
      default:
        break;
    }
    console.log({TEA});

    let TEP = Math.pow((1+TEA),(FreCupon/DXA))-1;
    console.log({TEP});
    
    let COK = Math.pow((1+TAD),(FreCupon/DXA))-1;
    console.log({COK});
    
    let PrecioA = 0;

    let contador = 1;
    while (contador <= TPeriodo) {
      if(contador == TPeriodo){
        PrecioA = ((VNominal*TEP+VNominal*1/100+VNominal)/Math.pow((1+COK),contador))+PrecioA;
      }
      else {
        PrecioA = ((VNominal*TEP)/Math.pow((1+COK),contador))+PrecioA;
      } 
      contador++;
    }
    console.log({PrecioA});

    let Utiper = PrecioA - (VComercial+CB);

    let valor1 = 0.0;
    let valor2 = 0.0;
    let valor3 = 0.0;

    contador = 1;
    while (contador <= TPeriodo) {
      if (contador == TPeriodo){
        valor1 = ((VNominal*TEP+(VNominal/100)+VNominal)/Math.pow((1+COK),contador))+valor1;
				valor2 = (((VNominal*TEP+(VNominal/100)+VNominal)/Math.pow((1+COK),contador))*contador*FreCupon/DXA)+valor2;
				valor3 = ((VNominal*TEP+(VNominal/100)+VNominal)/Math.pow((1+COK),contador))*contador*(contador+1)+valor3;
      } else {
        valor1 = ((VNominal*TEP)/Math.pow((1+COK),contador))+valor1;
        valor2 = (((VNominal*TEP)/Math.pow((1+COK),contador))*contador*FreCupon/DXA)+valor2;
        valor3 = ((VNominal*TEP)/Math.pow((1+COK),contador))*contador*(contador+1)+valor3;
      }
      console.log(`sumita: ${contador}`, VNominal*TEP);
      console.log(`sumita2: ${contador}`, VNominal*TEP+(VNominal/100)+VNominal);
      contador++;
    }
    console.log({contador});

    
    let Duracion = valor2/valor1;
    console.log({Duracion});
    
		let Convexidad = valor3/(Math.pow((1+COK),2)*valor1*Math.pow((DXA/FreCupon),2))
    console.log({Convexidad});
    
		let Total = Duracion+Convexidad
    console.log({Total});
    
		let DuracionM = Duracion/(1+COK)
    console.log({DuracionM});
    

    console.log('Precio Actual: S/',PrecioA);
    let VAN = PrecioA-inv;

    let TIR = 0;

    // save

    const newBono = {
      VNominal,
      VComercial,
      NA,
      Fcupon,
      DXA,
      TDeTasa,
      Capit,
      TI: TI*100,
      TAD: TAD*100,
      IR: IR*100,
      FEmision,
      inv,
      moneda,

      precioActual: PrecioA,
      utilidad_o_Perdida: Utiper,
      duracion: Duracion,
      convexidad: Convexidad,
      total: Total,
      duracionModificada: Duracion,
      VAN: VAN,
      TIR: TIR,
      account: accountId,
    }
    if(saveBD){
      const result = await getRepository(Bono).save(newBono as any);

      console.log({result});
      
      return res.json({
        ok: true,
        body: result
      })
    }

    console.log('TIR: ',irr([
      -1059.98,
      39.23, 
      39.23, 
      39.23, 
      39.23, 
      39.23, 
      39.23, 
      39.23, 
      39.23, 
      39.23, 
      1049.23 
    ]))

    return res.json({
      ok: true,
      body: newBono
    })
   

};

export const getBonosByUserId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params ;
    const bonos = await getRepository(Bono)
      .createQueryBuilder("bonos")
      .where("bonos.accountId = :accountId ", { accountId: id })
      .getMany();
    return res.json({
      ok: true,
      body: bonos,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      body: "Contactese con el administrador",
    });
  }
};

export const updateBonoByUserId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  console.log({body});
  
  try {
    const bono = await Bono.findOne({ where: {id}});
    if (!bono) return res.status(404).json({ message: "Not user found" });

    const resp = await Bono.save({
      ...req.body
    });
    console.log({resp});
    

    return res.status(200).json({
      ok:true,
      body:resp
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};