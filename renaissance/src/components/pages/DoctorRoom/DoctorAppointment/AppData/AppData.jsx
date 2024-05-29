import React, { useState, useEffect } from 'react';
import styles from './AppData.module.css';
import { useWebSocket } from '../../../../Socket/Socket';

export const AppData = ({ purpose, pid, id}) => {
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const socket = useWebSocket(); 

    const handleButtonClick = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                id: id,
                diagnosis: diagnosis,
                treatment: treatment
            };
            socket.send(JSON.stringify(message));
        }
    };

    return (
        <div className={styles.inputs}>
            <p className={styles.appData}>Данные приёма</p>
            <input
                className={styles.recordinput}
                readOnly={true}
                value={purpose}
                placeholder={purpose}
            />
            <input
                className={styles.recordinput}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Диагноз"
            />
            <textarea
                className={styles.areaInput}
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="Лечение"
            />
            <button className={styles.openService} onClick={handleButtonClick}>Сохранить</button>
        </div>
    );
};
