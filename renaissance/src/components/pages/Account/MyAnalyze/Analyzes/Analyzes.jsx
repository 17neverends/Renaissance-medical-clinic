import styles from './Analyze.module.css';

export const Analyzes = ({
  analyze_name,
  date,
  photo,
  result
}) => {

  

  return (
    <div className={styles.myrecord}>
      <div className={styles.docinfo}>
        <img src={photo} className={styles.doclogo}/>
        <div className={styles.name}>
          <p className={styles.docp}>{analyze_name}</p>
          <p className={styles.docr}>{result ? `Результат: ${result}` : "Результатов нет. Обратитесь позже или обновите страницу"}</p>

        </div>
      </div>

      <div className={styles.datetime}>
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
};
