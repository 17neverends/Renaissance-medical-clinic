import { useState } from 'react';
import styles from './Record.module.css';
import axios from 'axios';
import { AuthData } from '../../../../../auth/AuthWrapper';

export const Record = ({
  doctor,
  specialty,
  record_date,
  record_start,
  record_end,
  photo,
  purpose,
  record_id,
  onDelete
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const {user, records, setRecords} = AuthData();
  const handleDelete = async () => {
    const currentTime = new Date();
    const recordDateTime = new Date(`${record_date}T${record_start}`);
    const recordDateTimeEnd = new Date(`${record_date}T${record_end}`);

    if (currentTime < recordDateTime || currentTime > recordDateTimeEnd) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/record/delete_record?id=${record_id}`, {
          method: 'POST',
        });
        if (response.ok) {
          onDelete(record_id);
          try {
            const records_response = await axios.get("http://127.0.0.1:8000/record/get_patsient_records",{
                params: {
                    id: user.id
                }
            });;
            if (records_response.status === 200) {
                setRecords(records_response.data);
            }
        } catch (error) {
            console.error("Ошибка при получении записей пациента:", error);
        }
        } else {
          setModalMessage('Не удалось отменить запись.');
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        setModalMessage('Произошла ошибка при удалении записи.');
        setShowModal(true);
      }
    } else {
      setModalMessage('Нельзя отменить запись, так как прием уже начался.');
      setShowModal(true);
    }
  };

  return (
    <div className={styles.myrecord}>
      <div className={styles.docinfo}>
        <img src={photo} className={styles.doclogo}/>
        <div className={styles.name}>
          <p className={styles.docp}>{doctor}</p>
          <p className={styles.docp}>{specialty}</p>
          <p className={styles.docp}>Причина обращения: {purpose}</p>
        </div>
      </div>

      <div className={styles.datetime}>
        <p className={styles.date}>{record_date}</p>
        <p className={styles.time}>
          {record_start} - {record_end}
        </p>
      </div>
      <img
        className={styles.updatebuttonImg}
        src="/delete.png"
        onClick={handleDelete}
      />
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeBtn} onClick={() => setShowModal(false)}>
              &times;
            </span>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
