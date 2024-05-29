import { useState, useEffect } from 'react';
import axios from 'axios';
import { Doc } from './Doc/Doc';
import { SelectedDoctor } from './SelectedDoctor/SelectedDoctor';
import styles from './DoctorsList.module.css';

export const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(3);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); 
  const [selectedDoctor, setSelectedDoctor] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/record/get_doctors');
        setDoctors(response.data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDoctorSelect = (doctorId) => {
    if (selectedDoctorId === doctorId) {
      setSelectedDoctorId(null);
      setSelectedDoctor(null);
    } else {
      const doctor = doctors.find(doc => doc.id === doctorId);
      setSelectedDoctorId(doctor.id);
      setSelectedDoctor(doctor);
    }
  };

  return (
    <div className={styles.slidercontainer}>
      <h2 className={styles.h2head}>Выберите интересующего специалиста</h2>
      <div className={styles.slider}>
        {currentDoctors.map((doctor) => (
          <Doc
            key={doctor.id}
            path={doctor.photo}
            h2text={`${doctor.firstName} ${doctor.secondName}`}
            ptext={doctor.specialty}
            isSelected={doctor.id === selectedDoctorId}
            onSelect={() => handleDoctorSelect(doctor.id)}
          />
        ))}
      </div>
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(doctors.length / doctorsPerPage) }).map((_, index) => (
          <span key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? styles.active : ''}>
            
          </span>
        ))}
      </div>

      {selectedDoctor && (
  <SelectedDoctor key={selectedDoctor.id} selectedDoctor={selectedDoctor} />
)}    </div>
  );
};
