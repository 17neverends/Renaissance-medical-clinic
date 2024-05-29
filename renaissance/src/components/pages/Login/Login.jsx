import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AuthFormComp from "./authFormFolder/FormAuth";
import RegFormComp from "./regFormFolder/FormReg";
import { AuthData } from '../../../auth/AuthWrapper';

export const Login = () => {
     const [actionAuth, setActionAuth] = useState(true);
     const { user, userRole } = AuthData(); 
     const navigate = useNavigate();

     useEffect(() => {
          console.log(userRole)
          if (userRole == "patsient") {
               navigate("/account");
          } else if (userRole == "doctor") {
               navigate("/doctor");
          }
     }, [userRole, navigate]);

     return (
          <div>
               {actionAuth ? <AuthFormComp setActionAuth={setActionAuth} /> : <RegFormComp setActionAuth={setActionAuth} />}
          </div>
     )
}



