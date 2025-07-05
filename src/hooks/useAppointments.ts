import { useState, useEffect } from 'react';
import { Appointment } from '../types';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
  };

  const bookAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedAppointments = [...appointments, newAppointment];
    saveAppointments(updatedAppointments);
    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === id ? { ...apt, ...updates } : apt
    );
    saveAppointments(updatedAppointments);
  };

  const getProviderAppointments = (providerId: string) => {
    return appointments.filter(apt => apt.providerId === providerId);
  };

  return {
    appointments,
    bookAppointment,
    updateAppointment,
    getProviderAppointments
  };
}