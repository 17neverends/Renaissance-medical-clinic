import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AnalyzeRecord.module.css';
import { Analyze } from './Analyze/Analyze';
import { SelectedAnalyze } from './SelectedAnalyze/SelectedAnalyze';

export const AnalyzeRecord = () => {
  const [analyze, setAnalyze] = useState([]);
  const [selectedAnalyzeID, setselectedAnalyzeID] = useState(null); 
  const [selectedAnalyze, setSelectedAnalyze] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/analyze/get_analyze');
        setAnalyze(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);


  const handleAnalyzeelect = (analyzeId) => {
    if (selectedAnalyzeID === analyzeId) {
      setselectedAnalyzeID(null);
      setSelectedAnalyze(null);
    } else {
      const analyze2 = analyze.find(a => a.id === analyzeId);
      setselectedAnalyzeID(analyze2.id);
      setSelectedAnalyze(analyze2);
    }
  };

  return (
    <div className={styles.slidercontainer}>
      <h2 className={styles.h2head}>Выберите анализ</h2>
      <div className={styles.slider}>
        {analyze.map((analyze) => (
          <Analyze
            key={analyze.id}
            path={analyze.photo}
            h2text={analyze.name}
            isSelected={analyze.id === selectedAnalyzeID}
            onSelect={() => handleAnalyzeelect(analyze.id)}
          />
        ))}
      </div>
      {selectedAnalyze && (
  <SelectedAnalyze key={selectedAnalyze.id} selectedAnalyze={selectedAnalyze} />
)}    </div>
  );
};
