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

        // Execute JSONP callback using postMessage to parent window
        try {
          // Try direct callback first
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'AUTH_STATUS_RESPONSE',
              callback: callback,
              data: authData
            }, '*');
          }
          
          // Also try the traditional JSONP approach
          const script = document.createElement('script');
          script.textContent = `
            try {
              if (typeof ${callback} === 'function') {
                ${callback}(${JSON.stringify(authData)});
              } else if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                  type: 'JSONP_CALLBACK',
                  callback: '${callback}',
                  data: ${JSON.stringify(authData)}
                }, '*');
              }
            } catch(e) {
              console.error('JSONP callback error:', e);
            }
          `;
          document.head.appendChild(script);
          setTimeout(() => {
            try {
              document.head.removeChild(script);
            } catch(e) {}
          }, 1000);
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
