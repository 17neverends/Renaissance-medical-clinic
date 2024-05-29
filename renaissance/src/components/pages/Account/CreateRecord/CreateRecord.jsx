import { useState } from 'react';
import { Banner } from './Banner/Banner';
import styles from './CreateRecord.module.css';
import { DoctorsList } from './DoctorsList/DoctorsList';
import { AnalyzeRecord } from './AnalyzeRecord/AnalyzeRecord';

export const CreateRecord = () => {
  const [selectedBanner, setSelectedBanner] = useState(null);

  const handleBannerClick = (banner) => {
    if (selectedBanner === banner) {
      setSelectedBanner(null);
    } else {
      setSelectedBanner(banner);
    }
  };

  return (
    <div className={styles.chooseDiv}>
      <h1 className={styles.h1head}>Выберите интересующую услугу</h1>
      <div className={styles.banners}>
        <Banner
          path="/banners/banner1.jpg"
          h2text="Запись на прием"
          ptext="Консультация с врачом в выбранное время. Врач определяет порядок дальнейших действий"
          onClick={() => handleBannerClick('Запись на прием')}
          selected={selectedBanner === 'Запись на прием'}
        />
        <Banner
          path="/banners/banner2.jpg"
          h2text="Сдача анализов"
          ptext="Сдача выбранного анализа. Результаты как можно скорее"
          onClick={() => handleBannerClick('Сдача анализов')}
          selected={selectedBanner === 'Сдача анализов'}
        />
      </div>
      {selectedBanner === 'Запись на прием' && <DoctorsList />}
      {selectedBanner === 'Сдача анализов' && <AnalyzeRecord />}

    </div>
  );
};
