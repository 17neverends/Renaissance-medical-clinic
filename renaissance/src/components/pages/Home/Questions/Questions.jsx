import React from 'react';
import styles from './Questions.module.css';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';

const Question = ({ header, text }) => {
    const [ref, inView] = useInView({
        threshold: 0.5,
    });

    const props = useSpring({
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
    });

    return (
        <animated.div style={props} className={styles.question} ref={ref}>
            <p className={styles.header}>{header}</p>
            <p className={styles.text}>{text}</p>
        </animated.div>
    );
};

export default Question;
