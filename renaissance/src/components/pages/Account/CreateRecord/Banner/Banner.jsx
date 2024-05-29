import styles from './Banner.module.css';

export const Banner = ({ path, h2text, ptext, onClick, selected }) => {
  return (
    <div className={`${styles.doctorRecord} ${selected ? styles.selected : ''}`} onClick={onClick}>
      <img src={path} className={styles.logoRecord} alt={h2text} />
      <h2 className={styles.bannerHead}>{h2text}</h2>
      <p className={styles.bannerText}>{ptext}</p>
      <button className={styles.openService}>Оформить услугу</button>
    </div>
  );
};