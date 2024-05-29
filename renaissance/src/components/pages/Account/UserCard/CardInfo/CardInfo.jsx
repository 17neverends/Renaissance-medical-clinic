import styles from './CardInfo.module.css';


export const CardInfo = ( {label, par} ) => {


  return (
       <div className={styles.infoLabel}>
            <label>{label}</label>
            <p>{par}</p>
       </div>
  )
}
