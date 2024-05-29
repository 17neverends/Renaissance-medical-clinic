import styles from './RecordArea.module.css'

export const RecordArea = ( {hold, value} ) => {
    return (
         <div>
            <textarea readOnly={true} placeholder={hold} className={styles.recordinput} value={value}/>
         </div>
    );
};
