import { AuthData } from "../../../../auth/AuthWrapper";
import styles from './UserCard.module.css';
import { CardInfo} from './CardInfo/CardInfo';
 

export const DiscCard = () => {

  const { user } = AuthData();

  return (
    <div>
       <div className={styles.cardDisc}>
            <p className={styles.cardName}>Renaissance</p>
            <p className={styles.cardDesc}>Скидочная карта</p>
            <div className={styles.cardDiscInfo}>
                <div className={styles.cardCode}>
                    <p className={styles.codenumber}>{user.discCode}</p>
                    <button type="button" className={styles.copyButton}>
                        <img className={styles.gray} src="/copy.png"/>
                    </button>
                </div>
                        <CardInfo label="ФИО" par={user.secondName + " " + user.firstName + " " + user.patronymic}/>
                        <CardInfo label="Дата регистрации" par={user.joinDate}/>
                        <CardInfo label="Текущая скидка" par={user.disc}/>   
            </div>
       </div>
    </div>
  )
}
