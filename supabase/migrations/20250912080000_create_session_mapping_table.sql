-- Create session_id_mapping table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.session_id_mapping (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    frontend_id VARCHAR(50) UNIQUE NOT NULL,
    database_uuid UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_session_mapping_frontend_id ON public.session_id_mapping(frontend_id);
CREATE INDEX IF NOT EXISTS idx_session_mapping_database_uuid ON public.session_id_mapping(database_uuid);

-- Enable RLS
ALTER TABLE public.session_id_mapping ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all authenticated users
CREATE POLICY "Allow read access to session mappings" ON public.session_id_mapping
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow insert/update for service role
CREATE POLICY "Allow service role to manage session mappings" ON public.session_id_mapping
    FOR ALL USING (auth.role() = 'service_role');
