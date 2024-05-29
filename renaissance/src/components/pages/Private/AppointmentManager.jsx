import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const useAppointmentManager = (records) => {
    const [roomStatus, setRoomStatus] = useState('');
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [appointmentStartTime, setAppointmentStartTime] = useState(null);
    const [appointmentEndTime, setAppointmentEndTime] = useState(null);


    const startAppointment = (appointment) => {
        const startTime = new Date(appointment.record_date + 'T' + appointment.record_start);
        const timeUntilNextAppointment = startTime - new Date();

        const timerId = setTimeout(() => {
            setCurrentAppointment(appointment);
            setRoomStatus('текущий приём');
            toast("Прием начался! Перейдите в комнату приема");
            setAppointmentStartTime(startTime);
            setAppointmentEndTime(new Date(appointment.record_date + 'T' + appointment.record_end));
        }, timeUntilNextAppointment);

        const timerUntilNextAppointment = setInterval(() => {
            const now = new Date();
            const timeUntilNextAppointment = startTime - now;
            if (timeUntilNextAppointment > 0) {
                setRoomStatus(`Следующий прием через: ${formatTime(timeUntilNextAppointment)}`);
            } else {
                clearInterval(timerUntilNextAppointment);
            }
        }, 1000);

        return () => {
            clearTimeout(timerId);
            clearInterval(timerUntilNextAppointment);
        };
    };

    const endAppointment = () => {
        const timerId = setTimeout(() => {
            setRoomStatus('приём завершён');
            toast("Прием завершился!");
            setCurrentAppointment(null);
            setAppointmentStartTime(null);
            setAppointmentEndTime(null);
        }, appointmentEndTime - new Date());

        return () => clearTimeout(timerId);
    };

    useEffect(() => {
        const now = new Date();
        const ongoingAppointment = records.find(record => {
            const startTime = new Date(record.record_date + 'T' + record.record_start);
            const endTime = new Date(record.record_date + 'T' + record.record_end);
            return startTime <= now && now <= endTime;
        });

        if (ongoingAppointment) {
            setRoomStatus('текущий приём');
            setCurrentAppointment(ongoingAppointment); 
            setAppointmentStartTime(new Date(ongoingAppointment.record_date + 'T' + ongoingAppointment.record_start));
            setAppointmentEndTime(new Date(ongoingAppointment.record_date + 'T' + ongoingAppointment.record_end));
        } else {
            const nextAppointment = records.find(record => {
                const startTime = new Date(record.record_date + 'T' + record.record_start);
                return startTime > now;
            });

            if (nextAppointment) {
                return startAppointment(nextAppointment);
            } else {
                setRoomStatus('нет запланированных приёмов');
            }
        }
    }, [records, currentAppointment]);

    useEffect(() => {
        if (appointmentStartTime && appointmentEndTime) {
            return endAppointment();
        }
    }, [appointmentStartTime, appointmentEndTime]);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return { roomStatus, currentAppointment };
};