import React from 'react';
import { ReservationSystemTest } from '@/components/ReservationSystemTest';

const TestReservations: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservation System Testing</h1>
          <p className="text-gray-600">
            This page allows you to test the reservation system functionality across all user types and spectacles.
            Make sure you're logged in to test booking creation.
          </p>
        </div>
        
        <ReservationSystemTest />
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Click "Run Session Mapping Tests" to verify all session IDs can be mapped to database UUIDs</li>
            <li>For successful mappings, click "Test Booking" to create and immediately delete a test booking</li>
            <li>Green rows indicate successful session mapping</li>
            <li>Red rows indicate issues that need to be resolved</li>
            <li>Make sure all migrations have been applied to your Supabase database before testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestReservations;
