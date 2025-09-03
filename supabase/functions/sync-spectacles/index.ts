import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, spectacleData } = await req.json()

    switch (action) {
      case 'sync_all':
        return await syncAllSpectacles(supabaseClient)
      case 'sync_single':
        return await syncSingleSpectacle(supabaseClient, spectacleData)
      case 'get_sync_status':
        return await getSyncStatus(supabaseClient)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Sync error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function syncAllSpectacles(supabase: any) {
  console.log('Starting full spectacle sync...')
  
  // Get all spectacles from Hello Planet
  const { data: spectacles, error } = await supabase
    .from('spectacles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch spectacles: ${error.message}`)
  }

  const syncResults = {
    total: spectacles?.length || 0,
    updated: 0,
    errors: []
  }

  // In a real implementation, this would sync with EDJS website API
  // For now, we'll ensure data consistency within Hello Planet
  if (spectacles && spectacles.length > 0) {
    for (const spectacle of spectacles) {
      try {
        // Ensure required fields are present
        const updates: any = {}
        let needsUpdate = false

        // Ensure price fields exist
        if (!spectacle.price_individual) {
          updates.price_individual = 25.00
          needsUpdate = true
        }
        if (!spectacle.price_group) {
          updates.price_group = 20.00
          needsUpdate = true
        }
        if (!spectacle.price_school) {
          updates.price_school = 15.00
          needsUpdate = true
        }

        // Ensure language is set
        if (!spectacle.language) {
          updates.language = 'Français'
          needsUpdate = true
        }

        // Update if needed
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('spectacles')
            .update(updates)
            .eq('id', spectacle.id)

          if (updateError) {
            syncResults.errors.push(`Failed to update ${spectacle.title}: ${updateError.message}`)
          } else {
            syncResults.updated++
            console.log(`Updated spectacle: ${spectacle.title}`)
          }
        }
      } catch (error) {
        syncResults.errors.push(`Error processing ${spectacle.title}: ${error.message}`)
      }
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Sync completed',
      results: syncResults
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function syncSingleSpectacle(supabase: any, spectacleData: any) {
  console.log('Syncing single spectacle:', spectacleData.title)

  // Check if spectacle exists
  const { data: existing, error: fetchError } = await supabase
    .from('spectacles')
    .select('id')
    .eq('slug', spectacleData.slug)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError
  }

  const spectaclePayload = {
    title: spectacleData.title,
    description: spectacleData.description,
    age_range_min: spectacleData.age_range_min || 3,
    age_range_max: spectacleData.age_range_max || 12,
    duration_minutes: spectacleData.duration_minutes || 60,
    level_range: spectacleData.level_range || 'Tous niveaux',
    poster_url: spectacleData.poster_url || spectacleData.main_image_url,
    price: spectacleData.price_school || 15.00,
    slug: spectacleData.slug,
    is_active: spectacleData.is_active !== false,
    updated_at: new Date().toISOString()
  }

  if (existing) {
    // Update existing spectacle
    const { error: updateError } = await supabase
      .from('spectacles')
      .update(spectaclePayload)
      .eq('id', existing.id)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated spectacle: ${spectacleData.title}`,
        action: 'updated'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } else {
    // Insert new spectacle
    const { error: insertError } = await supabase
      .from('spectacles')
      .insert([spectaclePayload])

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({
        success: true,
        message: `Created spectacle: ${spectacleData.title}`,
        action: 'created'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getSyncStatus(supabase: any) {
  const { data: spectacles, error } = await supabase
    .from('spectacles')
    .select('id, title, updated_at, is_active')
    .order('updated_at', { ascending: false })
    .limit(10)

  if (error) {
    throw new Error(`Failed to get sync status: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      spectacles: spectacles || [],
      lastSyncTime: spectacles?.[0]?.updated_at || null,
      totalSpectacles: spectacles?.length || 0
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
