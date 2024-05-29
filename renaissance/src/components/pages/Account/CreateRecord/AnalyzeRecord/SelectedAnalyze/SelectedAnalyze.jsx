import React, { useState, useRef, useEffect } from 'react';
import styles from './SelectedAnalyze.module.css';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from 'axios';
import { AuthData } from '../../../../../../auth/AuthWrapper';
import { useUserHistory  } from '../../UserHistory/UserHistoryContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SelectedAnalyze = ({ selectedAnalyze }) => {
    const { addToHistory } = useUserHistory();
    const notify = () => toast("Вы успешно записались! Подробнее в истории операций!");


    const {user, analyzes, setAnalyzes} = AuthData();
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const { name, id } = selectedAnalyze;
    const calendarRef = useRef();
    const [date, setDate] = useState(new Date());

    const handleDateChange = async date => {
        setDate(date);
    };
    

    const handleCreateanalyze = async () => {
        try { 
            console.log(id, user.id, formatDate(date));
            const response = await axios.post('http://127.0.0.1:8000/analyze/create_analyze', {
                id: id,
                patsient_id: user.id,
                date: formatDate(date)
              });                
              console.log(response.data);
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                addToHistory(`${time}: Вы записались на ${name} ${formatDate(date)}`);
                notify()
                try {
                    const analyzes_response = await axios.get("http://127.0.0.1:8000/analyze/get_patsient_analyzes",{
                        params: {
                            id: user.id
                        }
                    });;
                    if (analyzes_response.status === 200) {
                        setAnalyzes(analyzes_response.data);
                        console.log(analyzes)
    
                    }
                } catch (error) {
                    console.error("Ошибка при получении записей пациента:", error);
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
            <div className={styles.containeranalyze}>
                <p className={styles.instructions}>Выберите дату:</p>
                <div ref={calendarRef} className="calendar-container">
                    <Calendar onChange={handleDateChange} value={date} minDate={minDate} maxDate={maxDate} />
                </div>

                    <button className={styles.openService} onClick={handleCreateanalyze}>оформить</button> 
            </div> 
            <ToastContainer /> 
        </div>
    );
};
