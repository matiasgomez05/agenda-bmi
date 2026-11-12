import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { gridOutline, schoolOutline, cardOutline } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    iosIcon: gridOutline,
    mdIcon: gridOutline,
  },
  {
    title: 'Reservas',
    url: '/clases',
    iosIcon: schoolOutline,
    mdIcon: schoolOutline,
  },
  {
    title: 'Suscripcion',
    url: '/suscripcion',
    iosIcon: cardOutline,
    mdIcon: cardOutline,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <div className="user-profile-card">
          <div className="user-profile-header">
            <div className="user-avatar">MG</div>
            <div className="user-info">
              <strong>Matías Gómez</strong>
            </div>
          </div>

          <IonButton expand="block" fill="outline" size="small" routerLink="/perfil" routerDirection="none">
            Ver perfil
          </IonButton>
        </div>

        <IonList id="inbox-list">
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  button
                  className={location.pathname === appPage.url ? 'selected' : ''}
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
