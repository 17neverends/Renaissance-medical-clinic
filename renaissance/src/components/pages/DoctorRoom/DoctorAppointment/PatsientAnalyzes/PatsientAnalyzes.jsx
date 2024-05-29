import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Analyzes } from '../../../Account/MyAnalyze/Analyzes/Analyzes';
import styles from './PatsientAnalyzes.module.css'; 

export const PatsientAnalyzes = ( {pid} ) => {
  const [history, setHistory] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/analyze/get_ready_analyzes?id=${pid}`);
      const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date)); 
      setHistory(sortedData); 
      console.log(sortedData)
    } catch (error) {
      console.error('Ошибка при получении истории записей:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredHistory = history.filter((record) =>
    record.analyze_name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleRefresh = () => {
    fetchHistory();
  };

  if (history.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.recordhistory}>
      <div className={styles.titleDiv}>
        <h2 className={styles.titlerecord}>Готовые анализы пациента</h2>
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
        placeholder="Поиск по названию анализа"
        className={styles.searchInput}
      />
      <div className={styles.recordsDiv}>
        {filteredHistory.map((record, index) => (
          <Analyzes
            key={index}
            {...record}
          />
        ))}
      </div>
    </div>
  );
}
