import React, { useState, useEffect } from 'react';
import { ModalWindow } from './ModalWindow/ModalWindow';
import styles from './Service.module.css';
import { TitlePage } from '../../TitlePage/TitlePage';
import Modal from 'react-modal';

export const Service = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState({});
    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);
    const servicesData = [
        {
            title: "Диагностика",
            description: "Комплексная диагностика в нашей клинике построена по принципу «Всё включено»: прием врача, проведение различных видов исследований, включая лабораторные анализы, обследование на современном оборудовании и компьютерную томографию, а также детальная консультация специалистов по результатам диагностики. Мы стремимся обеспечить нашим пациентам полный и точный анализ их состояния здоровья, что позволяет нам назначить наиболее эффективное и целенаправленное лечение. Мониторинг положительно скажется на Вас.",
            images: [
                "/modalAnalyzes/1.jpeg",
                "/modalAnalyzes/4.jpg",
                "/modalAnalyzes/2.jpg",
            ]
        },
        {
            title: "Анализы",
            description: "Клиника предоставляет широкий спектр анализов, включающий в себя биохимические, гематологические, микробиологические и иммунологические исследования. Наши песронал работает с современным оборудованием, что гарантирует высокую точность и надежность результатов. Проведение анализов является важным этапом в диагностике заболеваний и состояний организма, и наша клиника гарантирует качественное и своевременное выполнение всех необходимых лабораторных исследований.",
            images: [
                "/modalDiagnostic/1.jpg",
                "/modalDiagnostic/2.jpg",
                "/modalDiagnostic/3.jpg",
            ]
        },
        {
            title: "Исследования",
            description: "В клинике «Ренессанс» мы проводим разнообразные диагностические исследования с применением передовых методов и технологий. Это включает в себя компьютерную томографию, магнитно-резонансную томографию, ультразвуковое исследование, рентгенографию и другие виды обследований. Наши квалифицированные специалисты и современное оборудование позволяют нам предоставлять высокоточные и надежные результаты исследований, что играет ключевую роль в диагностике и лечении различных заболеваний и состояний.",
            images: [
                "/modalExplore/1.jpg",
                "/modalExplore/2.jpg",
                "/modalExplore/3.png",
            ]
        }
    ];

    const ServiceItem = ({ service }) => {
        const { title, description, images } = service;
        
        const handleOpenModal = () => {
            setSelectedService({ title, description, images });
            setIsModalOpen(true);
        };

        return (
            <div className={styles.item}>
                <h3>{title}</h3>
                <p>{description}</p>
                <button type="button" className={styles.openService} onClick={handleOpenModal}><span>Подробнее</span></button>
            </div>
        );
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`${styles.info} ${styles.fadein}`}>
            <div className={styles.infoTitle}>
                <TitlePage text="Услуги" />
                <p className={styles.desc}>Клиника здоровья "Ренессанс" предлагает широкий спектр современных процедур и диагностических услуг, включая диагностику, анализы и исследования. Наш высококвалифицированный медицинский персонал обеспечивает индивидуальный подход к каждому пациенту, гарантируя высокий уровень качества заботы и лечения.</p>
            </div>
            <div className={styles.serviceItems}>
                {servicesData.map((service, index) => (
                    <ServiceItem key={index} service={service} />
                ))}
            </div>
            <ModalWindow isOpen={isModalOpen} closeModal={closeModal} modalTitle={selectedService.title} modalText={selectedService.description} images={selectedService.images} />
        </div>
    );
};
