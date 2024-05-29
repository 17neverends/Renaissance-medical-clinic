import styles from './PersonCard.module.css'

export const PersonCard = ( {path, name, text} ) => {    
    return (
         <div className={styles.card}>
                <img className={styles.cardImg} src={path}/>
                <p styles={styles.name}>{name}</p>
                <p styles={styles.post}>{text}</p>
         </div>
    );
};
