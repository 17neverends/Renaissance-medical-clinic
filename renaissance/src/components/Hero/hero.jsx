import styles from'./hero.module.css'
import myAccLogo from '../../assets/myAccLogo.png'
import play_icon from '../../assets/play_icon.png'
import pause_icon from '../../assets/pause_icon.png'
import { AuthData } from "../../auth/AuthWrapper";
import { Link } from "react-router-dom";


export default function Hero({heroData, setHeroCount, heroCount, setPlayStatus, playStatus}) {
    const { userRole, logout } = AuthData()

    return (
        <div className={styles.hero}>

            {!playStatus ? 
            <div className={styles.herotext}>
                <h1>{heroData.text1}</h1>
                <p>{heroData.text2}</p>
            </div> : null }


            {!playStatus ?   
                (userRole ?
                    <div className={styles.heroexplore}><Link to={'#'} onClick={logout}>Выйти</Link><img src={myAccLogo} /></div>
                    :
                    <div className={styles.heroexplore}> <Link to={'login'}>Войти</Link> <img src={myAccLogo} /></div>
                )
                : null}


            <div className={styles.herodotplay}>

            {!playStatus ? 
                <ul className={styles.herodots}>
                    <li onClick={() => setHeroCount(0)} className={heroCount===0 ? `${styles.herodot} ${styles.current}` : styles.herodot}></li>
                    <li onClick={() => setHeroCount(1)} className={heroCount===1 ? `${styles.herodot} ${styles.current}` : styles.herodot}></li>
                    <li onClick={() => setHeroCount(2)} className={heroCount===2 ? `${styles.herodot} ${styles.current}` : styles.herodot}></li>
                </ul>: null }
                <div className={styles.heroplay}>
                    <img onClick={() => setPlayStatus(!playStatus)} src={playStatus ? pause_icon:play_icon } />
                </div>
            </div>
        </div>
        )
    }

