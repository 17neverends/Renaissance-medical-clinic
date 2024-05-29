import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthData } from "../../../../auth/AuthWrapper";
import { Record } from './Record/Record'
import styles from './MyRecords.module.css'; 
import { useUserHistory } from '../CreateRecord/UserHistory/UserHistoryContext';

export const MyRecord = () => {
  const { user, records } = AuthData();
  const [history, setHistory] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const { addToHistory } = useUserHistory();


  useEffect(() => {
    fetchHistory();
  }, [records]);

  const handleDeleteRecord = (recordId) => {
    setHistory(prevHistory => prevHistory.filter(record => record.record_id !== recordId));
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    addToHistory(`${time}: Вы отменили запись на приём`);

  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/record/get_future_patsient_records?id=${user.id}`);
      const sortedHistory = response.data.sort((a, b) => {
        const dateA = new Date(a.record_date);
        const dateB = new Date(b.record_date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        const timeA = new Date(a.record_start);
        const timeB = new Date(b.record_start);
        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;
        return 0; 
      });
      
      setHistory(sortedHistory); 
    } catch (error) {
      console.error('Ошибка при получении истории записей:', error);
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleRefresh = () => {
    fetchHistory();
  };

  const filteredHistory = history.filter((record) =>
    record.doctor.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (history.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.recordhistory}>
      <div className={styles.titleDiv}>
        <h2 className={styles.titlerecord}>Мои записи</h2>
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
        placeholder="Поиск по фамилии доктора"
        className={styles.searchInput}
      />
      <div className={styles.recordsDiv}>
        {filteredHistory.map((record, index) => (
          <Record
            key={index}
            {...record}
            onDelete={handleDeleteRecord}
          />
        ))}
      </div>
    </div>
  );
}
