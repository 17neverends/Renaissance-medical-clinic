import React, { useState, useRef, useEffect } from 'react';
import styles from './SelectedDoctor.module.css';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from 'axios';
import { TimePeeker } from './TimePeeker/TimePeeker';
import { AuthData } from "../../../../../../auth/AuthWrapper";
import { useUserHistory  } from '../../UserHistory/UserHistoryContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SelectedDoctor = ({ selectedDoctor }) => {
    const { addToHistory } = useUserHistory();
    const notify = () => toast("Вы успешно записались! Подробнее в истории операций!");


    const { user, records, setRecords } = AuthData();
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [record, setRecord] = useState({
        id: null,
        patsient_id: user.id,
        purpose: ""
    });

    const [timeStart, setTimeStart] = useState(null); 

    useEffect(() => {
        setSelectedRecordId(null);
    }, [selectedDoctor]);

    useEffect(() => {
        setRecord(prevState => ({
            ...prevState,
            doctor_id: selectedDoctor.id
        }));
    }, [selectedDoctor]);

    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const updateRecordKey = (key, value) => {
        setRecord(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    const { firstName, secondName, specialty } = selectedDoctor;
    const calendarRef = useRef();
    const [date, setDate] = useState(new Date());
    const [availableTime, setAvailableTime] = useState([]);
    const [wrong, setWrong] = useState(false);

    const handleDateChange = async date => {
        setWrong(false);
        try {
            const response = await axios.get('http://127.0.0.1:8000/record/get_available_time', {
                params: {
                    id: parseInt(selectedDoctor.id),
                    date: formatDate(date),
                    user_id: parseInt(user.id)
                }
            });
    
            if (response.data.length === 0) {
                setAvailableTime([]);
                setSelectedRecordId(null);
                setDate(date);
            } else {
                setAvailableTime(response.data);
                setSelectedRecordId(null);
                setDate(date);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };
    
    useEffect(() => {
        const fetchAvailableTime = async () => {
            setWrong(false);
            try {
                const response = await axios.get('http://127.0.0.1:8000/record/get_available_time', {
                    params: {
                        id: parseInt(selectedDoctor.id),
                        date: formatDate(date),
                        user_id: parseInt(user.id)
                    }
                });
    
                if (response.data.length === 0) {
                    setAvailableTime([]);
                    setSelectedRecordId(null);
                } else {
                    setAvailableTime(response.data);
                }
            } catch (error) {
                console.error('Ошибка при выполнении запроса:', error);
            }
        };
    
        fetchAvailableTime();
    }, []);

    const handleRecordSelect = (recordId, startTime, endTime) => { 
        setSelectedRecordId(recordId); 
        updateRecordKey('id', recordId);
        updateRecordKey('purpose', "");
        setTimeStart(startTime);
    };

    const handleCreateRecord = async () => {
        try {
            const currentTime = new Date();
            const currentHours = currentTime.getHours();
            const currentMinutes = currentTime.getMinutes();
            const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    
            const [hours, minutes] = timeStart.split(':').map(Number);
            const timeStartInMinutes = hours * 60 + minutes;
    
            const isCurrentDate = date.toDateString() === new Date().toDateString();
    
            if (!isCurrentDate || currentTimeInMinutes < timeStartInMinutes) {
                setWrong(false);
                const response = await axios.post('http://127.0.0.1:8000/record/create_record', record);
                console.log(response.data);
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                addToHistory(`${time}: Вы записались на прием к ${firstName} ${secondName}, ${specialty} на ${timeStart} ${formatDate(date)}`);
                notify()
                try {
                    const response = await axios.get('http://127.0.0.1:8000/record/get_available_time', {
                        params: {
                            id: parseInt(selectedDoctor.id),
                            date: formatDate(date),
                            user_id: parseInt(user.id)
                        }
                    });
            
                    if (response.data.length === 0) {
                        setAvailableTime([]);
                        setSelectedRecordId(null);
                    } else {
                        setAvailableTime(response.data);
                        setSelectedRecordId(null);
                        setDate(date);
                    }
                } catch (error) {
                    console.error('Ошибка при выполнении запроса:', error);
                }
    
                try {
                    const records_response = await axios.get("http://127.0.0.1:8000/record/get_patsient_records",{
                        params: {
                            id: user.id
                        }
                    });;
                    if (records_response.status === 200) {
                        setRecords(records_response.data);
                        console.log(records)
    
                    }
                } catch (error) {
                    console.error("Ошибка при получении записей пациента:", error);
                }
            } else {
                setWrong(true);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);

    return (
        <div>
            <div className={styles.containerdoctor}>
                <p className={styles.instructions}>Выберите дату:</p>
                <div ref={calendarRef} className="calendar-container">
                    <Calendar onChange={handleDateChange} value={date} minDate={minDate} maxDate={maxDate} />
                </div>

                <div className={styles.timeGrid}>
                    {availableTime.length > 0 ? (
                        availableTime.map((time, index) => (
                            <TimePeeker 
                                key={index} 
                                text={`${time.start} - ${time.end}`} 
                                onClick={() => handleRecordSelect(time.id, time.start, time.end)} 
                                isSelected={selectedRecordId === time.id} 
                            />
                        ))
                    ) : (
                        ""
                    )}
                </div>

                {availableTime.length === 0 && (
                    <p className={styles.notime}>На выбранную дату записей нет или Вы уже записаны</p>
                )}

                {selectedRecordId ? 
                <input 
                    placeholder="Введите причину записи"
                    className={styles.purpose}
                    type="text" 
                    value={record.purpose} 
                    onChange={(e) => setRecord({...record, purpose: e.target.value})} 
                /> : ""}

                {wrong ? <p className={styles.wrong}>Данная запись уже неактуальна</p> : null}

                {selectedRecordId && record.purpose ? 
                    <button className={styles.openService} onClick={handleCreateRecord}>Далее</button> 
                : null}
            </div> 
            <ToastContainer /> 
        </div>
    );
};
