import React, { useState, useEffect } from 'react';
import data from './doc.json';
import styles from './Personal.module.css';
import { TitlePage } from "../../TitlePage/TitlePage";

export default function Slider() {
    const [currentPage, setCurrentPage] = useState(0);
    const [slidesArray, setSlidesArray] = useState([]);
    useEffect(() => {
        const slidesPerPage = 3;
        const doctorsArray = [];
        
        const dataArray = Object.values(data);

        for (let i = 0; i < dataArray.length; i += slidesPerPage) {
            const doctors = dataArray.slice(i, i + slidesPerPage);
            doctorsArray.push(doctors);
        }

        setSlidesArray(doctorsArray);
    }, []);

    function showSlide(index) {
        setCurrentPage(index);
    }
    return (
        <div className={`${styles.info} ${styles.fadein}`}>
            <TitlePage text="Персонал" />
            <p className={styles.personalDesc}>Клиника гордится профессиональным и дружелюбным персоналом, преданным заботе о Вашем здоровье. Наши врачи - это не только высококвалифицированные специалисты с многолетним опытом, но и настоящие партнёры на Вашем пути к здоровью. Каждый член нашей медицинской команды стремится обеспечить вас самыми передовыми методами диагностики и лечения.</p>

            <div className={styles.sliderWithButtons}>
            <button className={styles.sliderButton} onClick={() => showSlide((currentPage - 1 + slidesArray.length) % slidesArray.length)}>←</button>
        
            <div className={styles.sliderContainer}>
                {slidesArray.map((doctors, index) => (
                    <div className={styles.docContainer} key={index} style={{ display: currentPage === index ? 'flex' : 'none' }}>
                        {doctors.map((doctor, doctorIndex) => (
                            <div className={styles.doc} key={doctorIndex}>
                                <p className={styles.docName}>{doctor.docName}</p>
                                <p className={styles.docDesc}>{doctor.docDesc}</p>
                                <img className={styles.docImg} src={doctor.docImg}/>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        
            <button className={styles.sliderButton} onClick={() => showSlide((currentPage + 1) % slidesArray.length)}>→</button>
        </div>
    </div>
    );
}
