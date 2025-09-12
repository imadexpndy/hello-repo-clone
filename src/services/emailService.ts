import { supabase } from '@/integrations/supabase/client';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ReservationEmailData {
  userEmail: string;
  userName: string;
  spectacleName: string;
  sessionDate: string;
  sessionTime: string;
  location: string;
  ticketCount: number;
  totalAmount: number;
  reservationId: string;
  paymentMethod?: string;
  userPhone?: string;
}

export const sendConfirmationEmail = async (data: ReservationEmailData): Promise<boolean> => {
  try {
    console.log('Sending confirmation email via Supabase Edge Function:', data);
    
    const { data: result, error } = await supabase.functions.invoke('send-reservation-emails', {
      body: { reservationData: data }
    });

    if (error) {
      console.error('Error calling email function:', error);
      return false;
    }

    console.log('Email function result:', result);
    return result?.success || false;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking email:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
};
