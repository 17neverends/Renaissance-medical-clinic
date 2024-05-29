import { useReducer, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../../../../auth/AuthWrapper";
import styles from "../Login.module.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function regFormComp({ setActionAuth }) {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false); 
  const calendarRef = useRef(); 

  const [Reg, setReg] = useReducer(
    (Reg, newItem) => {
      return { ...Reg, ...newItem };
    },
    {
      secondName: "",
      firstName: "",
      patronymic: "",
      gender: "",
      dob: "",
      bloodType: "",
      email: "",
      phone: "",
      address: "",
      username: "",
      password: ""
    }
  );

  const navigate = useNavigate();
  const { reg } = AuthData();
  const [errorMessage, setErrorMessage] = useState(null);


  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{11}$/; 
  
    for (const key in Reg) {
      if (Reg.hasOwnProperty(key)) {
        if (!Reg[key]) {
          return false;
        }
  
        switch (key) {
          case 'email':
            if (!emailRegex.test(Reg[key])) {
              return false; 
            }
            break;
          case 'phone':
            if (!phoneRegex.test(Reg[key])) {
              return false; 
            }
            break;
          default:
            break;
        }
      }
    }
    return true;
  };


  const assessPasswordStrength = (password) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
  
    const typesCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSymbols].filter(Boolean).length;
  
    if (password.length < 8) {
      return "Минимальная длина 8 символов";
    } else {
      if (typesCount === 1) {
        return { level: "Легкий", color: "red" };
      } else if (typesCount === 2) {
        return { level: "Средний", color: "orange" };
      } else {
        return { level: "Сложный", color: "green" };
      }
    }
  };

  const [passwordStrength, setPasswordStrength] = useState(null);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPasswordStrength(assessPasswordStrength(password));
    setReg({ password });
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const doReg = async () => {
    try {
        if (validateForm()) {
            await reg(
                Reg.secondName,
                Reg.firstName,
                Reg.patronymic,
                Reg.gender,
                Reg.dob,
                Reg.bloodType,
                Reg.email,
                Reg.phone,
                Reg.address,
                Reg.username,
                Reg.password
            );
            navigate("/account");
        } else {
            setErrorMessage("Пожалуйста, заполните все поля");
        }
    } catch (error) {
        setErrorMessage(error.message);
}
};

  const handleSwitchToAuth = () => {
    setActionAuth(true);
  };

  const handleDateChange = date => {
    setDate(date);
    setReg({ dob: formatDate(date) }); 
    setShowCalendar(false); 
  };

  const handleClickOutside = event => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${styles.page} ${styles.fadein}`}>
      <h2>Регистрация</h2>

      <p>1. Личные данные</p>
      <div className={styles.inputs}>
        <div className={styles.input}>
          <input
            maxLength={50}
            placeholder="Фамилия"
            value={Reg.secondName}
            onChange={e => setReg({ secondName: e.target.value })}
            type="text"
          />
        </div>
        <div className={styles.input}>
          <input
            maxLength={50}
            placeholder="Имя"
            value={Reg.firstName}
            onChange={e => setReg({ firstName: e.target.value })}
            type="text"
          />
        </div>
        <div className={styles.input}>
          <input
            maxLength={20}
            placeholder="Отчество"
            value={Reg.patronymic}
            onChange={e => setReg({ patronymic: e.target.value })}
            type="text"
          />
        </div>
        <div className={styles.input}>
          <input
            maxLength={7}
            placeholder="Пол"
            value={Reg.gender}
            onChange={e => setReg({ gender: e.target.value })}
            type="text"
          />
        </div>
        <div className={styles.input}>
          <input
            maxLength={10}
            placeholder="Дата рождения (ДД.ММ.ГГГГ)"
            value={Reg.dob}
            onChange={e => setReg({ dob: e.target.value })}
            onFocus={() => setShowCalendar(true)} 
            type="text"
          />
        </div>
        {showCalendar && (
          <div ref={calendarRef} className="calendar-container">
            <Calendar onChange={handleDateChange} value={date} />
          </div>
        )}
        <div className={styles.input}>
          <input
            maxLength={3}
            placeholder="Группа крови, например II+ или I-)"
            value={Reg.bloodType}
            onChange={e => setReg({ bloodType: e.target.value })}
            type="text"
          />
        </div>
        <p>2. Контактные данные</p>

        <div className={styles.input}>
          <input
            placeholder="Mail"
            value={Reg.email}
            onChange={e => setReg({ email: e.target.value })}
            type="text"
          />
        </div>
        <div className={styles.input}>
          <input
          maxLength={11}
            placeholder="Телефон"
            value={Reg.phone}
            onChange={e => setReg({ phone: e.target.value })}
            type="text"
          />
        </div>
        <div className={styles.input}>
          <input
            maxLength={70}
            placeholder="Адрес"
            value={Reg.address}
            onChange={e => setReg({ address: e.target.value })}
            type="text"
          />
        </div>
        <p>3. Данные для входа</p>

        <div className={styles.input}>
          <input
            placeholder="Логин"
            value={Reg.username}
            onChange={e => setReg({ username: e.target.value })}
            type="text"
          />
        </div>
        <div className={styles.input}>
        <input
          placeholder="Пароль"
          value={Reg.password}
          onChange={handlePasswordChange}
          type="password"
        />
        {passwordStrength && (
          <div style={{ color: passwordStrength.color }}>
            {passwordStrength === "Минимальная длина 8 символов" ? passwordStrength : `${passwordStrength.level} пароль`}
          </div>
        )}
        </div>

        <div className={styles.button}>
          <button className={styles.openService} onClick={doReg}>
            Войти
          </button>
        </div>
        {errorMessage ? (
          <div className={styles.error}>{errorMessage}</div>
        ) : null}

        <div className={styles.switch} onClick={handleSwitchToAuth}>
          Уже есть аккаунт? Войти
        </div>
      </div>
    </div>
  );
}
