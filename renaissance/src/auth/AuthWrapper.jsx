import { createContext, useContext, useState, useEffect } from "react";
import { RenderMenu, RenderRoutes } from "../components/structure/RenderNavigation";
import { RenderHeader } from "../components/structure/Header";
import axios from 'axios';
const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);


export const AuthWrapper = () => {

     const [records, setRecords] = useState([])
     const [analyzes, setAnalyzes] = useState([])
     const [userRole, setUserRole] = useState("");

     const [appointments, setAppointments] = useState([])
     const [docrec, setDocrec] = useState([]);

     const [user, setUser] = useState({
          username: "",
          isAuthenticated: false,
          email: "", 
          phone: "",
          address: "",
          firstName: "",
          secondName: "",
          patronymic: "",
          gender: "",
          dob: "",
          joinDate: "",
          bloodType: "",
          discCode: "",
          disc: "",
          id: null,
          photo: ""
     });

     const [doctor, setDoctor] = useState({
        id: null,
        username: "",
        isAuthenticated: false,
        firstName: "",
        secondName: "",
        patronymic: "",
        specialty: "",
        photo: ""
   });

   const login = async (username, password) => {
    try {
        const doc_response = await axios.post('http://127.0.0.1:8000/doctor/login', {
            username,
            password
        });

        if (doc_response.status === 200) {
            console.log(doc_response.data);
            const responseData = doc_response.data;
            setDoctor({ 
                id: responseData.id,
                isAuthenticated: true,
                secondName: responseData.secondName,
                firstName: responseData.firstName,
                patronymic: responseData.patronymic,
                specialty: responseData.specialty,
                photo: responseData.photo
            });
            setUserRole("doctor");

            await fetchAppointments(responseData.id);
            await fetchDocRecords(responseData.id);
            return; 
        }
    } catch (error) {
    }

    try {
        const pat_response = await axios.post('http://127.0.0.1:8000/patsient/authorization', {
            username,
            password
        });

        if (pat_response.status === 200) {
            const responseData = JSON.parse(pat_response.data.data);
            setUser({ 
                isAuthenticated: responseData.isAuthenticated,
                secondName: responseData.secondName,
                firstName: responseData.firstName,
                patronymic: responseData.patronymic,
                gender: responseData.gender,
                dob: responseData.dob,
                bloodType: responseData.bloodType,
                email: responseData.email,
                phone: responseData.phone,
                address: responseData.address,
                username: username,
                joinDate: responseData.joinDate,
                discCode: responseData.discCode,
                disc: responseData.disc,
                id: responseData.id,
                photo: responseData.photo
            });
            setUserRole("patsient");

            await fetchRecords(responseData.id);
            await fetchAnalyzes(responseData.id);
            return; 
        } 
    } catch (error) {
    }

    throw new Error("Пользователь не существует");
};


    const fetchRecords = async (userId) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/record/get_patsient_records", {
                params: {
                    id: userId
                }
            });
            if (response.status === 200) {
                setRecords(response.data);
            }
        } catch (error) {
            console.error("Ошибка при получении записей пациента:", error);
        }
    };


    const fetchAnalyzes = async (userId) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/analyze/get_patsient_analyzes", {
                params: {
                    id: userId
                }
            });
            if (response.status === 200) {
                setAnalyzes(response.data);
            }
        } catch (error) {
            console.error("Ошибка при получении записей пациента:", error);
        }
    };

    const fetchAppointments = async (docId) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/record/get_appointments", {
                params: {
                    id: docId
                }
            });
            if (response.status === 200) {
                setAppointments(response.data);
            }
        } catch (error) {
            console.error("Ошибка при получении записей пациента:", error);
        }
    };

    const fetchDocRecords = async (docId) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/record/get_doctor_records", {
                params: {
                    id: docId
                }
            });
            if (response.status === 200) {
                setDocrec(response.data);
            }
        } catch (error) {
            console.error("Ошибка при получении записей пациента:", error);
        }
    };
        
        

     const reg = async (secondName, firstName, patronymic, gender, dob, bloodType, email, phone, address, username, password) => {
          try {
               const response = await axios.post('http://127.0.0.1:8000/patsient/registration', {
                   secondName,
                   firstName,
                   patronymic,
                   gender,
                   dob,
                   bloodType,
                   email,
                   phone,
                   address,
                   username,
                   password
               });

               const userData = response.data.data; 

               setUser({ 
                    isAuthenticated: true,
                    secondName: secondName,
                    firstName: firstName,
                    patronymic: patronymic,
                    gender: gender,
                    dob: dob,
                    bloodType: bloodType,
                    email: email,
                    phone: phone,
                    address: address,
                    username: username,
                    joinDate: userData.join_date,
                    discCode: userData.disc_code,
                    disc: userData.discount,
                    id: userData.id,
                    photo: userData.photo
                        });
                        setUserRole("patsient");

           } catch (error) {
               throw new Error("Пользователь с таким логином уже существует");
           }
      };


     const logout = () => {
            if (userRole == "patsient") {
                setUserRole("");
                setUser({
                    username: "",
                    isAuthenticated: false,
                    email: "", 
                    phone: "",
                    address: "",
                    firstName: "",
                    secondName: "",
                    patronymic: "",
                    gender: "",
                    dob: "",
                    joinDate: "",
                    bloodType: "",
                    discCode: "",
                    disc: "",
                    id: null,
                    photo: ""
               });
     
               setRecords([]);
               setAnalyzes([]);
               sessionStorage.clear();
            } else if (userRole == "doctor"){
                setUserRole("");
                setDoctor({
                    id: null,
                    username: "",
                    isAuthenticated: false,
                    firstName: "",
                    secondName: "",
                    patronymic: "",
                    specialty: "",
                    photo: ""
                });

                setAppointments([]);
                setDocrec([]);
            }
          
      };
      


     return (
          
               <AuthContext.Provider value={{ setUser, user, login, reg, logout,
                                                 records, setRecords,
                                                 analyzes, setAnalyzes,
                                                 userRole, doctor, appointments, setAppointments,
                                                 docrec, setDocrec}}>
                    <>
                         <RenderHeader/>
                         <RenderMenu />
                         <RenderRoutes />
                    </>
                    
               </AuthContext.Provider>
          
     )

}