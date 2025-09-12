// Test script to verify email notification system
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailNotification() {
  console.log('Testing email notification system...');
  
  const testReservationData = {
    userEmail: 'test@example.com',
    userName: 'Test User',
    spectacleName: 'Le Petit Prince',
    sessionDate: '2025-10-05',
    sessionTime: '15:00',
    location: 'Théâtre Bahnini, Rabat',
    ticketCount: 2,
    totalAmount: 160,
    reservationId: 'TEST-' + Date.now(),
    paymentMethod: 'bank_transfer',
    userPhone: '+212661234567'
  };

  try {
    const { data, error } = await supabase.functions.invoke('send-reservation-emails', {
      body: { reservationData: testReservationData }
    });

    if (error) {
      console.error('Email function error:', error);
      return false;
    }

    console.log('Email function response:', data);
    return data?.success || false;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}

testEmailNotification().then(success => {
  console.log('Email test result:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
});
