import styles from './PastRecordPoint.module.css';

export const PastRecordPoint = ({
  record_start, record_end,
  record_date,
  purpose,
  diagnosis,
  healing,
}) => {


  return (
    <div className={styles.full}>
      <div className={styles.recordpoint}>
        <div className={styles.docinfo}>
            <p className={styles.docp}>Причина обращения: {purpose}</p>
            <p className={styles.docp}>Диагноз: {diagnosis}</p>
            <p className={styles.docp}>Лечение: {healing}</p>
        </div>

        <div className={styles.datetime}>
          <p className={styles.date}>{record_date}</p>
          <p className={styles.time}>{record_start} - {record_end}</p>
        </div>
      </div>
    </div>
  );
};
