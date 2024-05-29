import styles from './MenuCard.module.css';
import { Link } from 'react-router-dom';

export const Card = ({ img, head, text, Location, reverse }) => {
    return (
         <div className={`${styles.card} ${reverse ? styles.cardReverse : ''}`}>
              <img className={reverse ? styles.cardImgRev : styles.cardImg} src={img} alt="Card"/>
              <div className={styles.itemsDiv}>
                  <p className={styles.headText}>{head}</p>
                  <p className={styles.parText}>{text}</p>
                  <Link to={Location}>
                      <button className={styles.openService}>ПОДРОБНЕЕ</button>
                  </Link>
              </div>
         </div>
    )
  }
  
