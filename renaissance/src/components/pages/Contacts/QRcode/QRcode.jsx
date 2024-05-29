import React from 'react';
import style from './QRcode.module.css'; 

const QRCode = ({ src }) => {
    return (
        <img className={style.qr} src={src}/>
    );
}

export default QRCode;