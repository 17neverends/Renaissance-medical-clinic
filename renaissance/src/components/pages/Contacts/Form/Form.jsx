import React, { useState } from 'react';
import axios from 'axios';
import style from './Form.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Form() {
  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  };
  const notify = () => toast("Данные формы успешно отправлены!");


  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/contact/get_contact_data', formData);
      console.log(response.data);
      notify()
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.text}>
        Обращайтесь с любым вопросом
      </div>
      <form>
        <div className={style.formRow}>
          <div className={style.inputData}>
            <input
              required
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <div className={style.underline}></div>
            <label>Ваше имя</label>
          </div>
          <div className={style.inputData}>
            <input
              required
              type='text'
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <div className={style.underline}></div>
            <label>Ваша фамилия</label>
          </div>
        </div>
        <div className={style.formRow}>
          <div className={style.inputData}>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <div className={style.underline}></div>
            <label>Ваша почта</label>
          </div>
          <div className={style.inputData}>
            <input
              required
              type="tel"
              maxLength={11}
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <div className={style.underline}></div>
            <label>Ваш номер телефона</label>
          </div>
        </div>
        <div className={style.formRow}>
          <div className={`${style.inputData}  ${style.textarea}`}>
            <textarea
              required
              rows="17"
              cols="10"
              name="message"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <br />
            <div className={style.underline}></div>
            <label>Ваше сообщение</label>
          </div>
        </div>
      </form>
      <button type="button" className={style.openService} onClick={handleSubmit}>Отправить</button>
      <ToastContainer /> 
    </div>
  );
}
