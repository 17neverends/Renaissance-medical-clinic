import styles from './DoctorProfileInput.module.css';

export const DoctorProfileInput = ({ title, value}) => {
  return (
       <div className={styles.rowInput}>
            <p className={styles.titleRow}>{title}</p>
            <input type="text" className={styles.inputRow} readOnly={true} value={value}/>
       </div>
  )
}
