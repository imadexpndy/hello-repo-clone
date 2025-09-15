import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function ProfileDebug() {
  const { user, profile } = useAuth();
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    const fetchRawProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        console.log('Raw profile data from DB:', data);
        console.log('Error:', error);
        setRawData(data);
      }
    };

    fetchRawProfile();
  }, [user]);

  if (!user) return <div>No user logged in</div>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Profile Debug Info</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">useAuth Profile:</h4>
        <pre className="text-xs bg-white p-2 rounded">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Raw Database Data:</h4>
        <pre className="text-xs bg-white p-2 rounded">
          {JSON.stringify(rawData, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Key Fields:</h4>
        <ul className="text-sm">
          <li>user_type: {rawData?.user_type || 'null'}</li>
          <li>professional_type: {rawData?.professional_type || 'null'}</li>
          <li>admin_role: {rawData?.admin_role || 'null'}</li>
          <li>verification_status: {rawData?.verification_status || 'null'}</li>
        </ul>
      </div>
    </div>
  );
}
