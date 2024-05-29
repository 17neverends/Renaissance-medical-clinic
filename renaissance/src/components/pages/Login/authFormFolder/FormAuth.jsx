import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../../../../auth/AuthWrapper"
import styles from "../Login.module.css"
import axios from 'axios';

export default function authFormComp( {setActionAuth} )  {

     const [ Login, setLogin ] = useReducer((Login, newItem) => { return ( {...Login, ...newItem} )}, {
          userName: "",
          password: "",
      })

     const navigate = useNavigate();
     const { login, userRole } = AuthData();
     const [ errorMessage, setErrorMessage ] = useState(null)


     const validateForm = () => {
          for (const key in Login) {
              if (Login.hasOwnProperty(key)) {
                  if (!Login[key]) {
                      return false; 
                  }
              }
          }
          return true; 
      };

      const doLogin = async () => {
        try {
            if (Login.userName && !Login.password) { 
                const response = await axios.post('http://127.0.0.1:8000/admin/token', {
                    token: Login.userName,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    window.location.href = "http://127.0.0.1:8001";
                    return; 
                } 
            }
            if (validateForm()) {
                const loginResponse = await login(Login.userName, Login.password);
                const userRole = loginResponse.data.role;
                if (userRole === "patsient") {
                    navigate("/account");
                } else if (userRole === "doctor") {
                    navigate("/doctor");
                }
            } else {
                setErrorMessage("Пожалуйста, заполните все поля"); 
            }
        } catch (error) {
            setErrorMessage(error.message);  
        }
    }


     const handleSwitchToReg = () => {
          setActionAuth(false); 
     };

     return (
          <div className={`${styles.page} ${styles.fadein}`}>
               <h2 className={styles.authtitle}>Авторизация</h2>
               <div className={styles.inputs}>
                    <div className={styles.input}>
                         <input placeholder="Логин" value={Login.userName} onChange={(e) => setLogin({userName: e.target.value}) } type="text"/>
                    </div>
                    <div className={styles.input}>
                         <input placeholder="Пароль" value={Login.password} onChange={(e) => setLogin({password: e.target.value}) } type="password"/>
                    </div>
                    <div className={styles.button}>
                         <button type="button" className={styles.openService} onClick={doLogin}>Войти</button>
                    </div>
                    {errorMessage ?
                    <div className={styles.error}>{errorMessage}</div>
                    : null }
                    <div className={styles.switch} onClick={handleSwitchToReg}>Создать новый аккаунт</div>


               </div>
          </div>
     )
}