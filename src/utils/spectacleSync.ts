import { supabase } from '@/integrations/supabase/client';

interface EDJSSpectacle {
  id: string;
  title: string;
  description: string;
  age_range_min?: number;
  age_range_max?: number;
  duration_minutes?: number;
  level_range?: string;
  poster_url?: string;
  price?: number;
  is_active: boolean;
  slug: string;
}

interface HelloPlanetSpectacle {
  id: string;
  title: string;
  description: string;
  age_range_min: number;
  age_range_max: number;
  duration_minutes: number;
  level_range: string;
  poster_url: string;
  price: number;
  is_active: boolean;
  slug: string;
  updated_at: string;
}

/**
 * Sync spectacles from EDJS website to Hello Planet app
 * This ensures both platforms have the same spectacle data
 */
export async function syncSpectaclesFromEDJS(): Promise<void> {
  try {
    // In a real implementation, this would fetch from the EDJS website API
    // For now, we'll sync with the existing Supabase data
    console.log('Starting spectacle sync from EDJS to Hello Planet...');
    
    // Fetch all spectacles from Hello Planet
    const { data: existingSpectacles, error: fetchError } = await supabase
      .from('spectacles')
      .select('*');

    if (fetchError) {
      throw new Error(`Failed to fetch existing spectacles: ${fetchError.message}`);
    }

    // In production, you would:
    // 1. Fetch spectacles from EDJS website API
    // 2. Compare with existing Hello Planet spectacles
    // 3. Update/insert/delete as needed
    
    console.log(`Found ${existingSpectacles?.length || 0} spectacles in Hello Planet`);
    
    // For demonstration, let's ensure all spectacles have the required fields
    if (existingSpectacles && existingSpectacles.length > 0) {
      for (const spectacle of existingSpectacles) {
        const updates: Partial<HelloPlanetSpectacle> = {};
        let needsUpdate = false;

        // Ensure price is set
        if (!spectacle.price) {
          updates.price = 15.00; // Default price
          needsUpdate = true;
        }

        // Update if needed
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('spectacles')
            .update(updates)
            .eq('id', spectacle.id);

          if (updateError) {
            console.error(`Failed to update spectacle ${spectacle.id}:`, updateError);
          } else {
            console.log(`Updated spectacle: ${spectacle.title}`);
          }
        }
      }
    }

    console.log('Spectacle sync completed successfully');
  } catch (error) {
    console.error('Error syncing spectacles:', error);
    throw error;
  }
}

/**
 * Sync a single spectacle from EDJS to Hello Planet
 */
export async function syncSingleSpectacle(edjsSpectacle: EDJSSpectacle): Promise<void> {
  try {
    const helloPlanetSpectacle = {
      title: edjsSpectacle.title,
      description: edjsSpectacle.description,
      age_range_min: edjsSpectacle.age_range_min || 3,
      age_range_max: edjsSpectacle.age_range_max || 12,
      duration_minutes: edjsSpectacle.duration_minutes || 60,
      level_range: edjsSpectacle.level_range || 'Tous niveaux',
      poster_url: edjsSpectacle.poster_url || '',
      price: edjsSpectacle.price || 15.00,
      is_active: edjsSpectacle.is_active,
      slug: edjsSpectacle.slug,
    };

    // Check if spectacle exists
    const { data: existing, error: fetchError } = await supabase
      .from('spectacles')
      .select('id')
      .eq('slug', edjsSpectacle.slug)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      // Update existing spectacle
      const { error: updateError } = await supabase
        .from('spectacles')
        .update(helloPlanetSpectacle)
        .eq('id', existing.id);

      if (updateError) throw updateError;
      console.log(`Updated spectacle: ${edjsSpectacle.title}`);
    } else {
      // Insert new spectacle
      const { error: insertError } = await supabase
        .from('spectacles')
        .insert([helloPlanetSpectacle]);

      if (insertError) throw insertError;
      console.log(`Inserted new spectacle: ${edjsSpectacle.title}`);
    }
  } catch (error) {
    console.error(`Error syncing spectacle ${edjsSpectacle.title}:`, error);
    throw error;
  }
}

/**
 * Get spectacles that need syncing (different between EDJS and Hello Planet)
 */
export async function getSpectaclesSyncStatus(): Promise<{
  inSync: boolean;
  differences: string[];
  lastSyncTime: string | null;
}> {
  try {
    // In production, this would compare EDJS API data with Hello Planet data
    const { data: spectacles, error } = await supabase
      .from('spectacles')
      .select('id, title, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    return {
      inSync: true, // Placeholder - would be calculated by comparing data
      differences: [], // Placeholder - would list actual differences
      lastSyncTime: spectacles?.[0]?.updated_at || null
    };
  } catch (error) {
    console.error('Error checking sync status:', error);
    return {
      inSync: false,
      differences: ['Error checking sync status'],
      lastSyncTime: null
    };
  }
}
