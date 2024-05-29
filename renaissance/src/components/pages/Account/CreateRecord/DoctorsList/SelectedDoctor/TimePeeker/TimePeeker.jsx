import React from 'react';
import classNames from 'classnames';
import styles from './TimePeeker.module.css';

export const TimePeeker = ({ text, onClick, isSelected }) => {
    const buttonClass = classNames(styles.timepeeker, {
        [styles.selected]: isSelected
    });

    return (
        <div className={styles.fadeIn}>
            <button className={buttonClass} onClick={onClick}>{text}</button>
        </div>
    );
};
