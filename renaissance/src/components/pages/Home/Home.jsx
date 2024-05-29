import Background from '../../Background/background';
import Hero from '../../Hero/hero';
import { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { Card } from './MenuCard/MenuCard';
import { AuthData } from "../../../auth/AuthWrapper";
import { Result } from './Result/Result';
import Questions from './Questions/Questions';
import Contact from '../Contacts/Contacts';


export const Home = () => {
  const { user, logout, userRole } = AuthData()

     let heroData = [
          {text1: "Персонал", text2: "В нашей клинике собран коллектив специалистов, каждый из которых имеет высокую квалификацию и профессионально зарекомендовал себя как среди коллег, так и среди пациентов."},
          {text1: "Услуги", text2: 'Клиника здоровья "Ренессанс" предлагает широкий спектр современных процедур и диагностических услуг, включая диагностику, анализы и исследования.'},
          {text1: "Контакты", text2: "Наши контакты представлены внизу этой страницы. Также есть форма для обратной связи, а также вопросов на любые темы."},
        ];
        
        const [heroCount, setHeroCount] = useState(0);
        const [playStatus, setPlayStatus] = useState(false);

        useEffect(() => {
          let intervalId;
        
          if (!playStatus && heroCount !== 3) {
            intervalId = setInterval(() => {
              setHeroCount((count) => (count === 2 ? 0 : count + 1));
            }, 3000);
          }
        
          return () => clearInterval(intervalId); 
        }, [playStatus]);

    return (
        <div>
         <div className={styles.background}>
            <Background playStatus={playStatus} heroCount={heroCount}/>
            <div className={styles.heroContainer}>
              <Hero 
                setPlayStatus={setPlayStatus}
                heroData={heroData[heroCount]}
                heroCount={heroCount}
                setHeroCount={setHeroCount}
                playStatus={playStatus}
              />
              </div>
         </div>
         <div className={styles.about}>
            <img src="/goodph.jpg" className={styles.docsImg}></img>
            <div className={styles.infoDiv}>
              <p className={styles.infoTitle}>О нас</p>
              <div className={styles.infoParaghs}>
                <p>Наша миссия - обеспечить высококачественное медицинское обслуживание и поддержку пациентов в их стремлении к здоровому и активному образу жизни.</p>
              </div>
            </div>
          </div>
         <div className={styles.wrapper}>
            <div className={styles.parallaxImg}>
              <div className={styles.blurBg}></div>
              <div className={styles.service}>
                <Card img="/card1.jpeg" head="Уникальные услуги" text="Откройте для себя мир инновационных медицинских услуг, которые перевернут ваше представление о здоровье." Location={"/service"} reverse={false}/>
                <Card img="/card2.jpeg" head="Элитный персонал" text="Наши врачи - настоящие звезды медицины, готовые сделать чудо для вашего здоровья." Location={"/personal"} reverse={true}/>
                <Card
  img="/card3.jpg"
  head="Личный кабинет пациента"
  text="Управляйте своим здоровьем онлайн, будьте в курсе всех назначений и рекомендаций."
  Location={
    userRole === "patsient"
      ? "/account"
      : userRole === "doctor"
      ? "/doctor"
      : "/login"
  }
  reverse={false}
/>              </div>
            </div>
          </div>  

          <div className={styles.resultsDiv}>
            <Result header="100%" text="Успешных операций"/>
            <Result header="24/7" text="Поддержка врачей"/>
            <Result header="1000+" text="Довольных пациентов"/>
          </div>

          <div className={styles.questions}>
            <div className={styles.parallaxImg}>
              <div className={styles.blurBg}></div>
              <div className={styles.questionDiv}>              
                <Questions header="Как записаться на прием?" text="Для записи на прием воспользуйтесь нашим удобным онлайн-календарем или позвоните нам."/>
                <Questions header="Какие услуги предоставляете?" text="Мы предлагаем широкий спектр медицинских услуг, включая консультации специалистов и диагностику."/>
                <Questions header="Каковы цены на услуги?" text="Цены на наши услуги разнообразны и адаптированы к разным бюджетам, уточните у наших менеджеров."/>
                <Questions header="Какие документы нужны для приема?" text="Для приема необходим паспорт и медицинская страховка, при необходимости возьмите с собой результаты анализов."/>
                <Questions header="Как часто нужно проходить осмотр?" text="Регулярные осмотры рекомендуются в зависимости от возраста и состояния здоровья, проконсультируйтесь с врачом."/>
              </div>
            </div>
          </div>  

          <Contact/>




         </div>
    )
}