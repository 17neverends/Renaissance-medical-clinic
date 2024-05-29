import styles from './PatsientCardApp.module.css';
import { InputView } from '../../../Account/PersonalRoom/InputView/InputView';

export const PatsientCardApp = ({
    photo,
    secondName,
    firstName,
    patronymic,
    dob,
    bloodType,
    gender

}) => {

  return (
    <div className={styles.borderDiv}>
      <div className={styles.upperDiv}>
        <img className={styles.avatarImg} src={`/avatars/${photo}`} />
        <div className={styles.cols}>
          <div className={styles.columnInputs}>
              <InputView title={"Фамилия"} value={secondName} read={true}/>
              <InputView title={"Имя"} value={firstName}  read={true}/>
              <InputView title={"Отчество"} value={patronymic}  read={true}/>
          </div>
          <div className={styles.lowerDiv}>
              <InputView title={"Дата рождения"} read={true} value={dob} />
              <InputView title={"Группа крови"} read={true} value={bloodType} />
              <InputView title={"Пол"} read={true} value={gender} />
          </div>
        </div>
      </div>




    </div>
  );
};

  