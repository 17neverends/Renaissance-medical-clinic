import React from 'react';
import style from './LogoButton.module.css'; 

const LogoButton = ({ src }) => {
    return (
        <div className={style.circleButton}>
            <img className={style.Imglogo} src={src}/>
        </div>
    );
}

export default LogoButton;
