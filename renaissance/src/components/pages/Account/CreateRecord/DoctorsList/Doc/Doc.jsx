import React from 'react';
import styles from './Doc.module.css';

export const Doc = ({ path, h2text, ptext, isSelected, onSelect }) => {
  return (
    <div className={`${styles.doctor} ${isSelected ? styles.selected : ''} ${styles.fadeIn}`}>
      <img src={path} className={styles.logoRecord} alt="doctor" />
      <h2 className={styles.bannerHead}>{h2text}</h2>
      <p className={styles.bannerText}>{ptext}</p>
      <button className={styles.openService} onClick={onSelect}>
        Далее
      </button>
    </div>
  );
};