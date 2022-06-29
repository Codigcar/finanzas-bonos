import React from "react";
import { useMemo } from "react";
import { NextPage } from "next";

import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import {
  useYupValidationResolver,
  textValidatorGlobal,
  toastMessage,
} from "@utils/index";

import { CButton, CInput, CLayout } from "@components/index";
import { finanzaApi } from "@api/api";
import { useRouter } from "next/router";

import styles from "./register.module.scss";
import Image from "next/image";

type FormData = {
  email: string;
  password: string;
  name: string;
  dni: string;
  lastname: string;
};

const Register: NextPage = () => {
  const router = useRouter();

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .email(textValidatorGlobal.emailFormatter)
          .required(textValidatorGlobal.required),
        password: yup.string().required(textValidatorGlobal.required),
        newpassword: yup
          .string()
          .required(textValidatorGlobal.required)
          .oneOf([yup.ref("password")], "* Las contraseñas no coinciden"),
        name: yup.string().required(textValidatorGlobal.required),
        lastname: yup.string().required(textValidatorGlobal.required),
        dni: yup
          .string()
          .required(textValidatorGlobal.required)
          .min(8, "* Es necesario mínimo 8 digitos")
          .max(8, "* Es necesario máximo 8 digitos"),
      }),
    []
  );

  const onSubmit = async (formData: FormData) => {
    try {
      const { data } = await finanzaApi.post("/users", formData);
      const { ok, body } = data;
      console.log({ ok });
      console.log({ body });

      if (!ok) {
        return toastMessage(
          "error",
          "Ha ocurrido un error, intentelo nuevamente"
        );
      }
      router.push(`/auth/login`);
      return toastMessage("success", "¡Cuenta creanda satisfactoriamente!");
    } catch (error) {
      console.log({ error });
      return toastMessage(
        "error",
        "Ha ocurrido un error, intentelo nuevamente"
      );
    }
  };

  const methods = useForm<FormData>({
    mode: "onChange",
    resolver: useYupValidationResolver(validationSchema),
  });
  return (
    <CLayout>
      <div className="flex h-full">
        <div className="w-4/6 ">
          <Image
            src={"/bonos2.jpg"}
            alt="Picture of the author"
            width={"100%"}
            height={"100%"}
            layout="responsive"
          />
        </div>
        <div className="flex items-center justify-center w-2/6 flex-column ">
        <h1 className={styles.title}>¡Registrate!</h1>
          <FormProvider {...methods}>
            <form className="w-4/6" onSubmit={methods.handleSubmit(onSubmit)}>
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="email"
                label={"Ingrese su correo: "}
                placeholder={"Escriba aquí"}
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="password"
                label={"Ingrese su contraseña: "}
                placeholder={"Escriba aquí"}
                type="password"
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="newpassword"
                label={"Repita su contraseña: "}
                placeholder={"Escriba aquí"}
                type="password"
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="name"
                label={"Ingrese sus nombres: "}
                placeholder={"Escriba aquí"}
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="lastname"
                label={"Ingrese sus apellidos: "}
                placeholder={"Escriba aquí"}
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="dni"
                label={"Ingrese su DNI: "}
                placeholder={"Escriba aquí"}
              />
              <CButton
                label={"Registrarte"}
                classNameDiv={styles.CButtonDiv}
                classNameButton={styles.CButtonButton}
              />
              <CButton
                label={"Iniciar Sesión"}
                classNameDiv={styles.CButtonDiv}
                classNameButton={styles.CButtonButton2}
                type="button"
                onClick={() => router.replace("/auth/login")}
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </CLayout>
  );
};

export default Register;
