import styles from './DoctorRoom.module.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { DoctorAppointment } from './DoctorAppointment/DoctorAppointment';
import { useDoctorAppointmentManager } from './DoctorAppointmentManager';
import { AuthData } from '../../../auth/AuthWrapper';
import { WebSocketProvider } from '../../Socket/Socket';

export const DoctorRoom = () => {
    const { appointments, setAppointments, docrec } = AuthData();
    const { roomStatus, currentAppointment } = useDoctorAppointmentManager(docrec);
    
    useEffect(() => {
    }, [appointments]);


    return (

        <div className={styles.private}>
            <h2>Статус: {roomStatus}</h2>
            {currentAppointment && roomStatus === "текущий приём" ? (
                <WebSocketProvider pid={currentAppointment.patsient_id}>
                <div className={styles.center}>
                    <p className={styles.infop}>Дата: {currentAppointment.record_date}, начало приема: {currentAppointment.record_start}, конец приема: {currentAppointment.record_end}</p>
                    <DoctorAppointment
                        photo={currentAppointment.photo}
                        name={currentAppointment.patsient}
                        text={currentAppointment.specialty}
                        purpose={currentAppointment.purpose}
                        id={currentAppointment.record_id}
                        date={currentAppointment.record_date}
                        start={currentAppointment.record_start}
                        end={currentAppointment.record_end}
                        dob={currentAppointment.dob}
                        bloodType={currentAppointment.bloodType}
                        gender={currentAppointment.gender}
                        patsient_id={currentAppointment.patsient_id}

                    />
                </div>
                </WebSocketProvider>
            ) : null}
            <ToastContainer /> 
        </div>
    );
};
