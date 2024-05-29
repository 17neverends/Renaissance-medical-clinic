import React from 'react';
import { useUserHistory } from './UserHistoryContext';
import styles from './UserHistory.module.css';

export const UserHistory = () => {
  const { userHistory } = useUserHistory();
  
  if (userHistory.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.userHistoryContainer}>
      <h2 className={styles.userHistoryTitle}>История операций сессии</h2>
      <ul className={styles.userHistoryList}>
        {userHistory.map((action, index) => (
          <li key={index} className={styles.userHistoryItem}>{action}</li>
        ))}
      </ul>
    </div>
  );
};
