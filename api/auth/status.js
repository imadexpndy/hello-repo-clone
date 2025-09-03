import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Set CORS headers for cross-domain requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wlpqkxzlnlvpvqvhqhcm.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducHFreHpsbmx2cHZxdmhxaGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjU2NTgsImV4cCI6MjA1MTQwMTY1OH0.LHmZvJJJhTnlhJYIXPOzlXJgCLJdyYXCMUqNUdqFLbM';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the access token from cookies or headers
    const authHeader = req.headers.authorization;
    const accessToken = req.cookies['sb-access-token'] || 
                       req.cookies['supabase-auth-token'] || 
                       (authHeader && authHeader.replace('Bearer ', ''));

    let user = null;
    let isAuthenticated = false;

    if (accessToken) {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser(accessToken);
        if (authUser && !error) {
          user = {
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || authUser.email,
            role: authUser.user_metadata?.role || 'user'
          };
          isAuthenticated = true;
        }
      } catch (error) {
        console.error('Auth error:', error);
      }
    }

    const authData = {
      isAuthenticated,
      user,
      timestamp: new Date().toISOString()
    };

    // Handle JSONP callback
    const callback = req.query.callback;
    if (callback) {
      const jsonpResponse = `${callback}(${JSON.stringify(authData)});`;
      res.setHeader('Content-Type', 'application/javascript');
      res.status(200).send(jsonpResponse);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(authData);
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorData = {
      isAuthenticated: false,
      user: null,
      error: error.message,
      timestamp: new Date().toISOString()
    };

    const callback = req.query.callback;
    if (callback) {
      const jsonpResponse = `${callback}(${JSON.stringify(errorData)});`;
      res.setHeader('Content-Type', 'application/javascript');
      res.status(200).send(jsonpResponse);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json(errorData);
    }
  }
}
