import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthData } from "../../../../auth/AuthWrapper";
import { RecordHistoryPoint } from './RecordHistoryPoint/RecordHistoryPoint'; 

import styles from './RecordHistory.module.css'; 

export const RecordHistory = () => {
  const { user } = AuthData();
  const [history, setHistory] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [user.id]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/record/get_records_history?id=${user.id}`);
      setHistory(response.data); 
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
    record.secondname.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (history.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.recordhistory}>
      <div className={styles.titleDiv}>
        <h2 className={styles.titlerecord}>История приемов</h2>
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
          <RecordHistoryPoint
            key={index}
            {...record}
          />
        ))}
      </div>
    </div>
  );
}
