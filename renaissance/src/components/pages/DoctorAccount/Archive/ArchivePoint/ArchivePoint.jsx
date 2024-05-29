import React, { useState } from 'react';
import styles from './ArchivePoint.module.css';

export const ArchivePoint = ({
  firstname,
  secondname,
  patronymic,
  photo,
  concat,
  date,
  purpose,
  diagnosis,
  healing,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className={styles.full} onClick={toggleDetails}>
      <div className={styles.recordpoint}>
        <div className={styles.docinfo}>
          <img src={`/avatars/${photo}`} className={styles.doclogo} />
          <div className={styles.name}>
            <p className={styles.docp}>{secondname}</p>
            <p className={styles.docp}>{firstname}</p>
            <p className={styles.docp}>{patronymic}</p>
          </div>
        </div>
        <div className={styles.datetime}>
          <p className={styles.date}>{date}</p>
          <p className={styles.time}>{concat}</p>
        </div>
      </div>
      {showDetails && (
        <div className={styles.addit}>
          <p className={styles.additinfo}>Причина обращения: {purpose}</p>
          <p className={styles.additinfo}>Поставленный диагноз: {diagnosis}</p>
          <p className={styles.additinfo}>Назначенное лечение: {healing}</p>
        </div>
      )}
    </div>
  );
};
