import styles from './PersonalRoom.module.css';
import { AuthData } from "../../../../auth/AuthWrapper";
import { InputView } from "./InputView/InputView";
import { RoomButton } from "./RoomButton/RoomButton";
import { PatsientCard } from '../UserCard/PatsientCard'
import { DiscCard } from '../UserCard/DiscCard'
import { useState } from 'react';
import axios from 'axios';
import { useUserHistory } from '../CreateRecord/UserHistory/UserHistoryContext';

export const PersonalRoom = () => {
  const { user, setUser } = AuthData();
  const [openCard, setOpenCard] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false); 
  const { addToHistory } = useUserHistory();

  const updateData = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/patsient/update_selfdata', {
        secondName: user.secondName,
        firstName: user.firstName,
        patronymic: user.patronymic,
        email: user.email,
        phone: user.phone,
        address: user.address,
        id: user.id
      });

      setUpdateSuccess(true);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      addToHistory(`${time}: Вы успешно обновили данные аккаунта`);

      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      throw new Error();
    }
  };

  const openClick = () => {
    setOpenCard(!openCard);
  };

  const handleInputChange = (fieldName, value) => {
    setUser(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  return (
    <div className={styles.borderDiv}>
      <div className={styles.upperDiv}>
        <img className={styles.avatarImg} src={`/avatars/${user.photo}`} />
        <div className={styles.columnInputs}>
          <InputView title={"Фамилия"} value={user.secondName} onChange={(e) => handleInputChange('secondName', e.target.value)} />
          <InputView title={"Имя"} value={user.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
          <InputView title={"Отчество"} value={user.patronymic} onChange={(e) => handleInputChange('patronymic', e.target.value)} />
        </div>
      </div>

      <div className={styles.lowerDiv}>
        <InputView title={"Адрес"} value={user.address} onChange={(e) => handleInputChange('address', e.target.value)} />
        <div className={styles.rowsInputs}>
          <InputView title={"Мобильный телефон"} value={user.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
          <InputView title={"Mail"} value={user.email} onChange={(e) => handleInputChange('email', e.target.value)} />
        </div>
        <div className={styles.rowsInputs}>
          <InputView title={"Группа крови"} read={true} value={user.bloodType} />
          <InputView title={"Дата регистрации"} read={true} value={user.joinDate} />
        </div>
      </div>

      <div className={styles.buttons}>
  {!updateSuccess && <RoomButton text="Сохранить изменения" onClick={updateData} />}
  {updateSuccess && <div className={`${styles.successText} ${styles.fadein}`}>Данные успешно обновлены</div>}
  <RoomButton text={openCard ? "Скрыть мои карточки" : "Показать мои карточки"} onClick={openClick} />
</div>

      {openCard &&
        <div className={`${styles.cards} ${styles.fadein}`}>
          <PatsientCard />
          <DiscCard />
        </div>
      }
    </div>
  );
};

  