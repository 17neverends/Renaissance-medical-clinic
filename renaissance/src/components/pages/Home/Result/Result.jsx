import styles from './Result.module.css';

export const Result = ({ header, text }) => {
    return (
        <div className={styles.result}>
            <p className={styles.header}>{header}</p>
            <p className={styles.text}>{text}</p>
        </div>
    )
  }
  
