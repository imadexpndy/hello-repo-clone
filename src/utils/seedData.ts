import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';

// Simplified spectacle data for seeding
export const sampleSpectacles = [
  {
    title: "Flash",
    description: "Un spectacle électrisant qui explore les super-pouvoirs et l'héroïsme à travers une aventure captivante pleine d'action et d'émotion.",
    duration_minutes: 75,
    price: 85,
    age_range_min: 6,
    age_range_max: 12,
    level_range: "CP-6ème",
    is_active: true
  },
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

export const seedSpectacles = async () => {
  try {
    console.log('Starting to seed spectacles...');
    
    // First, try to update existing L'Enfant de l'Arbre to Flash
    const { error: updateError } = await supabase
      .from('spectacles')
      .update({ 
        title: 'Flash',
        description: 'Flash est un spectacle captivant qui explore les thèmes de la vitesse, de la technologie et de la connexion humaine dans notre monde moderne.'
      })
      .eq('title', 'L\'Enfant de l\'Arbre');
    
    if (updateError) {
      console.log('No existing L\'Enfant de l\'Arbre to update:', updateError);
    }
    
    // Check if spectacles already exist
    const { data: existing, error: checkError } = await supabase
      .from('spectacles')
      .select('id, title')
      .limit(10);
    
    if (checkError) {
      console.error('Error checking existing spectacles:', checkError);
      throw new Error(`Database check failed: ${checkError.message}`);
    }
    
    // If Flash already exists, we're good
    if (existing && existing.some(s => s.title === 'Flash')) {
      console.log('Flash spectacle already exists');
      return existing;
    }
    
    // If other spectacles exist but not Flash, clear them and insert fresh data
    if (existing && existing.length > 0) {
      console.log('Clearing existing spectacles and inserting fresh data...');
      const { error: deleteError } = await supabase
        .from('sessions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) {
        console.error('Error clearing sessions:', deleteError);
      }
    }
    
    // Insert sample spectacles
    console.log('Inserting spectacles:', sampleSpectacles);
    const { data, error } = await supabase
      .from('spectacles')
      .upsert(sampleSpectacles, { onConflict: 'title' })
      .select();
    
    if (error) {
      console.error('Error seeding spectacles:', error);
      throw new Error(`Failed to insert spectacles: ${error.message}`);
    }
    
    console.log('Successfully seeded spectacles:', data);
    return data;
  } catch (error) {
    console.error('Failed to seed spectacles:', error);
    throw error;
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
    session_type: 'tout-public',
    status: 'published',
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
    session_type: 'scolaire-privee',
    status: 'published',
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
    session_type: 'scolaire-publique',
    status: 'published',
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
    session_type: 'association',
    status: 'published',
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
    session_type: 'tout-public',
    status: 'published',
    is_active: true
  }
];

export const seedSessions = async () => {
  try {
    console.log('Starting to seed sessions...');
    
    // Generate SQL INSERT statements for manual execution in Supabase dashboard
    const { data: spectacles, error: spectaclesError } = await supabase
      .from('spectacles')
      .select('id, title');
    
    if (spectaclesError) throw spectaclesError;
    
    if (!spectacles || spectacles.length === 0) {
      console.log('No spectacles found. Please seed spectacles first.');
      return { 
        success: false, 
        message: 'No spectacles found. Please seed spectacles first.',
        sqlStatements: []
      };
    }

    const sqlStatements = [];
    
    // Add DELETE statement to clear existing sessions
    sqlStatements.push('-- Clear existing sessions');
    sqlStatements.push('DELETE FROM sessions;');
    sqlStatements.push('');

    const sessions = [];
    
    // Public school sessions data for specific spectacles
    const publicSchoolSessions = [
      // CASABLANCA
      { title: 'Alice Chez Les Merveilles', date: '2026-05-22', times: ['09:30'], venue: 'Complexe El Hassani', city: 'Casablanca', type: 'scolaire-publique' },
      { title: 'Antigone', date: '2026-04-24', times: ['09:30'], venue: 'Théâtre Zefzaf', city: 'Casablanca', type: 'scolaire-publique' },
      { title: 'Charlotte', date: '2026-01-30', times: ['09:30'], venue: 'Complexe El Hassani', city: 'Casablanca', type: 'scolaire-publique' },
      { title: 'Estevanico', date: '2026-02-20', times: ['10:00'], venue: 'Complexe El Hassani', city: 'Casablanca', type: 'scolaire-publique' },
      { title: 'Flash', date: '2026-04-03', times: ['09:30'], venue: 'Complexe El Hassani', city: 'Casablanca', type: 'scolaire-publique' },
      { title: 'L\'Eau, La', date: '2025-11-14', times: ['09:30'], venue: 'Complexe El Hassani', city: 'Casablanca', type: 'association' },
      { title: 'Le Petit Prince', date: '2025-10-09', times: ['09:30'], venue: 'Complexe El Hassani', city: 'Casablanca', type: 'scolaire-publique' },
      { title: 'Mirath Atfal', date: '2025-11-10', times: ['14:30'], venue: 'Théâtre Zefzaf', city: 'Casablanca', type: 'scolaire-publique' },
      { title: 'Simple comme bonjour', date: '2025-12-19', times: ['09:30'], venue: 'Complexe El Hassani', city: 'Casablanca', type: 'scolaire-publique' },
      { title: 'Tara Sur La Lune', date: '2025-10-14', times: ['09:30'], venue: 'Complexe El Hassani', city: 'Casablanca', type: 'scolaire-publique' },
      
      // RABAT
      { title: 'Alice Chez Les Merveilles', date: '2026-05-19', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'association' },
      { title: 'Antigone', date: '2026-04-21', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'association' },
      { title: 'Charlotte', date: '2026-01-27', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'association' },
      { title: 'Estevanico', date: '2026-02-17', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'association' },
      { title: 'Flash', date: '2026-03-31', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'association' },
      { title: 'L\'Eau, La', date: '2025-11-11', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'association' },
      { title: 'Le Petit Prince', date: '2025-10-07', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'association' },
      { title: 'Mirath Atfal', date: '2025-11-13', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'scolaire-publique' },
      { title: 'Simple comme bonjour', date: '2025-12-16', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'association' },
      { title: 'Tara Sur La Lune', date: '2025-10-09', times: ['14:30'], venue: 'Théâtre Bahnini', city: 'Rabat', type: 'association' }
    ];
      
    publicSchoolSessions.forEach(sessionData => {
      const spectacle = spectacles.find(s => 
        s.title.toLowerCase().includes(sessionData.title.toLowerCase()) ||
        sessionData.title.toLowerCase().includes(s.title.toLowerCase())
      );
      
      if (spectacle) {
        sessionData.times.forEach(time => {
          sessions.push({
            spectacle_id: spectacle.id,
            session_date: sessionData.date,
            session_time: time,
            venue: sessionData.venue,
            city: sessionData.city,
            session_type: sessionData.type,
            total_capacity: 300,
            status: 'published'
          });
        });
      }
    });

    // Generate SQL INSERT statements for all sessions
    sessions.forEach(session => {
      const values = [
        `'${session.spectacle_id}'`,
        `'${session.session_date}'`,
        `'${session.session_time}'`,
        `'${session.venue}'`,
        `'${session.city}'`,
        `'${session.session_type}'`,
        session.total_capacity,
        `'${session.status}'`
      ].join(', ');
      
      sqlStatements.push(`INSERT INTO sessions (spectacle_id, session_date, session_time, venue, city, session_type, total_capacity, status) VALUES (${values});`);
    });

    console.log(`Generated ${sessions.length} session insert statements`);
    console.log('Copy and paste the following SQL statements into your Supabase SQL Editor:');
    console.log('\n' + sqlStatements.join('\n'));
    
    return { 
      success: true, 
      message: `Generated ${sessions.length} session insert statements. Check console for SQL to copy.`,
      sqlStatements,
      sessionCount: sessions.length
    };
  } catch (error) {
    console.error('Error generating session data:', error);
    throw error;
  }
};

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