import React from 'react';
import { useParams } from 'react-router-dom';

const TrackOrder = () => {
  let { id } = useParams();

  return (
    <div>
      <h2>Track Order {id}</h2>
      {/* Add track order details here */}
    </div>
  );
};

export default TrackOrder;
