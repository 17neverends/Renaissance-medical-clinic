import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ pid, children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false); 

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/${pid}`);
        ws.onopen = () => {
            console.log('Подключение установленно');
            setIsConnected(true); 
        };
        ws.onclose = () => {
            console.log('Закрыто');
            setIsConnected(false);
        };

        setSocket(ws);

        return () => {
            if (ws && isConnected) {
                ws.close();
            }
        };
    }, [pid, isConnected]); 

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};
