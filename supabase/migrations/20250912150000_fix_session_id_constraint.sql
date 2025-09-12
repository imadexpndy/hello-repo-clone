-- Fix NOT NULL constraint on session_id column
-- The RPC is working but session_id column still has NOT NULL constraint

-- Option 1: Make session_id nullable (recommended for transition)
ALTER TABLE bookings ALTER COLUMN session_id DROP NOT NULL;

-- Option 2: Alternative - populate session_id with session_frontend_id in RPC
-- This keeps the constraint but ensures we always populate it
