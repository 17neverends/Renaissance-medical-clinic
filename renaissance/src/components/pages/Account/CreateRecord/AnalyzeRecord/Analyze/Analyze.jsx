import React from 'react';
import styles from './Analyze.module.css';

export const Analyze = ({ path, h2text, isSelected, onSelect }) => {
  return (
    <div className={`${styles.doctor} ${isSelected ? styles.selected : ''} ${styles.fadeIn}`}>
      <img src={path} className={styles.logoRecord}/>
      <h2 className={styles.bannerHead}>{h2text}</h2>
      <button className={styles.openService} onClick={onSelect}>
        Далее
      </button>
    </div>
  );
};