import styles from './InputView.module.css';

export const InputView = ({ title, read, value, onChange }) => {
  return (
       <div className={styles.rowInput}>
            <p className={styles.titleRow}>{title}</p>
            <input type="text" className={styles.inputRow} readOnly={read} value={value} onChange={onChange}/>
       </div>
  )
}
