import React, { useEffect } from 'react';
import axios from 'axios';
import styles from './DoctorAccount.module.css';
import { AuthData } from '../../../auth/AuthWrapper';
import { DoctorProfile } from './DoctorProfile/DoctorProfile';
import { Appointments } from './RecodsToDoctor/RecordsToDoctor';
import { Archive } from './Archive/Archive';

export const DoctorAccount = () => {
    const { doctor, setDocrec } = AuthData();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/record/get_doctor_records", {
                    params: {
                        id: doctor.id
                    }
                });
                if (response.status === 200) {
                    setDocrec(response.data);
                }
            } catch (error) {
                console.error("Ошибка при получении записей пациента:", error);
            }
        };

        fetchData();
    }, [doctor.id, setDocrec]);

    return (
        <div className={`${styles.main} ${styles.fadein}`}>
            <p className={styles.welcome}>Добро пожаловать, {doctor.secondName + " " + doctor.firstName + " " + doctor.patronymic}!</p>
            <DoctorProfile/>
            <Appointments/>
            <Archive/>
        </div>
    );
};
