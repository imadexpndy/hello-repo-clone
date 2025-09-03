import { supabase } from '@/integrations/supabase/client';

// Simplified spectacle data for seeding
export const sampleSpectacles = [
  {
    title: "Le Petit Prince",
    description: "L'adaptation du chef-d'œuvre de Saint-Exupéry, une histoire poétique universelle sur l'amitié, l'amour et les valeurs humaines essentielles.",
    duration_minutes: 75,
    price: 85,
    age_range_min: 6,
    age_range_max: 12,
    level_range: "CP-6ème",
    is_active: true
  },
  {
    title: "Alice aux Pays des Merveilles",
    description: "Une adaptation moderne et créative du classique de Lewis Carroll, plongeant Alice et le public dans un monde fantastique rempli de surprises.",
    duration_minutes: 80,
    price: 95,
    age_range_min: 6,
    age_range_max: 14,
    level_range: "CP-5ème",
    is_active: true
  },
  {
    title: "Casse-Noisette",
    description: "Le célèbre ballet de Tchaïkovski adapté pour les jeunes spectateurs, une féerie musicale et visuelle qui transporte les enfants dans un monde magique de Noël.",
    duration_minutes: 90,
    price: 120,
    age_range_min: 4,
    age_range_max: 12,
    level_range: "Maternelle-CM2",
    is_active: true
  },
  {
    title: "Simple Comme Bonjour",
    description: "Un spectacle joyeux et interactif de Jacques Serres, célébrant la simplicité des petits bonheurs quotidiens avec musique, chants et sourires.",
    duration_minutes: 45,
    price: 70,
    age_range_min: 3,
    age_range_max: 10,
    level_range: "Maternelle-CE2",
    is_active: true
  },
  {
    title: "Antigone",
    description: "La tragédie intemporelle de Sophocle adaptée pour les jeunes spectateurs. Une œuvre puissante sur la résistance, le courage et les valeurs morales.",
    duration_minutes: 105,
    price: 110,
    age_range_min: 14,
    age_range_max: 18,
    level_range: "3ème-Terminale",
    is_active: true
  }
];

export async function seedSpectacles() {
  try {
    console.log('Seeding spectacles...');
    
    // Check if spectacles already exist
    const { data: existing, error: checkError } = await supabase
      .from('spectacles')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing spectacles:', checkError);
      return false;
    }
    
    if (existing && existing.length > 0) {
      console.log('Spectacles already exist, skipping seed');
      return true;
    }
    
    // Insert sample spectacles
    const { data, error } = await supabase
      .from('spectacles')
      .insert(sampleSpectacles)
      .select();
    
    if (error) {
      console.error('Error seeding spectacles:', error);
      return false;
    }
    
    console.log('Successfully seeded spectacles:', data);
    return true;
  } catch (error) {
    console.error('Failed to seed spectacles:', error);
    return false;
  }
}

// Sample sessions for the spectacles
export const sampleSessions = [
  {
    spectacle_id: '', // Will be filled dynamically
    session_date: '2025-03-15',
    session_time: '10:00',
    venue: 'Théâtre Mohammed V - Casablanca',
    city: 'casablanca',
    total_capacity: 200,
    b2c_capacity: 50,
    partner_quota: 30,
    price_mad: 85,
    is_active: true
  },
  {
    spectacle_id: '', // Will be filled dynamically
    session_date: '2025-03-15',
    session_time: '14:30',
    venue: 'Théâtre Mohammed V - Casablanca',
    city: 'casablanca',
    total_capacity: 200,
    b2c_capacity: 50,
    partner_quota: 30,
    price_mad: 85,
    is_active: true
  },
  {
    spectacle_id: '', // Will be filled dynamically
    session_date: '2025-03-22',
    session_time: '10:00',
    venue: 'Centre Culturel Sidi Belyout - Casablanca',
    city: 'casablanca',
    total_capacity: 150,
    b2c_capacity: 40,
    partner_quota: 25,
    price_mad: 95,
    is_active: true
  },
  {
    spectacle_id: '', // Will be filled dynamically
    session_date: '2025-03-29',
    session_time: '15:00',
    venue: 'Institut Français - Rabat',
    city: 'rabat',
    total_capacity: 120,
    b2c_capacity: 30,
    partner_quota: 20,
    price_mad: 90,
    is_active: true
  },
  {
    spectacle_id: '', // Will be filled dynamically
    session_date: '2025-04-05',
    session_time: '11:00',
    venue: 'Théâtre National - Rabat',
    city: 'rabat',
    total_capacity: 180,
    b2c_capacity: 45,
    partner_quota: 25,
    price_mad: 100,
    is_active: true
  }
];

export async function seedSessions() {
  try {
    console.log('Seeding sessions...');
    
    // Get spectacles to create sessions for
    const { data: spectacles, error: spectacleError } = await supabase
      .from('spectacles')
      .select('id, title')
      .eq('is_active', true)
      .limit(3);
    
    if (spectacleError || !spectacles || spectacles.length === 0) {
      console.error('No spectacles found for sessions');
      return false;
    }
    
    // Check if sessions already exist
    const { data: existingSessions, error: checkError } = await supabase
      .from('sessions')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing sessions:', checkError);
      return false;
    }
    
    if (existingSessions && existingSessions.length > 0) {
      console.log('Sessions already exist, skipping seed');
      return true;
    }
    
    // Create sessions for each spectacle
    const sessionsToInsert = [];
    
    spectacles.forEach((spectacle, spectacleIndex) => {
      // Create 2-3 sessions per spectacle with different dates
      sampleSessions.slice(0, 3).forEach((session, sessionIndex) => {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + (spectacleIndex * 7) + (sessionIndex * 2) + 7); // Spread sessions over time
        
        sessionsToInsert.push({
          ...session,
          spectacle_id: spectacle.id,
          session_date: sessionDate.toISOString().split('T')[0],
          price_mad: sampleSpectacles[spectacleIndex]?.price || 85
        });
      });
    });
    
    const { data, error } = await supabase
      .from('sessions')
      .insert(sessionsToInsert)
      .select();
    
    if (error) {
      console.error('Error seeding sessions:', error);
      return false;
    }
    
    console.log('Successfully seeded sessions:', data);
    return true;
  } catch (error) {
    console.error('Failed to seed sessions:', error);
    return false;
  }
}

export async function seedAllData() {
  console.log('Starting data seeding...');
  
  const spectaclesSeeded = await seedSpectacles();
  if (!spectaclesSeeded) {
    console.error('Failed to seed spectacles');
    return false;
  }
  
  const sessionsSeeded = await seedSessions();
  if (!sessionsSeeded) {
    console.error('Failed to seed sessions');
    return false;
  }
  
  console.log('All data seeded successfully!');
  return true;
}