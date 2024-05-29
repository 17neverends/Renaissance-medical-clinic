import styles from './PrivateRoom.module.css';
import { RecordProcess } from "./RecordProcess/RecordProcess"
import { ToastContainer } from 'react-toastify';
import { AuthData } from '../../../../auth/AuthWrapper';
import { useAppointmentManager } from '../AppointmentManager';
import { useEffect } from 'react';
import { WebSocketProvider } from '../../../Socket/Socket';

export const Private = () => {
    const { user, records } = AuthData();
    const { roomStatus, currentAppointment } = useAppointmentManager(records);
    
    useEffect(() => {
    }, [records]);
    
    return (
        <WebSocketProvider pid={user.id}>

            <div className={styles.private}>
                <h2>Статус: {roomStatus}</h2>
                {currentAppointment && roomStatus === "текущий приём" ? (
                    <div className={styles.center}>
                        <p className={styles.infop}>Дата: {currentAppointment.record_date}, начало приема: {currentAppointment.record_start}, конец приема: {currentAppointment.record_end}</p>
                        <RecordProcess
                            path={currentAppointment.photo}
                            name={currentAppointment.doctor}
                            text={currentAppointment.specialty}
                            purp={currentAppointment.purpose}
                            id={currentAppointment.record_id}
                            date={currentAppointment.record_date}
                            start={currentAppointment.record_start}
                            end={currentAppointment.record_end}
                        />
                    </div>
                ) : null}
                <ToastContainer /> 
            </div>
        </WebSocketProvider>
    );
};
