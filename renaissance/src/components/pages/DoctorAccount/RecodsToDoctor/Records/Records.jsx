import styles from './Records.module.css';

export const Records = ({
  patsient,
  purpose,
  record_date,
  record_start,
  record_end,
  photo,
}) => {


  return (
    <div className={styles.myrecord}>
      <div className={styles.docinfo}>
        <img src={`/avatars/${photo}`} className={styles.doclogo}/>
        <div className={styles.name}>
          <p className={styles.docp}>{patsient}</p>
          <p className={styles.docp}>Причина обращения: {purpose}</p>
        </div>
      </div>

      <div className={styles.datetime}>
        <p className={styles.date}>{record_date}</p>
        <p className={styles.time}>
          {record_start} - {record_end}
        </p>
      </div>
    </div>
  );
};
