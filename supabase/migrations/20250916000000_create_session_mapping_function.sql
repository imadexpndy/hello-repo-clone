-- Create function to get session UUID from frontend ID
CREATE OR REPLACE FUNCTION get_session_uuid(frontend_session_id TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_uuid UUID;
BEGIN
    SELECT database_uuid INTO session_uuid
    FROM session_id_mapping
    WHERE frontend_id = frontend_session_id;
    
    RETURN session_uuid;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_session_uuid(TEXT) TO authenticated;
