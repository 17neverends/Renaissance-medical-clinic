import styles from './background.module.css'
import video1 from '/videoslide.mp4'
import image2 from '/slide1.jpg'
import image1 from '/slide2.jpg'
import image3 from '/lk.jpg'


export default function Background({playStatus, heroCount}) {
    if (playStatus) {
        return (
            <video className={`${styles.background} ${styles.fadein}`} autoPlay loop muted>
                <source src={video1} type='video/mp4'/>
            </video>
        )
    } 
    else if (heroCount === 0)
    {
        return <img src={image1} className={`${styles.background} ${styles.fadein}`}/>
    }
    else if (heroCount === 1)
    {
        return <img src={image2} className={`${styles.background} ${styles.fadein}`}/>
    }
    else if (heroCount === 2)
    {
        return <img src={image3} className={`${styles.background} ${styles.fadein}`}/>
    }
    else if (heroCount === 3)
    {
        return <img/>
    }
}

