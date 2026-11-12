import { useState } from 'react';
import {
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { trashOutline } from 'ionicons/icons';
import Menu from './components/Menu';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

type Reservation = {
  className: string;
  date: string;
  time: string;
  status: 'activa' | 'anulada';
};

type CompanyData = {
  name: string;
  email: string;
  phone: string;
  logo: string;
};

type Subscription = {
  name: string;
  expirationDate: string;
  creditsAvailable: number;
  creditsTotal: number;
  isActive: boolean;
};

type BookingPerson = {
  name: string;
  surname: string;
  nickname: string;
  avatar: string;
};

type ClassBooking = {
  className: string;
  date: string;
  time: string;
  people: BookingPerson[];
};

type ProfileData = {
  photo: string;
  name: string;
  surname: string;
  nickname: string;
  email: string;
  phone: string;
  emergencyContact: string;
  address: string;
  gender: string;
  birthDate: string;
};

const mockCompany: CompanyData = {
  name: 'Kuenki Studio',
  email: 'contacto@kuenki.com',
  phone: '+54 9 11 2345-6789',
  logo: 'K',
};

const mockSubscription: Subscription = {
  name: 'Membresía Creativa',
  expirationDate: '30/12/2026',
  creditsAvailable: 4,
  creditsTotal: 10,
  isActive: true,
};

const mockSubscriptions: Subscription[] = [
  { name: 'Membresía Creativa', expirationDate: '30/12/2026', creditsAvailable: 4, creditsTotal: 10, isActive: true },
  { name: 'Membresía Básica', expirationDate: '15/11/2025', creditsAvailable: 1, creditsTotal: 5, isActive: false },
  { name: 'Membresía Premium', expirationDate: '20/01/2027', creditsAvailable: 8, creditsTotal: 12, isActive: true },
  { name: 'Membresía Estudio', expirationDate: '01/09/2025', creditsAvailable: 2, creditsTotal: 6, isActive: false },
  { name: 'Membresía Pro', expirationDate: '18/03/2027', creditsAvailable: 6, creditsTotal: 8, isActive: true },
];

const mockReservations: Reservation[] = [
  { className: 'Ceramica', date: '2026-11-05', time: '11:00', status: 'activa' },
  { className: 'Ceramica', date: '2026-11-08', time: '14:00', status: 'anulada' },
  { className: 'Ceramica', date: '2026-11-12', time: '11:00', status: 'activa' },
  { className: 'Ceramica', date: '2026-11-15', time: '14:00', status: 'anulada' },
  { className: 'Ceramica', date: '2026-11-20', time: '11:00', status: 'activa' },
];

const mockProfile: ProfileData = {
  photo: 'MG',
  name: 'Matías',
  surname: 'Gómez',
  nickname: 'Mati',
  email: 'matias.gomez@kuenki.com',
  phone: '+54 9 11 2345-6789',
  emergencyContact: '+54 9 11 7654-3210',
  address: 'Av. Siempre Viva 123, CABA',
  gender: 'Masculino',
  birthDate: '1995-04-18',
};

const mockClassBookings: ClassBooking[] = [
  { className: 'Ceramica', date: '2026-11-18', time: '11:00', people: [
    { name: 'María', surname: 'López', nickname: 'Mari', avatar: 'ML' },
    { name: 'Sofía', surname: 'Ruiz', nickname: 'Sofi', avatar: 'SR' },
    { name: 'Lucía', surname: 'Naranjo', nickname: 'Luli', avatar: 'LN' },
  ] },
  { className: 'Ceramica', date: '2026-11-18', time: '14:00', people: [
    { name: 'Tomás', surname: 'Silva', nickname: 'Tom', avatar: 'TS' },
    { name: 'Eva', surname: 'Mendez', nickname: 'Ev', avatar: 'EM' },
  ] },
  { className: 'Ceramica', date: '2026-11-20', time: '11:00', people: [
    { name: 'Ana', surname: 'García', nickname: 'Anita', avatar: 'AG' },
    { name: 'Pablo', surname: 'Romero', nickname: 'Pablito', avatar: 'PR' },
    { name: 'Florencia', surname: 'Díaz', nickname: 'Flore', avatar: 'FD' },
  ] },
  { className: 'Ceramica', date: '2026-11-25', time: '11:00', people: [
    { name: 'Celia', surname: 'Torres', nickname: 'Celi', avatar: 'CT' },
    { name: 'Nico', surname: 'Alvarez', nickname: 'Niko', avatar: 'NA' },
  ] },
];

const formatPersonName = (person: BookingPerson) => `${person.name} ${person.surname} (${person.nickname})`;

const getBookingPeople = (className: string, date: string, time: string) =>
  mockClassBookings.find((booking) => booking.className === className && booking.date === date && booking.time === time)?.people ?? [];

const DashboardPage: React.FC<{
  reservation: Reservation | null;
  reservations: Reservation[];
  subscription: Subscription;
  onDeleteReservation: () => void;
}> = ({ reservation, reservations, subscription, onDeleteReservation }) => {
  const peopleForReservation = reservation ? getBookingPeople(reservation.className, reservation.date, reservation.time) : [];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ display: 'grid', gap: '24px' }}>
          {reservation ? (
            <div>
              <h2>Próxima clase reservada</h2>
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'grid',
                  gap: '8px',
                  position: 'relative',
                }}
              >
                <IonButton
                  aria-label="Eliminar reserva"
                  color="danger"
                  fill="clear"
                  size="small"
                  onClick={onDeleteReservation}
                  style={{ position: 'absolute', top: '8px', right: '8px', margin: 0 }}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>

                <p><strong>Clase:</strong> {reservation.className === 'Ceramica' ? 'Cerámica' : reservation.className}</p>
                <p><strong>Fecha:</strong> {reservation.date}</p>
                <p><strong>Horario:</strong> {reservation.time}</p>

                <div style={{ marginTop: '8px' }}>
                  <h4 style={{ margin: '0 0 8px' }}>Personas que reservaron la misma clase</h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {peopleForReservation.length > 0 ? peopleForReservation.map((person) => (
                      <div key={`${person.name}-${person.surname}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '8px 10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                          {person.avatar}
                        </div>
                        <div>{formatPersonName(person)}</div>
                      </div>
                    )) : <p style={{ margin: 0 }}>No hay personas registradas para este horario.</p>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2>No tienes reservas por el momento.</h2>
              <IonButton expand="block" routerLink="/clases">
                Ir a Clases
              </IonButton>
            </div>
          )}

          <div>
            <h3>Suscripción</h3>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'grid', gap: '8px' }}>
              <p><strong>Plan:</strong> {subscription.name}</p>
              <p><strong>Fecha de vencimiento:</strong> {subscription.expirationDate}</p>
              <p><strong>Créditos disponibles:</strong> {subscription.creditsAvailable}</p>
              <p><strong>Créditos totales:</strong> {subscription.creditsTotal}</p>
            </div>
          </div>

          <div>
            <h3>Últimas reservas</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {reservations.slice(0, 5).map((item, index) => (
                <div key={`${item.date}-${item.time}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', background: item.status === 'activa' ? '#ecfdf5' : '#fef2f2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <p style={{ margin: 0 }}><strong>{item.className === 'Ceramica' ? 'Cerámica' : item.className}</strong> - {item.date}</p>
                    <span style={{ padding: '4px 8px', borderRadius: '999px', background: item.status === 'activa' ? '#dcfce7' : '#fee2e2', color: item.status === 'activa' ? '#166534' : '#991b1b', fontSize: '12px', fontWeight: 700 }}>
                      {item.status === 'activa' ? 'Activa' : 'Anulada'}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0' }}>{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const ClassesPage: React.FC<{ onReserve: (reservation: Reservation) => void; subscription: Subscription }> = ({ onReserve, subscription }) => {
  const history = useHistory();
  const [selectedClass, setSelectedClass] = useState('Ceramica');
  const [selectedDate, setSelectedDate] = useState('2026-11-18');
  const [selectedTime, setSelectedTime] = useState('11:00');

  const matchingBookings = getBookingPeople(selectedClass, selectedDate, selectedTime);
  const creditsRemaining = subscription.creditsAvailable;
  const hasCredits = creditsRemaining > 0;

  const handleReserve = () => {
    if (!hasCredits) {
      window.alert('No tienes créditos disponibles para reservar esta clase.');
      return;
    }

    onReserve({
      className: selectedClass,
      date: selectedDate,
      time: selectedTime,
      status: 'activa',
    });

    history.push('/dashboard');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Reservas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Selecciona una clase</h2>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label htmlFor="classSelect">Clase</label>
            <select id="classSelect" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px' }}>
              <option value="Ceramica">Cerámica</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateSelect">Fecha</label>
            <input
              id="dateSelect"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
          </div>

          <div>
            <label htmlFor="timeSelect">Horario</label>
            <select id="timeSelect" value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px' }}>
              <option value="11:00">11:00</option>
              <option value="14:00">14:00</option>
            </select>
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
            <h3>Personas que reservaron esta clase</h3>
            {matchingBookings.length > 0 ? (
              <div style={{ display: 'grid', gap: '8px' }}>
                {matchingBookings.map((person) => (
                  <div key={`${person.name}-${person.surname}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '8px 10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                      {person.avatar}
                    </div>
                    <div>{formatPersonName(person)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0 }}>No hay personas registradas para este horario.</p>
            )}
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
            <p style={{ margin: 0, color: hasCredits ? '#166534' : '#991b1b', fontWeight: 600 }}>
              {hasCredits
                ? `Se consumirá 1 crédito. Quedan ${creditsRemaining} disponibles.`
                : 'No tienes créditos disponibles para reservar.'}
            </p>
          </div>

          <IonButton expand="block" onClick={handleReserve} disabled={!hasCredits}>
            Reservar clase
          </IonButton>
        </div>

        <div style={{ marginTop: '28px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
          <h3>Últimas reservas</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {mockReservations.slice(0, 5).map((item, index) => (
              <div key={`${item.date}-${item.time}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', background: item.status === 'activa' ? '#ecfdf5' : '#fef2f2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <p style={{ margin: 0 }}><strong>{item.className === 'Ceramica' ? 'Cerámica' : item.className}</strong> - {item.date}</p>
                  <span style={{ padding: '4px 8px', borderRadius: '999px', background: item.status === 'activa' ? '#dcfce7' : '#fee2e2', color: item.status === 'activa' ? '#166534' : '#991b1b', fontSize: '12px', fontWeight: 700 }}>
                    {item.status === 'activa' ? 'Activa' : 'Anulada'}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0' }}>{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const ProfilePage: React.FC<{ profile: ProfileData; onProfileChange: (nextProfile: ProfileData) => void }> = ({ profile, onProfileChange }) => {
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {profile.photo || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="photoInput">Foto de perfil</label>
              <input
                id="photoInput"
                type="text"
                value={profile.photo}
                onChange={(event) => handleInputChange('photo', event.target.value)}
                placeholder="Iniciales o URL"
                style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label htmlFor="nameInput">Nombre</label>
              <input id="nameInput" type="text" value={profile.name} onChange={(event) => handleInputChange('name', event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>

            <div>
              <label htmlFor="surnameInput">Apellido</label>
              <input id="surnameInput" type="text" value={profile.surname} onChange={(event) => handleInputChange('surname', event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>

            <div>
              <label htmlFor="nicknameInput">Apodo</label>
              <input id="nicknameInput" type="text" value={profile.nickname} onChange={(event) => handleInputChange('nickname', event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>

            <div>
              <label htmlFor="emailInput">Mail</label>
              <input id="emailInput" type="email" value={profile.email} onChange={(event) => handleInputChange('email', event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>

            <div>
              <label htmlFor="phoneInput">Teléfono</label>
              <input id="phoneInput" type="tel" value={profile.phone} onChange={(event) => handleInputChange('phone', event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>

            <div>
              <label htmlFor="emergencyInput">Contacto de emergencia</label>
              <input id="emergencyInput" type="tel" value={profile.emergencyContact} onChange={(event) => handleInputChange('emergencyContact', event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>

            <div>
              <label htmlFor="addressInput">Dirección</label>
              <input id="addressInput" type="text" value={profile.address} onChange={(event) => handleInputChange('address', event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>

            <div>
              <label htmlFor="genderInput">Género</label>
              <select id="genderInput" value={profile.gender} onChange={(event) => handleInputChange('gender', event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No binario">No binario</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            </div>

            <div>
              <label htmlFor="birthDateInput">Fecha de nacimiento</label>
              <input id="birthDateInput" type="date" value={profile.birthDate} onChange={(event) => handleInputChange('birthDate', event.target.value)} style={{ width: '100%', marginTop: '8px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const SubscriptionPage: React.FC<{ company: CompanyData; subscription: Subscription; reservations: Reservation[] }> = ({ company, subscription, reservations }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Suscripcion</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#1f2937', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {company.logo}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{company.name}</h3>
            </div>
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'grid', gap: '8px' }}>
            <p><strong>Nombre de la suscripción:</strong> {subscription.name}</p>
            <p><strong>Fecha de vencimiento:</strong> {subscription.expirationDate}</p>
            <p><strong>Créditos disponibles / totales:</strong> {subscription.creditsAvailable} / {subscription.creditsTotal}</p>
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'grid', gap: '8px' }}>
            <p><strong>Mail de contacto:</strong> {company.email}</p>
            <p><strong>Teléfono:</strong> {company.phone}</p>
          </div>

          <div>
            <h3>Últimas suscripciones</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {mockSubscriptions.slice(0, 5).map((item, index) => (
                <div key={`${item.name}-${index}`} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px', background: item.isActive ? '#ecfdf5' : '#fef2f2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <p style={{ margin: 0 }}><strong>{item.name}</strong></p>
                    <span style={{ padding: '4px 8px', borderRadius: '999px', background: item.isActive ? '#dcfce7' : '#fee2e2', color: item.isActive ? '#166534' : '#991b1b', fontSize: '12px', fontWeight: 700 }}>
                      {item.isActive ? 'Activo' : 'Vencido'}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0' }}><strong>Vencimiento:</strong> {item.expirationDate}</p>
                  <p style={{ margin: '4px 0 0' }}><strong>Créditos:</strong> {item.creditsAvailable} / {item.creditsTotal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const App: React.FC = () => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [subscription, setSubscription] = useState<Subscription>(mockSubscription);
  const [profile, setProfile] = useState<ProfileData>(mockProfile);

  const handleReserve = (nextReservation: Reservation) => {
    if (subscription.creditsAvailable <= 0) {
      window.alert('No tienes créditos disponibles para reservar esta clase.');
      return;
    }

    setSubscription((currentSubscription) => ({
      ...currentSubscription,
      creditsAvailable: Math.max(0, currentSubscription.creditsAvailable - 1),
    }));

    setReservation(nextReservation);
    setReservations((currentReservations) => [nextReservation, ...currentReservations].slice(0, 5));
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/dashboard" />
            </Route>
            <Route path="/dashboard" exact={true}>
              <DashboardPage
                reservation={reservation}
                reservations={reservations}
                subscription={subscription}
                onDeleteReservation={() => setReservation(null)}
              />
            </Route>
            <Route path="/clases" exact={true}>
              <ClassesPage onReserve={handleReserve} subscription={subscription} />
            </Route>
            <Route path="/suscripcion" exact={true}>
              <SubscriptionPage company={mockCompany} subscription={subscription} reservations={reservations} />
            </Route>
            <Route path="/perfil" exact={true}>
              <ProfilePage profile={profile} onProfileChange={setProfile} />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
