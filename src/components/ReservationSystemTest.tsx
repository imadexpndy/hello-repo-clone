import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getUserTypeSessions } from '@/data/sessions';

interface TestResult {
  userType: string;
  spectacleId: string;
  sessionId: string;
  status: 'success' | 'error';
  message: string;
}

export const ReservationSystemTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testUserTypes = ['particulier', 'scolaire-privee', 'scolaire-publique', 'association'];
  const testSpectacles = ['le-petit-prince', 'mirath-atfal', 'leau-la', 'simple-comme-bonjour'];

  const testSessionMapping = async (sessionId: string) => {
    try {
      // Test if session exists directly in sessions table
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) {
        alert(`Session lookup failed: ${sessionError.message}`);
        return;
      }

      alert(`Session found in database:\n${JSON.stringify(session, null, 2)}`);
    } catch (error) {
      alert(`Test failed: ${error}`);
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: TestResult[] = [];

    for (const userType of testUserTypes) {
      for (const spectacleId of testSpectacles) {
        // Get sessions for this user type and spectacle
        const sessions = getUserTypeSessions(spectacleId, userType);
        
        if (sessions.length === 0) {
          results.push({
            userType,
            spectacleId,
            sessionId: 'N/A',
            status: 'error',
            message: 'No sessions found for this user type'
          });
          continue;
        }

        // Test the first session for this combination
        const sessionId = sessions[0].id;
        try {
          await testBookingCreation(sessionId, userType);
          results.push({
            spectacleId,
            userType,
            sessionId,
            status: 'success',
            message: `✅ ${userType} booking for ${spectacleId} session ${sessionId} created successfully`
          });
        } catch (error) {
          results.push({
            spectacleId,
            userType,
            sessionId,
            status: 'error',
            message: `❌ ${userType} booking for ${spectacleId} session ${sessionId} failed: ${error}`
          });
        }
      }
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const testBookingCreation = async (sessionId: string, userType: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in to test booking creation');
        return;
      }

      // Create test booking using frontend session ID directly
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: 'test-user-id',
          session_id: sessionId,
          booking_type: userType,
          number_of_tickets: 1,
          total_amount: 80.00,
          status: 'confirmed',
          contact_name: 'Test User',
          contact_email: user.email,
          contact_phone: '0600000000'
        })
        .select()
        .single();

      if (bookingError) {
        alert(`Booking creation failed: ${bookingError.message}`);
        return;
      }

      alert(`Test booking created successfully! ID: ${booking.id}`);
      
      // Clean up - delete the test booking
      await supabase.from('bookings').delete().eq('id', booking.id);
      alert('Test booking cleaned up');
      
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Reservation System Test</h2>
      
      <button
        onClick={runTests}
        disabled={isRunning}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isRunning ? 'Running Tests...' : 'Run Session Mapping Tests'}
      </button>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">User Type</th>
                  <th className="border border-gray-300 px-4 py-2">Spectacle</th>
                  <th className="border border-gray-300 px-4 py-2">Session ID</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Message</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map((result, index) => (
                  <tr key={index} className={result.status === 'success' ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="border border-gray-300 px-4 py-2">{result.userType}</td>
                    <td className="border border-gray-300 px-4 py-2">{result.spectacleId}</td>
                    <td className="border border-gray-300 px-4 py-2">{result.sessionId}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        result.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{result.message}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {result.status === 'success' && result.sessionId !== 'N/A' && (
                        <button
                          onClick={() => testBookingCreation(result.sessionId, result.userType)}
                          className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Test Booking
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="font-semibold">Summary</h4>
            <p>Total Tests: {testResults.length}</p>
            <p>Successful: {testResults.filter(r => r.status === 'success').length}</p>
            <p>Failed: {testResults.filter(r => r.status === 'error').length}</p>
          </div>
        </div>
      )}
    </div>
  );
};
