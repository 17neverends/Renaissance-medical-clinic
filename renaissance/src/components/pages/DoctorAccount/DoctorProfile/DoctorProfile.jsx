import styles from './DoctorProfile.module.css';
import { AuthData } from '../../../../auth/AuthWrapper';
import { DoctorProfileInput } from './DoctorProfileInput/DoctorProfileInput';

export const DoctorProfile = () => {
  const { doctor } = AuthData();


  return (
    <div className={styles.borderDiv}>
      <div className={styles.upperDiv}>
        <img className={styles.avatarImg} src={`${doctor.photo}`} />
        <div className={styles.columnInputs}>
          <DoctorProfileInput title={"Фамилия"} value={doctor.secondName} />
          <DoctorProfileInput title={"Имя"} value={doctor.firstName} />
          <DoctorProfileInput title={"Отчество"} value={doctor.patronymic} />
          <DoctorProfileInput title={"Специальность"} value={doctor.specialty} />

        </div>
      </div>
    </div>
  );
};

  