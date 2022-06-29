import React, { useEffect } from "react";

import styles from "./CLayout.module.scss";
import { AiOutlinePoweroff } from "react-icons/ai";
import { useRouter } from "next/router";
import { useState } from 'react';

export const CLayout = ({ children }: any) => {
  const router = useRouter();
  const [name, setName] = useState<any>(null);
  useEffect(() => {
    const userName = localStorage.getItem("name") ? localStorage.getItem("name") : null;
    setName(userName);
  }, [])
  

  return (
    <>
      <header className={styles.navbar}>
        <div className="flex items-center justify-between mx-5">
          <div>
            <h1
              className=""
              style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}
            >
              BONOS
            </h1>
          </div>
          <div>
            {name && (
              <div className="flex items-center">
                <h1
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Hola, {name}
                </h1>
                <AiOutlinePoweroff
                  size={30}
                  color={"red"}
                  style={{ cursor: "pointer", marginLeft:10 }}
                  onClick={() => {
                    router.replace("/auth/login");
                    localStorage.clear();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>
      <div className={styles.body}>{children}</div>
      <footer>&copy;</footer>
    </>
  );
};
