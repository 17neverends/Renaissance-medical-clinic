import React from 'react';
import styles from './Account.module.css';
import { AuthData } from "../../../auth/AuthWrapper";
import { PersonalRoom } from './PersonalRoom/PersonalRoom'
import { CreateRecord } from './CreateRecord/CreateRecord'
import { UserHistory } from './CreateRecord/UserHistory/UserHistory';
import { UserHistoryProvider } from './CreateRecord/UserHistory/UserHistoryContext';
import { useAppointmentManager } from '../Private/AppointmentManager';
import { RecordHistory } from './RecordHistory/RecordHistory';
import { MyRecord } from './MyRecords/MyRecords';
import { MyAnalyze } from './MyAnalyze/MyAnalyze';

export const Account = () => {
  const { user, records } = AuthData();
  const { roomStatus, currentAppointment } = useAppointmentManager(records);

  return (
    
    <div className={`${styles.main} ${styles.fadein} `}>
      <p className={styles.welcome}>Добро пожаловать, {user.secondName + " " + user.firstName + " " + user.patronymic}!</p>
      <p className={styles.welcomeDesc}>В личном кабинете хранятся Ваши личные данные, история посещений и отзывы. Для записи заполните форму ниже</p>
      <UserHistoryProvider>
        <PersonalRoom/>
        <CreateRecord/>
        <MyAnalyze/>
        <MyRecord/>
        <RecordHistory/>
        <UserHistory/>
      </UserHistoryProvider>
    </div>
  )
}
