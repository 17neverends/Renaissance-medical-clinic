import { AuthData } from "../../../../auth/AuthWrapper";
import styles from './UserCard.module.css';
import { CardInfo} from './CardInfo/CardInfo';
 

export const PatsientCard = () => {

  const { user } = AuthData();

  return (
    <div>
       <div className={styles.patcientCard}>
            <p className={styles.cardName}>Renaissance</p>
            <p className={styles.cardDesc}>Амбулаторная карточка</p>
            <div className={styles.patcientCardInfo}>
                    <CardInfo label="Фамилия" par={user.secondName}/>

                    <div className={styles.polisRow}>

                        <CardInfo label="Имя" par={user.firstName}/>
                        <CardInfo label="Дата регистрации" par={user.joinDate}/>

                    </div>

                    <div className={styles.polisRow}>

                        <CardInfo label="Отчество" par={user.patronymic}/>
                        <CardInfo label="Группа крови" par={user.bloodType}/>


                    </div>

                    <div className={styles.polisRow}>
                        <CardInfo label="Дата рождения" par={user.dob}/>
                        <CardInfo label="Пол" par={user.gender}/>
                    </div>
            </div>
       </div>
    </div>
  )
}
