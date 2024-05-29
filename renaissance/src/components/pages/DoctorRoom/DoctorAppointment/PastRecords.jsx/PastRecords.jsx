import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {PastRecordPoint} from './PastRecordPoint/PastRecordPoint'
import styles from './PastRecords.module.css'; 
import { AuthData } from '../../../../../auth/AuthWrapper';

export const PastRecords = ( {pid, id} ) => {
  const [history, setHistory] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const { doctor } = AuthData();
  useEffect(() => {
    fetchHistory();
  }, [pid]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/record/get_past_records?pid=${pid}&did=${doctor.id}&id=${id}`);
      const sortedHistory = response.data.sort((a, b) => {
        return new Date(a.record_date) - new Date(b.record_date);
      });
      
      setHistory(sortedHistory);
      console.log(sortedHistory);
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
    record.record_date.toLowerCase().includes(searchValue.toLowerCase())
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
        placeholder="Поиск по дате приёма"
        className={styles.searchInput}
      />
      <div className={styles.recordsDiv}>
        {filteredHistory.map((record, index) => (
          <PastRecordPoint
            key={index}
            {...record}
          />
        ))}
      </div>
    </div>
  );
}
