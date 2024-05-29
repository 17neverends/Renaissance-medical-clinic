import styles from './RecordInput.module.css'

export const RecordInput = ( {hold, value} ) => {
    return (
         <div>
            <input readOnly={true} placeholder={hold} className={styles.recordinput} value={value} />
         </div>
    );
};
