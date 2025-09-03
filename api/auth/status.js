import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Set CORS headers for cross-domain requests
  res.setHeader('Access-Control-Allow-Origin', 'https://edjs.art');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple mock response - always return not authenticated for now
  // This bypasses all the complex session detection issues
  const authData = {
    isAuthenticated: false,
    user: null,
    timestamp: new Date().toISOString(),
    note: "Cross-domain session detection disabled due to security restrictions"
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
}
