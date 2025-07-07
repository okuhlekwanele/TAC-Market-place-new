import { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { useGoogleSheets } from './useGoogleSheets';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { syncAppointmentToSheets } = useGoogleSheets();

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      const parsedAppointments = JSON.parse(savedAppointments).map((apt: any) => ({
        ...apt,
        createdAt: new Date(apt.createdAt)
      }));
      setAppointments(parsedAppointments);
    }
  }, []);

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
  };

  const bookAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    setLoading(true);
    
    try {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      
      const updatedAppointments = [...appointments, newAppointment];
      saveAppointments(updatedAppointments);
      
      // Try to sync to Google Sheets
      try {
        await syncAppointmentToSheets(newAppointment);
      } catch (sheetsError) {
        console.warn('Google Sheets sync failed for appointment, but appointment was saved locally:', sheetsError);
      }
      
      return newAppointment;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    const updatedAppointments = appointments.map(apt => {
      if (apt.id === id) {
        const updatedApt = { ...apt, ...updates };
        // Try to sync updated appointment to Google Sheets
        syncAppointmentToSheets(updatedApt).catch(error => {
          console.warn('Google Sheets sync failed for appointment update:', error);
        });
        return updatedApt;
      }
      return apt;
    });
    saveAppointments(updatedAppointments);
  };

  const getProviderAppointments = (providerId: string) => {
    return appointments.filter(apt => apt.providerId === providerId);
  };

  const getClientAppointments = (clientEmail: string) => {
    return appointments.filter(apt => apt.clientEmail === clientEmail);
  };

  const cancelAppointment = async (id: string) => {
    await updateAppointment(id, { status: 'Cancelled' });
  };

  const confirmAppointment = async (id: string) => {
    await updateAppointment(id, { status: 'Confirmed' });
  };

  const completeAppointment = async (id: string) => {
    await updateAppointment(id, { status: 'Completed' });
  };

  return {
    appointments,
    loading,
    bookAppointment,
    updateAppointment,
    getProviderAppointments,
    getClientAppointments,
    cancelAppointment,
    confirmAppointment,
    completeAppointment
  };
}