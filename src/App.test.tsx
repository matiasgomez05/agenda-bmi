import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from './App';

test('renders dashboard by default and shows no reservation message', () => {
  window.history.pushState({}, '', '/dashboard');
  render(<App />);

  expect(document.body.textContent).toContain('No tienes reservas por el momento.');
  expect(document.body.textContent).toContain('Ir a Clases');
});

test('allows selecting a class and updates the dashboard reservation', () => {
  window.history.pushState({}, '', '/clases');
  const { container } = render(<App />);

  expect(document.body.textContent).toContain('Selecciona una clase');

  fireEvent.change(document.getElementById('classSelect') as HTMLSelectElement, { target: { value: 'Ceramica' } });
  fireEvent.change(document.getElementById('dateSelect') as HTMLSelectElement, { target: { value: '2026-11-18' } });
  fireEvent.change(document.getElementById('timeSelect') as HTMLSelectElement, { target: { value: '11:00' } });

  const reserveButton = Array.from(document.body.querySelectorAll('ion-button')).find((button) =>
    button.outerHTML.includes('Reservar clase')
  ) as HTMLElement | undefined;

  if (!reserveButton) {
    throw new Error('No se encontró el botón de reserva');
  }

  fireEvent.click(reserveButton);

  expect(document.body.textContent).toContain('Próxima clase reservada');
  expect(document.body.textContent).toContain('Cerámica');
  expect(document.body.textContent).toContain('Fecha: 2026-11-18');
  expect(document.body.textContent).toContain('Horario: 11:00');

  const deleteButton = Array.from(document.body.querySelectorAll('ion-button')).find((button) =>
    button.outerHTML.includes('aria-label="Eliminar reserva"')
  ) as HTMLElement | undefined;

  if (!deleteButton) {
    throw new Error('No se encontró el botón de eliminación');
  }

  fireEvent.click(deleteButton);

  expect(document.body.textContent).toContain('No tienes reservas por el momento.');
});

test('shows the credit consumption legend in the reservation view', () => {
  window.history.pushState({}, '', '/clases');
  render(<App />);

  expect(document.body.textContent).toContain('Se consumirá 1 crédito. Quedan 4 disponibles.');
});
