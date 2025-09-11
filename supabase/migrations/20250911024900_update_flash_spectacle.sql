-- Update existing spectacle to Flash if it exists
UPDATE spectacles 
SET title = 'Flash',
    description = 'Un spectacle électrisant qui explore les super-pouvoirs et l''héroïsme à travers une aventure captivante pleine d''action et d''émotion.',
    updated_at = NOW()
WHERE title = 'L''Enfant de l''Arbre';

-- Insert Flash spectacle if no spectacles exist
INSERT INTO spectacles (
  title, 
  description, 
  duration_minutes, 
  price, 
  age_range_min, 
  age_range_max, 
  level_range, 
  is_active
)
SELECT 
  'Flash',
  'Un spectacle électrisant qui explore les super-pouvoirs et l''héroïsme à travers une aventure captivante pleine d''action et d''émotion.',
  75,
  85,
  6,
  12,
  'CP-6ème',
  true
WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Flash');
