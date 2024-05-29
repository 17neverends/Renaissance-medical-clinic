import { PersonCard } from './PersonCard/PersonCard';
import { RecordInput } from "./RecordInput/RecordInput";
import { RecordArea } from './RecordArea/RecordArea';
import React, { useEffect, useState } from 'react';
import styles from './RecordProcess.module.css';
import axios from "axios";
import { AuthData } from "../../../../../auth/AuthWrapper";
import { useWebSocket } from '../../../../Socket/Socket';


export const RecordProcess = ({ path, name, text, purp, id }) => {
    const { user } = AuthData();
    const socket = useWebSocket(); 
    const [d, setD] = useState("");
    const [h, setH] = useState(""); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/record/get_intermediate_result", {
                    params: {
                        id: id
                    }
                });
                setD(response.data.diagnosis);
                setH(response.data.healing);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        return () => {
        };
    }, [id]);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.input === "d") {
                setD(data.message);
            } else if (data.input === "h") {
                setH(data.message);
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket]);

    return (
        <div className={styles.record}>
            <PersonCard path={path} name={name} text={text}/>
            <div className={styles.inputs}>
                <RecordInput value={purp} hold="Причина обращения"/>
                <RecordInput value={d} hold="Диагноз"/>
                <RecordArea value={h} hold="Лечение"/>
            </div>
            <PersonCard path={`/avatars/${user.photo}`} name={`${user.firstName} ${user.secondName} ${user.patronymic}`} text="Пациент"/>
        </div>
    );
};
