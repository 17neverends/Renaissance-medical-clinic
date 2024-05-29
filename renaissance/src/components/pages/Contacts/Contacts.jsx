import React, { useState } from 'react';
import style from './Contacts.module.css'; 
import qrLogo from './logoSocial/QRlogo.png';
import qrTg from './logoSocial/qrTG.png';
import qrVk from './logoSocial/qrVK.png';
import qrWa from './logoSocial/qrWA.png';
import Tg from './logoSocial/tg.png';
import Vk from './logoSocial/vk.jpg';
import Wa from './logoSocial/WA.jpg';
import hospital from './logoSocial/hospital.png';
import QRCode from './QRcode/QRcode';
import LogoButton from './LogoButton/LogoButton';
import  Form  from './Form/Form';

const Contact = () => {
  const [qrDisplay, setQrDisplay] = useState(false);

  return (

      <div className={`${style.info} ${style.fadein}`}>
        <h2 className={style.title}>Наши контакты</h2>
        <div className={style.contactInfo}>
          <img className={style.contactImg} src={hospital}/>
          <div>
            <p className={style.links}> <a href="https://yandex.ru/maps/org/donskoy_gosudarstvenny_tekhnicheskiy_universitet/100522677108/?ll=39.711788%2C47.237229&z=16.77" target="_blank">Наш адрес</a></p>
            <p className={style.links}><a href="tel:+7XXXXXXXXXX">+7 (XXX) XXX-XX-XX</a></p>
            <div>
              <LogoButton src={Wa}/>
              <LogoButton src={Vk}/>
              <LogoButton src={Tg}/>
            </div>
            <div>
              <p>Режим работы:</p>
              <p>Понедельник - воскресенье</p>
              <p>c 07:00 до 21:00</p>
            </div>
             <div  onClick={() => setQrDisplay(!qrDisplay)}>
              <LogoButton src={qrLogo}/>

             </div>

          </div>
        </div>
        {qrDisplay ?         <div className={`${style.hiddenQRs} ${style.fadein}`}>
          <div className={style.QRs}>
                        <QRCode src={qrWa} />
                        <QRCode src={qrVk} />
                        <QRCode src={qrTg} />
          </div>
          <div className={style.centeredButtonContainer}>
            <button type="button" className={style.openService} onClick={() => setQrDisplay(!qrDisplay)}>Закрыть</button>
          </div>
        </div> : null}
        <Form/>
      </div>
    
    
  );
}

export default Contact;
