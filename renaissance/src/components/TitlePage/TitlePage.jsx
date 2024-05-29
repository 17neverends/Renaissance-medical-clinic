import React from "react";
import styles from "./TitlePage.module.css";

export const TitlePage = ({ text }) => {
    return (
        <h2 className={styles.title}>{text}</h2>
    );
};