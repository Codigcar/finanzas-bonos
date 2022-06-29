import React, { useMemo } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import {
  useYupValidationResolver,
  textValidatorGlobal,
  toastMessage,
} from "@utils/index";
import { CButton, CInput, CLayout } from "@components/index";
import { finanzaApi } from "@api/api";

import styles from "./login.module.scss";
import Image from "next/image";

type FormData = {
  email: string;
  password: string;
};

const Login: NextPage = () => {
  const router = useRouter();

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        email: yup
          .string()
          .email(textValidatorGlobal.emailFormatter)
          .required(textValidatorGlobal.required),
        password: yup.string().required(textValidatorGlobal.required),
      }),
    []
  );

  const onSubmit = async (formData: FormData) => {
    try {
      const { data } = await finanzaApi.post("/users/login", formData);
      const { ok, body } = data;
      console.log({ ok });
      console.log({ body });

      if (!ok) {
        return toastMessage("error", "Correo y/o Contraseña incorrectos");
      }
      localStorage.setItem("id", body.id);
      localStorage.setItem("name", body.name);
      toastMessage("success", "¡Bienvenido!");
      router.replace(`/home/${body.id}`);
      return;
    } catch (error) {
      console.log({ error });
      return toastMessage("error", "Correo y/o Contraseña incorrectos");
    }
  };

  const methods = useForm<FormData>({
    mode: "onChange",
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      email: "test@gmail.com",
      password: "123123",
    },
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
          <h1 className={styles.title}>¡Inicia Sesión!</h1>
          <FormProvider {...methods}>
            <form className="w-4/6" onSubmit={methods.handleSubmit(onSubmit)}>
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="email"
                label={"Ingrese correo: "}
                placeholder={"Escriba aquí"}
              />
              <CInput
                classNameDiv={styles.CInputDiv}
                classNameLabel={styles.CInputLabel}
                classNameInput={styles.CInputInput}
                name="password"
                label={"Ingrese contraseña: "}
                placeholder={"Escriba aquí"}
                type="password"
              />
              <CButton
                label={"Ingresar"}
                classNameDiv={styles.CButtonDiv}
                classNameButton={styles.CButtonButton}
              />
              <CButton
                label={"Registrate"}
                classNameDiv={styles.CButtonDiv}
                classNameButton={styles.CButtonButton2}
                type="button"
                onClick={() => router.push("register")}
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </CLayout>
  );
};

export default Login;
