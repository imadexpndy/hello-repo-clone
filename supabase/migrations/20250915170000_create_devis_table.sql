-- Create devis table to store generated quotes for private schools
CREATE TABLE IF NOT EXISTS public.devis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  devis_number TEXT NOT NULL UNIQUE,
  spectacle_name TEXT NOT NULL,
  spectacle_date DATE NOT NULL,
  spectacle_time TIME NOT NULL,
  venue TEXT NOT NULL,
  
  -- Client information
  school_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  school_address TEXT,
  
  -- Participants breakdown
  students_count INTEGER NOT NULL DEFAULT 0,
  teachers_count INTEGER NOT NULL DEFAULT 0,
  accompanists_count INTEGER NOT NULL DEFAULT 0,
  
  -- Pricing
  price_per_student DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  price_per_teacher DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price_per_accompanist DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Status and dates
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- PDF storage
  pdf_url TEXT,
  pdf_blob BYTEA,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_devis_user_id ON public.devis(user_id);
CREATE INDEX IF NOT EXISTS idx_devis_booking_id ON public.devis(booking_id);
CREATE INDEX IF NOT EXISTS idx_devis_status ON public.devis(status);
CREATE INDEX IF NOT EXISTS idx_devis_number ON public.devis(devis_number);

-- Enable RLS
ALTER TABLE public.devis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own devis" ON public.devis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devis" ON public.devis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devis" ON public.devis
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all devis
CREATE POLICY "Admins can view all devis" ON public.devis
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.admin_role IS NOT NULL
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_devis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_devis_updated_at_trigger
  BEFORE UPDATE ON public.devis
  FOR EACH ROW
  EXECUTE FUNCTION update_devis_updated_at();
