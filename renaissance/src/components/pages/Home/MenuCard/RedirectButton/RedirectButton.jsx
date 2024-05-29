import React from 'react';
import { useHistory } from 'react-router-dom'; 

const RedirectButton = ({ toLocation }) => {
  const history = useHistory(); 

  const handleClick = () => {
    history.push(toLocation);
  };

  return (
    <button type="button" onClick={handleClick}>Подробнее</button>
  );
};

export default RedirectButton;
