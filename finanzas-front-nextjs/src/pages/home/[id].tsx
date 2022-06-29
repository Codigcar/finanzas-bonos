import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

import { finanzaApi } from "@api/api";
import { CButton, CLayout } from "@components/index";
import { GrEdit } from "react-icons/gr";

import styles from "./home.module.scss";

const AddBono: NextPage = ({ body }: any) => {
  const router = useRouter();

  const addBono = () => {
    router.push("add-bono");
  };

  return (
    <CLayout>
      <div className="container">
        <CButton
          classNameDiv={styles.CButtonDiv}
          classNameButton={styles.CButtonButton}
          label={"Nuevo Bono + "}
          onClick={addBono}
        />

        <table
          className="table border-2 table-striped "
          style={{ margin: "auto" }}
        >
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
              <th scope="col">Editar</th>
            </tr>
          </thead>

          <tbody className="table-group-divider">
            {body.map((item: any, index: number) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.moneda}</td>
                  <td>{item.precioActual}</td>
                  <td>{item.utilidad_o_Perdida}</td>
                  <td>{item.duracion}</td>
                  <td>{item.convexidad}</td>
                  <td>{item.total}</td>
                  <td>{item.duracionModificada}</td>
                  <td>{item.VAN}</td>
                  <td>TIR</td>
                  <td className="flex items-center justify-center cursor-pointer bg-slate-800">
                    <div
                      onClick={() => {
                        router.push({
                          pathname: "add-bono",
                          query: { data: JSON.stringify(item) },
                        }, 'add-bono');
                      }}
                    >
                      <GrEdit height={"100%"} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {body.length == 0 && <h3 className="mt-2">Aún no hay registros...</h3>}
      </div>
    </CLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // const { data } = await  // your fetch function here
  // console.log({ctx});
  // console.log(ctx.params);

  const { id } = params as { id: string };

  const { data: resp } = await finanzaApi(`/bonos/${id}`);
  const { ok, body } = resp;

  if (!ok) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      body,
    },
  };
};

export default AddBono;
