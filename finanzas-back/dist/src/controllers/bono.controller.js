"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBonoByUserId = exports.getBonosByUserId = exports.createBono = void 0;
const typeorm_1 = require("typeorm");
const bonos_mode_1 = require("../models/bonos.mode");
const node_irr_1 = require("node-irr");
const createBono = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { VNominal, VComercial, NA, //numero de anios
    Fcupon, // Frecuencia cupon
    DXA, // DiasxAnios
    TDeTasa, // Tipo de interes , Efectiva o Nominal
    Capit, // Capitlizacion, if (TDeTasa == Nominal)
    TI, // Tasa de interes
    TAD, // TAsa anual de descuento
    IR, // Importe a la renta
    FEmision, // Fecha de Emision
    inv = VNominal, // Inversion
    moneda, accountId, saveBD = false, dolar } = req.body;
    TI = (TI * 1.0) / 100;
    console.log({ TI });
    TAD = (TAD * 1.0) / 100;
    console.log({ TAD });
    IR = (IR * 1.0) / 100;
    console.log({ IR });
    let CE = (VComercial * 2.2) / 100;
    console.log({ CE });
    let CB = (VComercial * 0.95) / 100;
    console.log({ CB });
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
    console.log({ FreCupon });
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
    console.log({ DiasCapt });
    let PerAnno = (DXA * 1.0) / (FreCupon * 1.0);
    console.log({ PerAnno });
    let TPeriodo = (PerAnno * NA);
    console.log({ TPeriodo });
    let TEA = 0.0;
    switch (TDeTasa) {
        case "e":
            TEA = TI;
            break;
        case "n":
            TEA = (Math.pow((1 + TI / (DXA / DiasCapt)), (DXA / DiasCapt)) - 1);
            break;
        default:
            break;
    }
    console.log({ TEA });
    let TEP = Math.pow((1 + TEA), (FreCupon / DXA)) - 1;
    console.log({ TEP });
    let COK = Math.pow((1 + TAD), (FreCupon / DXA)) - 1;
    console.log({ COK });
    let PrecioA = 0;
    let contador = 1;
    while (contador <= TPeriodo) {
        if (contador == TPeriodo) {
            PrecioA = ((VNominal * TEP + VNominal * 1 / 100 + VNominal) / Math.pow((1 + COK), contador)) + PrecioA;
            console.log('iteracion n: ', PrecioA);
        }
        else {
            PrecioA = ((VNominal * TEP) / Math.pow((1 + COK), contador)) + PrecioA;
            console.log(`iteracion[] ${contador}`, PrecioA);
        }
        contador++;
    }
    console.log({ PrecioA });
    let Utiper = PrecioA - (VComercial + CB);
    let valor1 = 0.0;
    let valor2 = 0.0;
    let valor3 = 0.0;
    // TODO:TIR
    let flujoBonistaList = [];
    let TIR = 0;
    const flujoBonitaItem = VNominal * TEP;
    const prima = VNominal * 1.0 / 100;
    console.log('Flujo bonista 0: ', -VComercial - CB);
    flujoBonistaList.push(-VComercial - CB);
    contador = 1;
    while (contador <= TPeriodo) {
        if (contador == TPeriodo) {
            valor1 = ((VNominal * TEP + (VNominal / 100) + VNominal) / Math.pow((1 + COK), contador)) + valor1;
            valor2 = (((VNominal * TEP + (VNominal / 100) + VNominal) / Math.pow((1 + COK), contador)) * contador * FreCupon / DXA) + valor2;
            valor3 = ((VNominal * TEP + (VNominal / 100) + VNominal) / Math.pow((1 + COK), contador)) * contador * (contador + 1) + valor3;
        }
        else {
            valor1 = ((VNominal * TEP) / Math.pow((1 + COK), contador)) + valor1;
            valor2 = (((VNominal * TEP) / Math.pow((1 + COK), contador)) * contador * FreCupon / DXA) + valor2;
            valor3 = ((VNominal * TEP) / Math.pow((1 + COK), contador)) * contador * (contador + 1) + valor3;
            console.log(`Flujo bonista: ${contador}`, VNominal * TEP);
            flujoBonistaList.push(VNominal * TEP);
        }
        contador++;
    }
    // console.log('flujo bonista: n ', -VNominal-flujoBonitaItem-prima);
    console.log('flujo bonista: n ', (((VNominal * TEP + VNominal * 1 / 100 + VNominal) / Math.pow((1 + COK), TPeriodo)) * Math.pow((1 + COK), TPeriodo)));
    flujoBonistaList.push(((VNominal * TEP + VNominal * 1 / 100 + VNominal) / Math.pow((1 + COK), TPeriodo)) * Math.pow((1 + COK), TPeriodo));
    console.log({ flujoBonistaList });
    TIR = (0, node_irr_1.irr)(flujoBonistaList);
    //TODO: TIR
    console.log('iterador 11: ', (VNominal + TEP));
    console.log('prima: ', prima);
    console.log({ contador });
    let Duracion = valor2 / valor1;
    console.log({ Duracion });
    let Convexidad = valor3 / (Math.pow((1 + COK), 2) * valor1 * Math.pow((DXA / FreCupon), 2));
    console.log({ Convexidad });
    let Total = Duracion + Convexidad;
    console.log({ Total });
    let DuracionM = Duracion / (1 + COK);
    console.log({ DuracionM });
    console.log('Precio Actual: S/', PrecioA);
    let VAN = PrecioA - inv;
    // save
    PrecioA = Number(PrecioA.toFixed(2));
    Utiper = Number(Utiper.toFixed(2));
    VAN = Number(VAN.toFixed(2));
    Duracion = Number(Duracion.toFixed(7));
    Convexidad = Number(Convexidad.toFixed(7));
    Total = Number(Total.toFixed(7));
    TIR = Number(TIR.toFixed(7));
    let VANDescripcion = "";
    if (VAN > 0) {
        VANDescripcion = "Rentable";
    }
    if (VAN < 0) {
        VANDescripcion = "No Rentable";
    }
    if (VAN == 0) {
        VANDescripcion = "Indiferente";
    }
    let TIRDescripcion = "";
    if (TIR > COK) {
        TIRDescripcion = "Rentable";
    }
    if (TIR < COK) {
        TIRDescripcion = "No Rentable";
    }
    if (TIR == COK) {
        TIRDescripcion = "Indiferente";
    }
    const newBono = {
        VNominal,
        VComercial,
        NA,
        Fcupon,
        DXA,
        TDeTasa,
        Capit,
        TI: TI * 100,
        TAD: TAD * 100,
        IR: IR * 100,
        FEmision,
        inv,
        moneda,
        dolar,
        precioActual: PrecioA,
        utilidad_o_Perdida: Utiper,
        duracion: Duracion,
        convexidad: Convexidad,
        total: Total,
        duracionModificada: Duracion,
        VAN: VAN,
        TIR: TIR * 100,
        account: accountId,
        TIRDescripcion,
        VANDescripcion
    };
    if (saveBD) {
        const result = yield (0, typeorm_1.getRepository)(bonos_mode_1.Bono).save(newBono);
        return res.json({
            ok: true,
            body: result
        });
    }
    return res.json({
        ok: true,
        body: newBono
    });
});
exports.createBono = createBono;
const getBonosByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bonos = yield (0, typeorm_1.getRepository)(bonos_mode_1.Bono)
            .createQueryBuilder("bonos")
            .where("bonos.accountId = :accountId ", { accountId: id })
            .getMany();
        return res.json({
            ok: true,
            body: bonos,
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            body: "Contactese con el administrador",
        });
    }
});
exports.getBonosByUserId = getBonosByUserId;
const updateBonoByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let bonoInput = req.body;
    try {
        const bonoBD = yield bonos_mode_1.Bono.findOne({ where: { id } });
        if (!bonoBD)
            return res.status(404).json({ message: "Not user found" });
        if (bonoInput.moneda !== bonoBD.moneda) {
            if (bonoInput.moneda == "S/") {
                bonoInput.precioActual = (bonoBD.precioActual * bonoInput.dolar).toFixed(2);
                bonoInput.utilidad_o_Perdida = (bonoBD.utilidad_o_Perdida * bonoInput.dolar).toFixed(2);
                bonoInput.VAN = (bonoBD.VAN * bonoInput.dolar).toFixed(2);
            }
            else {
                bonoInput.precioActual = (bonoBD.precioActual / bonoInput.dolar).toFixed(2);
                bonoInput.utilidad_o_Perdida = (bonoBD.utilidad_o_Perdida / bonoInput.dolar).toFixed(2);
                bonoInput.VAN = (bonoBD.VAN / bonoInput.dolar).toFixed(2);
            }
        }
        const resp = yield bonos_mode_1.Bono.save(Object.assign({}, bonoInput));
        console.log({ resp });
        return res.status(200).json({
            ok: true,
            body: resp
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.updateBonoByUserId = updateBonoByUserId;
//# sourceMappingURL=bono.controller.js.map