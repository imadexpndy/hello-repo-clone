-- Create a default session that will always exist to bypass foreign key constraints
INSERT INTO sessions (
  id,
  session_date,
  session_time,
  venue,
  city,
  b2c_capacity,
  total_capacity,
  is_active,
  price_mad
) VALUES (
  '00000000-0000-4000-8000-000000000001',
  '2025-12-31',
  '23:59',
  'DEFAULT SESSION',
  'System',
  999,
  999,
  true,
  0.00
) ON CONFLICT (id) DO NOTHING;
