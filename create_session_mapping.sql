-- Create session_id_mapping table
CREATE TABLE IF NOT EXISTS public.session_id_mapping (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    frontend_id VARCHAR(50) UNIQUE NOT NULL,
    database_uuid UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_session_mapping_frontend_id ON public.session_id_mapping(frontend_id);
CREATE INDEX IF NOT EXISTS idx_session_mapping_database_uuid ON public.session_id_mapping(database_uuid);

-- Enable RLS
ALTER TABLE public.session_id_mapping ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Allow read access to session mappings" ON public.session_id_mapping
    FOR SELECT USING (true);

-- Create policy to allow insert/update for service role
CREATE POLICY "Allow service role to manage session mappings" ON public.session_id_mapping
    FOR ALL USING (auth.role() = 'service_role');

-- Insert all session mappings from our migration data
INSERT INTO public.session_id_mapping (frontend_id, database_uuid) VALUES
  -- LE PETIT PRINCE mappings
  ('lpp-1', '550e8400-e29b-41d4-a716-446655440001'),
  ('lpp-2', '550e8400-e29b-41d4-a716-446655440002'),
  ('lpp-3', '550e8400-e29b-41d4-a716-446655440003'),
  ('lpp-4', '550e8400-e29b-41d4-a716-446655440004'),
  ('lpp-5', '550e8400-e29b-41d4-a716-446655440005'),
  ('lpp-6', '550e8400-e29b-41d4-a716-446655440006'),
  ('lpp-7', '550e8400-e29b-41d4-a716-446655440007'),
  ('lpp-8', '550e8400-e29b-41d4-a716-446655440008'),
  
  -- TARA SUR LA LUNE mappings
  ('tsl-1', '550e8400-e29b-41d4-a716-446655440009'),
  ('tsl-2', '550e8400-e29b-41d4-a716-446655440010'),
  ('tsl-3', '550e8400-e29b-41d4-a716-446655440011'),
  ('tsl-4', '550e8400-e29b-41d4-a716-446655440012'),
  ('tsl-5', '550e8400-e29b-41d4-a716-446655440013'),
  ('tsl-6', '550e8400-e29b-41d4-a716-446655440014'),
  ('tsl-7', '550e8400-e29b-41d4-a716-446655440015'),
  ('tsl-8', '550e8400-e29b-41d4-a716-446655440016'),
  
  -- ESTEVANICO mappings
  ('est-1', '550e8400-e29b-41d4-a716-446655440017'),
  ('est-2', '550e8400-e29b-41d4-a716-446655440018'),
  ('est-3', '550e8400-e29b-41d4-a716-446655440019'),
  ('est-4', '550e8400-e29b-41d4-a716-446655440020'),
  ('est-5', '550e8400-e29b-41d4-a716-446655440021'),
  ('est-6', '550e8400-e29b-41d4-a716-446655440022'),
  ('est-7', '550e8400-e29b-41d4-a716-446655440023'),
  ('est-8', '550e8400-e29b-41d4-a716-446655440024'),
  
  -- CHARLOTTE mappings
  ('cha-1', '550e8400-e29b-41d4-a716-446655440025'),
  ('cha-2', '550e8400-e29b-41d4-a716-446655440026'),
  ('cha-3', '550e8400-e29b-41d4-a716-446655440027'),
  ('cha-4', '550e8400-e29b-41d4-a716-446655440028'),
  ('cha-5', '550e8400-e29b-41d4-a716-446655440029'),
  ('cha-6', '550e8400-e29b-41d4-a716-446655440030'),
  ('cha-7', '550e8400-e29b-41d4-a716-446655440031'),
  ('cha-8', '550e8400-e29b-41d4-a716-446655440032'),
  
  -- L'EAU LA mappings
  ('leau-1', '550e8400-e29b-41d4-a716-446655440033'),
  ('leau-2', '550e8400-e29b-41d4-a716-446655440034'),
  ('leau-3', '550e8400-e29b-41d4-a716-446655440035'),
  ('leau-4', '550e8400-e29b-41d4-a716-446655440036'),
  ('leau-5', '550e8400-e29b-41d4-a716-446655440037'),
  ('leau-6', '550e8400-e29b-41d4-a716-446655440038'),
  ('leau-7', '550e8400-e29b-41d4-a716-446655440039'),
  ('leau-8', '550e8400-e29b-41d4-a716-446655440040'),
  ('leau-9', '550e8400-e29b-41d4-a716-446655440041'),
  ('leau-10', '550e8400-e29b-41d4-a716-446655440042'),
  ('leau-11', '550e8400-e29b-41d4-a716-446655440043'),
  ('leau-12', '550e8400-e29b-41d4-a716-446655440044'),
  ('leau-13', '550e8400-e29b-41d4-a716-446655440045'),
  
  -- MIRATH ATFAL mappings
  ('ma-1', '550e8400-e29b-41d4-a716-446655440046'),
  ('ma-2', '550e8400-e29b-41d4-a716-446655440047'),
  ('ma-3', '550e8400-e29b-41d4-a716-446655440048'),
  ('ma-4', '550e8400-e29b-41d4-a716-446655440049'),
  ('ma-5', '550e8400-e29b-41d4-a716-446655440050'),
  ('ma-6', '550e8400-e29b-41d4-a716-446655440051'),
  ('ma-7', '550e8400-e29b-41d4-a716-446655440052'),
  ('ma-8', '550e8400-e29b-41d4-a716-446655440053'),
  ('ma-9', '550e8400-e29b-41d4-a716-446655440054'),
  
  -- SIMPLE COMME BONJOUR mappings
  ('scb-1', '550e8400-e29b-41d4-a716-446655440055'),
  ('scb-2', '550e8400-e29b-41d4-a716-446655440056'),
  ('scb-3', '550e8400-e29b-41d4-a716-446655440057'),
  ('scb-4', '550e8400-e29b-41d4-a716-446655440058'),
  ('scb-5', '550e8400-e29b-41d4-a716-446655440059'),
  ('scb-6', '550e8400-e29b-41d4-a716-446655440060'),
  ('scb-7', '550e8400-e29b-41d4-a716-446655440061'),
  ('scb-8', '550e8400-e29b-41d4-a716-446655440062'),
  ('scb-9', '550e8400-e29b-41d4-a716-446655440063'),
  ('scb-10', '550e8400-e29b-41d4-a716-446655440064'),
  
  -- FLASH mappings
  ('flash-1', '550e8400-e29b-41d4-a716-446655440065'),
  ('flash-2', '550e8400-e29b-41d4-a716-446655440066'),
  ('flash-3', '550e8400-e29b-41d4-a716-446655440067'),
  ('flash-4', '550e8400-e29b-41d4-a716-446655440068'),
  ('flash-5', '550e8400-e29b-41d4-a716-446655440069'),
  ('flash-6', '550e8400-e29b-41d4-a716-446655440070'),
  ('flash-7', '550e8400-e29b-41d4-a716-446655440071'),
  ('flash-8', '550e8400-e29b-41d4-a716-446655440072'),
  
  -- ALICE CHEZ LES MERVEILLES mappings
  ('ali-1', '550e8400-e29b-41d4-a716-446655440073'),
  ('ali-2', '550e8400-e29b-41d4-a716-446655440074'),
  ('ali-3', '550e8400-e29b-41d4-a716-446655440075'),
  ('ali-4', '550e8400-e29b-41d4-a716-446655440076'),
  ('ali-5', '550e8400-e29b-41d4-a716-446655440077'),
  ('ali-6', '550e8400-e29b-41d4-a716-446655440078'),
  ('ali-7', '550e8400-e29b-41d4-a716-446655440079'),
  ('ali-8', '550e8400-e29b-41d4-a716-446655440080'),
  
  -- ANTIGONE mappings
  ('ant-1', '550e8400-e29b-41d4-a716-446655440081'),
  ('ant-2', '550e8400-e29b-41d4-a716-446655440082'),
  ('ant-3', '550e8400-e29b-41d4-a716-446655440083'),
  ('ant-4', '550e8400-e29b-41d4-a716-446655440084'),
  ('ant-5', '550e8400-e29b-41d4-a716-446655440085'),
  ('ant-6', '550e8400-e29b-41d4-a716-446655440086'),
  ('ant-7', '550e8400-e29b-41d4-a716-446655440087'),
  ('ant-8', '550e8400-e29b-41d4-a716-446655440088')

ON CONFLICT (frontend_id) DO NOTHING;
