import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../../styles/home.css";



export const Singup = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "all" });

  function samePassword() {
    let password = document.getElementById("password").value;
    let confirm_password = document.getElementById("confirm_password").value;
    if (password != confirm_password) {
      alert("Las contraseñas no coinciden");
    }
  }

  const submitBack = async (input) => {
    try {
      console.log(input);
      const res = await fetch(
        "https://3001-nanoprogram-medigeeks-mww1bt06jmk.ws-us85.gitpod.io/api/mediGeeks/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.email) {
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(JSON.stringify(input));
  };


  return (

    <div>
      <div className="login position-absolute top-50 start-50 translate-middle container-md">
        <form
          autoComplete="off"
          onSubmit={handleSubmit(submitBack)}
          style={{ opacity: 0.8 }}
        >
          
          <div className="form-outline mb-4 ">
            <input
              {...register("name", {
                required: "Se requiere nombre y apellido",
                pattern: {
                  value:
                    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                  message: "Nombre no es valido",
                },
              })}
              placeholder="Nombre Apellido"
              type="userName"
              id="form2Example10"
              class="form-control text-center"
            />
            <p style={{ color: "red" }}>{errors.name?.message}</p>
          </div>
          <div className="form-outline mb-4">
            <input
              {...register("email", {
                required: "correo electronico es requerido",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "El email debe ser válido",
                },
              })}
              placeholder="Email"
              type=""
              id="form2Example30"
              className="form-control text-center"
            />
            <p style={{ color: "red" }}>{errors.email?.message}</p>
          </div>
          <div className="form-outline mb-4">
            <input
              {...register("password", {
                required: "se requiere contraseña",
                pattern: {
                  value:
                    /^(?=.*[0-9])(?=.*[!@#$%^&*.,])[a-zA-Z0-9!@#$%^&*.,]{6,16}$/,
                  message:
                    "La contraseña debe contener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter de caso especial",
                },
              })}
              placeholder="Contraseña"
              type="password"
              id="password"
              className="form-control text-center"
            />
            <p style={{ color: "red" }}>{errors.password?.message}</p>
          </div>
          <div className="form-outline mb-4">
            <input
              onBlur={samePassword}
              placeholder="Confirme Contraseña"
              type="password"
              id="confirm_password"
              className="form-control text-center"
            />
          </div>
          <div className="col d-flex justify-content-center">
            <input type="submit" value="registrarse" class="btn btn-primary rounded-pill"/>
          </div>
        </form>
      </div>
    </div>
  );
};