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
  inv: number;
  moneda: string;
  dolar: number;
};

const Home: NextPage = () => {
  const [calculate, setCalculate] = useState<any>(null);
  const [saveFormData, setSaveFormData] = useState<any>(null);

  const router = useRouter();
  const bonoData = router.query.data
    ? JSON.parse(router.query.data.toString())
    : null;
  useEffect(() => {
    if (bonoData) {
      setCalculate({
        moneda: bonoData.moneda,
        precioActual: bonoData.precioActual,
        utilidad_o_Perdida: bonoData.utilidad_o_Perdida,
        duracion: bonoData.duracion,
        convexidad: bonoData.convexidad,
        total: bonoData.total,
        duracionModificada: bonoData.duracionModificada,
        VAN: bonoData.VAN,
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
        inv: yup
          .number()
          .typeError(textValidatorGlobal.required)
          .required(textValidatorGlobal.required),
      }),
    []
  );

  const methods = useForm<FormData>({
    mode: "onChange",
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      VNominal: bonoData?.VNominal,
      VComercial: bonoData?.VComercial,
      NA: bonoData?.NA,
      Fcupon: bonoData?.Fcupon,
      DXA: bonoData?.DXA,
      TDeTasa: bonoData?.TDeTasa || "n",
      Capit: bonoData?.Capit,
      TI: bonoData?.TI,
      TAD: bonoData?.TAD,
      IR: bonoData?.IR,
      FEmision: bonoData?.FEmision,
      inv: bonoData?.inv,
      moneda: bonoData?.moneda,
      dolar: 3.81,
    },
  });
  const { isSubmitting } = methods.formState;

  const onSubmit = async (formData: FormData) => {
    setSaveFormData(formData);
    let { data } = await finanzaApi.post("/bonos", formData);
    const { ok, body } = data;
    if (!ok) {
      toastMessage("error", "No se pudo registrar, intentelo de nuevo");
      return;
    }
    setCalculate(body);
    return;
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
    router.back();
    return;
  };

  const editBD = async () => {
    let { data } = await finanzaApi.patch(`/bonos/${bonoData.id}`, {
      ...bonoData,
      ...calculate,
    });
    const { ok } = data;
    if (!ok) {
      toastMessage("error", "No se pudo guardar cambios, intentelo de nuevo");
      return;
    }
    toastMessage("success", "¡Cambios guardardos exitosamente!");
    router.back();
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
            </div>
            <div className="w-2/4 px-7">
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
                label={"Importe a la renta"}
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
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="inv"
                label={"Inversión"}
                placeholder={"Escriba aquí"}
                type="number"
                step="any"
              />
              <div className="flex">
                <CButton
                  classNameDiv={styles.CButtonDiv}
                  classNameButton={styles.CButtonButton2}
                  label={"Cancelar"}
                  type="button"
                  onClick={() => router.back()}
                />
                <CButton
                  classNameDiv={styles.CButtonDiv}
                  classNameButton={styles.CButtonButton}
                  label={"Calcular"}
                  loading={isSubmitting}
                />
                <CButton
                  classNameDiv={styles.CButtonDiv}
                  classNameButton={styles.CButtonButton}
                  label={bonoData ? "Editar" : "Guardar"}
                  loading={isSubmitting}
                  type="button"
                  disable={saveFormData ? false : true}
                  onClick={() => (bonoData ? editBD() : saveBD())}
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
                  <th scope="col">TIR</th>
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
                  <td>TIR</td>
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
