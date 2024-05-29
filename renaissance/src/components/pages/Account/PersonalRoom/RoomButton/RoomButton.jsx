import styles from './RoomButton.module.css';

export const RoomButton = ({ onClick, text }) => {
  return (
    <div>
      <button type='button' className={styles.openService} onClick={onClick}>{text}</button>
    </div>
  )
}