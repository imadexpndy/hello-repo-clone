import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

const AuthStatus = () => {
  const { user, loading } = useAuth();
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    if (!loading) {
      const authData = {
        isAuthenticated: !!user,
        user: user ? {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email,
          role: user.user_metadata?.role || 'user'
        } : null,
        timestamp: new Date().toISOString()
      };

      setResponse(authData);

      // Set CORS headers for cross-domain access
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const callback = urlParams.get('callback');
        
        if (callback) {
          // JSONP response for cross-domain
          const script = document.createElement('script');
          script.textContent = `${callback}(${JSON.stringify(authData)});`;
          document.head.appendChild(script);
        }
      }
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2>Hello Planet Authentication Status</h2>
      <pre style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
};

export default AuthStatus;
