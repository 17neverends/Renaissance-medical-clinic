import { Link } from "react-router-dom";
import styles from './Header.module.css';

export const RenderHeader = () => {
    return (
        <div className={styles.header}>
            <img src="/logoRen.png" className={styles.logo}/> 
            <h1><Link to={'/'}> Renaissance</Link></h1> 
        </div>
    )
}
