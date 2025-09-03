import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const AuthStatus = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const callback = urlParams.get('callback');
      
      if (callback) {
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

        // Execute JSONP callback immediately
        try {
          if (window[callback as any]) {
            window[callback as any](authData);
          } else {
            // Fallback: create and execute script
            const script = document.createElement('script');
            script.textContent = `if(typeof ${callback} === 'function') ${callback}(${JSON.stringify(authData)});`;
            document.head.appendChild(script);
            setTimeout(() => document.head.removeChild(script), 100);
          }
        } catch (error) {
          console.error('JSONP callback error:', error);
        }
      }
    }
  }, [user, loading]);

  if (loading) {
    return <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h2>Loading authentication status...</h2>
    </div>;
  }

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

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2>Hello Planet Authentication Status</h2>
      <pre style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
        {JSON.stringify(authData, null, 2)}
      </pre>
    </div>
  );
};

export default AuthStatus;
