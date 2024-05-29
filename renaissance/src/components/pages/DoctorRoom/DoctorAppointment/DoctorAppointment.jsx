import React, { useEffect, useState } from 'react';
import styles from './DoctorAppointment.module.css';
import { PatsientCardApp } from './PatsientCardApp/PatsientCardApp';
import { AppData } from './AppData/AppData';
import { PatsientAnalyzes } from './PatsientAnalyzes/PatsientAnalyzes'
import { PastRecords } from './PastRecords.jsx/PastRecords';

export const DoctorAppointment = ({ photo,
                                name,
                                dob,
                                bloodType,
                                gender,
                                id,
                                purpose,
                                patsient_id

    }) => {


    
    return (
        <div className={styles.record}>
            <PatsientCardApp
                             photo={photo}
                             secondName={name.split(" ")[1]}
                                firstName={name.split(" ")[0]}
                                patronymic={name.split(" ")[2]}
                                dob={dob}
                                bloodType={bloodType}
                                gender={gender}
                             
                             />
            <PastRecords pid={patsient_id} id={id}/>
            <PatsientAnalyzes pid={patsient_id}/>
            <AppData
                purpose={purpose} pid={patsient_id} id={id}
            />

        </div>
    );
};
