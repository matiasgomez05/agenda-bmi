import './ExploreContainer.css';
import React from 'react';
import { IonButton } from '@ionic/react';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div id="container">
      <strong>{name}</strong>
      <p><IonButton>Test</IonButton></p>   
    </div>
  );
};

export default ExploreContainer;
