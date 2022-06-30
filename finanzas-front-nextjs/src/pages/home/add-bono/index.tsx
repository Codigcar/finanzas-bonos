import React, { useEffect, useMemo } from "react";
import { NextPage } from "next";
import { CButton, CInput, CLayout, CSelect } from "@components/index";
import { FormProvider, useForm } from "react-hook-form";
import { textValidatorGlobal } from "@utils/messages";

import * as yup from "yup";
import { useYupValidationResolver } from "@utils/yupValidation";
import { finanzaApi } from "src/api/api";
import { useState } from "react";

import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { toastMessage } from "@utils/toastMessages";

type FormData = {
  VNominal: number;
  VComercial: number;
  NA: number;
  Fcupon: string;
  DXA: number;
  TDeTasa: string;
  Capit: string;
  TI: number;
  TAD: number;
  IR: number;
  FEmision: string;
  moneda: string;
  dolar: number;
  TIRDescripcion: string;
  VANDescripcion: string;
};

const Home: NextPage = () => {
  const [calculate, setCalculate] = useState<any>(null);
  const [saveFormData, setSaveFormData] = useState<any>(null);

  const router = useRouter();
  const bonoBD = router.query.data
    ? JSON.parse(router.query.data.toString())
    : null;
  useEffect(() => {
    if (bonoBD) {
      setCalculate({
        moneda: bonoBD.moneda,
        precioActual: bonoBD.precioActual,
        utilidad_o_Perdida: bonoBD.utilidad_o_Perdida,
        duracion: bonoBD.duracion,
        convexidad: bonoBD.convexidad,
        total: bonoBD.total,
        duracionModificada: bonoBD.duracionModificada,
        VAN: bonoBD.VAN,
      });
    }
  }, []);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        VNominal: yup
          .number()
          .typeError(textValidatorGlobal.required)
          .required(textValidatorGlobal.required),
        VComercial: yup
          .number()
          .typeError(textValidatorGlobal.required)
          .required(textValidatorGlobal.required),
        NA: yup
          .number()
          .typeError(textValidatorGlobal.required)
          .required(textValidatorGlobal.required),
        Fcupon: yup.string().required(textValidatorGlobal.required),
        DXA: yup
          .number()
          .typeError(textValidatorGlobal.required)
          .required(textValidatorGlobal.required),
        TDeTasa: yup.string().required(textValidatorGlobal.required),
        // Capit: yup.string().required(textValidatorGlobal.required),
        TI: yup
          .number()
          .typeError(textValidatorGlobal.required)
          .required(textValidatorGlobal.required),
        TAD: yup
          .number()
          .typeError(textValidatorGlobal.required)
          .required(textValidatorGlobal.required),
        IR: yup
          .number()
          .typeError(textValidatorGlobal.required)
          .required(textValidatorGlobal.required),
        FEmision: yup.string().required(textValidatorGlobal.required),
      }),
    []
  );

  const methods = useForm<FormData>({
    mode: "onChange",
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      VNominal: bonoBD?.VNominal,
      VComercial: bonoBD?.VComercial,
      NA: bonoBD?.NA,
      Fcupon: bonoBD?.Fcupon,
      DXA: bonoBD?.DXA,
      TDeTasa: bonoBD?.TDeTasa || "n",
      Capit: bonoBD?.Capit,
      TI: bonoBD?.TI,
      TAD: bonoBD?.TAD,
      IR: bonoBD?.IR,
      FEmision: bonoBD?.FEmision,
      moneda: bonoBD?.moneda,
      dolar: bonoBD?.dolar || 3.81,
    },
  });
  const { isSubmitting } = methods.formState;

  const onSubmit = async (formData: FormData) => {
    setSaveFormData(formData);
    // let { data } = await finanzaApi.post("/bonos", formData);
    // const { ok, body } = data;
    // if (!ok) {
    //   toastMessage("error", "No se pudo registrar, intentelo de nuevo");
    //   return;
    // }
    if (!bonoBD) {
      console.log("save");

      let { data } = await finanzaApi.post("/bonos", {
        ...formData,
        saveBD: true,
        accountId: localStorage.getItem("id") || "",
      });

      const { ok, body } = data;
      if (!ok) {
        toastMessage("error", "No se pudo registrar, intentelo de nuevo");
        return;
      }
      setCalculate(body);
      toastMessage("success", "¡Registro exitoso!");
      return;
    } else {
      console.log("edit");

      let { data: respCalc } = await finanzaApi.post("/bonos", {
        ...formData,
      });
      const { ok: okCal, body: bodyCal } = respCalc;
      if (!okCal) {
        toastMessage(
          "error",
          "No se pudo realizar el calcuclo, intentelo de nuevo"
        );
        return;
      }

      const bodyRequest = {
        ...bonoBD,
        ...formData,
        ...bodyCal,
      };
      console.log({ bodyRequest });

      let { data } = await finanzaApi.patch(`/bonos/${bonoBD.id}`, bodyRequest);
      const { ok, body } = data;
      console.log({ body });

      if (!ok) {
        toastMessage("error", "No se pudo guardar cambios, intentelo de nuevo");
        return;
      }
      setCalculate(body);
      toastMessage("success", "¡Cambios guardardos exitosamente!");
      // router.back();
      return;
    }
  };

  const saveBD = async () => {
    // registrar en BD
    let { data } = await finanzaApi.post("/bonos", {
      ...saveFormData,
      saveBD: true,
      accountId: localStorage.getItem("id") || "",
    });

    const { ok } = data;
    if (!ok) {
      toastMessage("error", "No se pudo registrar, intentelo de nuevo");
      return;
    }
    toastMessage("success", "¡Registro exitoso!");
    // router.back();
    return;
  };

  const editBD = async () => {
    let { data } = await finanzaApi.patch(`/bonos/${bonoBD.id}`, {
      ...bonoBD,
      // ...calculate,
    });
    const { ok } = data;
    if (!ok) {
      toastMessage("error", "No se pudo guardar cambios, intentelo de nuevo");
      return;
    }
    toastMessage("success", "¡Cambios guardardos exitosamente!");
    // router.back();
    return;
  };

  return (
    <CLayout>
      <FormProvider {...methods}>
        <form className="container" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex justify-end px-7">
            <div className="flex">
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.divDolar}
                name="dolar"
                label={"Dolar"}
                placeholder={"Valor"}
                type="number"
                step="any"
              />
              <CSelect
                name="moneda"
                label={"Moneda "}
                placeholder={"Escriba aquí"}
                options={[
                  {
                    id: "S/",
                    name: "Soles",
                  },
                  {
                    id: "$/",
                    name: "Dolares",
                  },
                ]}
                valueName={"name"}
              />
            </div>
          </div>
          <div className="flex">
            <div className="w-2/4 px-7">
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="VNominal"
                label={"Valor Nominal "}
                placeholder={"Escriba aquí"}
                type="number"
                step="any"
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="VComercial"
                label={"Valor Comercial "}
                placeholder={"Escriba aquí"}
                type="number"
                step="any"
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="NA"
                label={"Número de años "}
                placeholder={"Escriba aquí"}
                type="number"
                step="any"
              />
              <CSelect
                name="Fcupon"
                label={"Frecuencia del cupon "}
                placeholder={"Escriba aquí"}
                options={[
                  {
                    id: "m",
                    name: "Mensual",
                  },
                  {
                    id: "b",
                    name: "Bimestral",
                  },
                  {
                    id: "t",
                    name: "Trimestral",
                  },
                  {
                    id: "c",
                    name: "Cuatrimestral",
                  },
                  {
                    id: "s",
                    name: "Semestral",
                  },
                  {
                    id: "a",
                    name: "Anual",
                  },
                ]}
                valueName={"name"}
              />
              <CSelect
                name="DXA"
                label={"Días por año"}
                placeholder={"Escriba aquí"}
                options={[
                  {
                    id: 360,
                    name: 360,
                  },
                  {
                    id: 365,
                    name: 365,
                  },
                ]}
                valueName={"name"}
              />
            </div>
            <div className="w-2/4 px-7">
              <CSelect
                name="TDeTasa"
                label={"Tipo de tasa de Interés"}
                placeholder={"Escriba aquí"}
                options={[
                  {
                    id: "n",
                    name: "Nominal",
                  },
                  {
                    id: "e",
                    name: "Efectiva",
                  },
                ]}
                valueName={"name"}
              />
              {methods.watch("TDeTasa")?.toString() == "n" && (
                <CSelect
                  name="Capit"
                  label={"Capitalización"}
                  placeholder={"Escriba aquí"}
                  options={[
                    {
                      id: "d",
                      name: "Diaria",
                    },
                    {
                      id: "q",
                      name: "Quincenal",
                    },
                    {
                      id: "m",
                      name: "Mensual",
                    },
                    {
                      id: "b",
                      name: "Bimestral",
                    },
                    {
                      id: "t",
                      name: "Trimestral",
                    },
                    {
                      id: "c",
                      name: "Cuatrimestral",
                    },
                    {
                      id: "s",
                      name: "Semestral",
                    },
                    {
                      id: "a",
                      name: "Anual",
                    },
                  ]}
                  valueName={"name"}
                />
              )}

              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="TI"
                label={"Tasa de interés (%)"}
                placeholder={"Escriba aquí"}
                type="number"
                step="any"
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="TAD"
                label={"Tasa anual de descuento (%)"}
                placeholder={"Escriba aquí"}
                type="number"
                step="any"
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="IR"
                label={"Importe a la renta (%)"}
                placeholder={"Escriba aquí"}
                type="number"
                step="any"
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="FEmision"
                label={"Fecha de emisión"}
                placeholder={"Escriba aquí"}
                type="date"
              />
              <div className="flex">
                <CButton
                  classNameDiv={styles.CButtonDiv}
                  classNameButton={styles.CButtonButton2}
                  label={"Regresar"}
                  type="button"
                  onClick={() => router.back()}
                />
                <CButton
                  classNameDiv={styles.CButtonDiv}
                  classNameButton={styles.CButtonButton}
                  label={bonoBD ? "Editar" : "Guardar"}
                  loading={isSubmitting}
                />
              </div>
            </div>
          </div>
        </form>

        {calculate && (
          <div className="px-4 mt-7">
            <table className="table border-2 table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Moneda</th>
                  <th scope="col">Precio Actual</th>
                  <th scope="col">Utilidad/Pérdida</th>
                  <th scope="col">Duración</th>
                  <th scope="col">Convexidad</th>
                  <th scope="col">Total</th>
                  <th scope="col">Duración modificada</th>
                  <th scope="col">VAN</th>
                  <th scope="col">VAN Desc.</th>
                  <th scope="col">TIR %</th>
                  <th scope="col">TIR Desc.</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                <tr>
                  <th scope="row">1</th>
                  <td>{calculate.moneda}</td>
                  <td>{calculate.precioActual}</td>
                  <td>{calculate.utilidad_o_Perdida}</td>
                  <td>{calculate.duracion}</td>
                  <td>{calculate.convexidad}</td>
                  <td>{calculate.total}</td>
                  <td>{calculate.duracionModificada}</td>
                  <td>{calculate.VAN}</td>
                  <td>{calculate.VANDescripcion}</td>
                  <td>{calculate.TIR}</td>
                  <td>{calculate.TIRDescripcion}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </FormProvider>
    </CLayout>
  );
};

export default Home;
