import React from 'react';
import Modal from 'react-modal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './ModalWindow.module.css'; 

export const ModalWindow = ({ isOpen, closeModal, modalTitle, modalText, images }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  const modalStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    },
    content: {
      top: '50%', 
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%', 
      transform: 'translate(-50%, -50%)', 
      maxWidth: '90%',
      width: '90%', 
      maxHeight: '90%', 
      height: '90%',
      borderRadius: '20px',
      padding: '40px'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      style={modalStyle} 
    >
      <button className={styles.closeButton} onClick={closeModal}>✕</button> 
      <p className={styles.modalTitle}>{modalTitle}</p>
      <p className={styles.modalText}>{modalText}</p>
      <Slider {...settings}>
        {images && images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ))}
      </Slider>
    </Modal>
  );
};

