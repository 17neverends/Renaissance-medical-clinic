import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Records } from './Records/Records'
import styles from './RecordsToDoctor.module.css'; 
import { AuthData } from '../../../../auth/AuthWrapper';

export const Appointments = () => {
  const { doctor, appointments, setAppointments, setDocrec } = AuthData();
  const [history, setHistory] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [appointments]);


  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/record/get_appointments?id=${doctor.id}`);
      setHistory(response.data); 
    } catch (error) {
      console.error('Ошибка при получении истории записей:', error);
    }

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

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleRefresh = () => {
    fetchHistory();
  };

  const filteredHistory = history.filter((appointment) =>
    appointment.patsient.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (history.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.recordhistory}>
      <div className={styles.titleDiv}>
        <h2 className={styles.titlerecord}>Расписание приемов</h2>
        <img 
          className={styles.updatebuttonImg} 
          src="/refresh.png" 
          onClick={handleRefresh} 
        />
      </div>
      <input
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Поиск по фамилии пациента"
        className={styles.searchInput}
      />
      <div className={styles.recordsDiv}>
        {filteredHistory.map((record, index) => (
          <Records
            key={index}
            {...record}
          />
        ))}
      </div>
    </div>
  );
}
