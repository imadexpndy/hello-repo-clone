import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const BookingTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testBookingCreation = async () => {
    setIsLoading(true);
    setTestResult('Testing booking creation...');

    try {
      // Test booking data with the new schema
      const testBooking = {
        user_id: '00000000-0000-0000-0000-000000000000', // Required field
        spectacle_id: 'le-petit-prince',
        session_id: 'lpp-1',
        booking_type: 'particulier',
        number_of_tickets: 2,
        total_amount: 160.00,
        payment_method: 'card',
        payment_reference: 'test-ref-123',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '+212600000000',
        notes: 'Test booking after schema fix',
        status: 'confirmed' as const
      };

      console.log('Creating test booking with data:', testBooking);

      const { data, error } = await supabase
        .from('bookings')
        .insert([testBooking])
        .select();

      if (error) {
        console.error('Booking creation error:', error);
        setTestResult(`❌ Error: ${error.message}\n\nDetails: ${JSON.stringify(error, null, 2)}`);
      } else {
        console.log('Booking created successfully:', data);
        setTestResult(`✅ Success! Booking created:\n\n${JSON.stringify(data[0], null, 2)}`);
      }
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult(`❌ Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTableSchema = async () => {
    setIsLoading(true);
    setTestResult('Checking bookings table schema...');

    try {
      // Try to query the bookings table to see what columns exist
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .limit(1);

      if (error) {
        setTestResult(`📋 Schema info from query attempt:\n\n${error.message}`);
      } else {
        setTestResult(`✅ Bookings table accessible. Sample structure:\n\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setTestResult(`❌ Schema check failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Booking System Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={checkTableSchema}
              disabled={isLoading}
              variant="outline"
            >
              Check Table Schema
            </Button>
            <Button 
              onClick={testBookingCreation}
              disabled={isLoading}
            >
              Test Booking Creation
            </Button>
          </div>
          
          {testResult && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
