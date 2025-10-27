import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { driveLink, title, type, sectionId } = await req.json()

    if (!driveLink || !title || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: driveLink, title, type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process Google Drive link to direct download URL
    let downloadUrl = driveLink.trim()
    
    if (downloadUrl.includes('drive.google.com/file/d/')) {
      const fileId = downloadUrl.match(/\/d\/([^/]+)/)?.[1]
      if (fileId) {
        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
      }
    }

    console.log('Downloading from:', downloadUrl)

    // Download file from Google Drive
    const response = await fetch(downloadUrl)
    
    if (!response.ok) {
      console.error('Failed to download from Google Drive:', response.status)
      return new Response(
        JSON.stringify({ error: 'Failed to download file from Google Drive. Check if the link is public.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const blob = await response.blob()
    console.log('Downloaded blob size:', blob.size, 'bytes')

    // Generate file path
    const timestamp = Date.now()
    let filePath: string
    
    if (type === 'podcast') {
      filePath = `podcasts/${timestamp}.mp3`
    } else {
      filePath = `${user.id}/${sectionId}/${timestamp}.mp3`
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('audio-files')
      .upload(filePath, blob, {
        contentType: blob.type || 'audio/mpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('File uploaded to:', filePath)

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('audio-files')
      .getPublicUrl(filePath)

    // Create database record
    let dbData
    if (type === 'podcast') {
      // Check if user is admin
      const { data: roleData } = await supabaseClient
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle()

      if (!roleData) {
        // Not admin, delete uploaded file
        await supabaseClient.storage.from('audio-files').remove([filePath])
        return new Response(
          JSON.stringify({ error: 'Only admins can upload podcasts' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabaseClient
        .from('podcasts')
        .insert({
          title,
          file_path: filePath,
          file_url: publicUrl,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        await supabaseClient.storage.from('audio-files').remove([filePath])
        return new Response(
          JSON.stringify({ error: 'Failed to save podcast', details: error }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      dbData = data
    } else {
      // User audio file
      const { data, error } = await supabaseClient
        .from('user_audio_files')
        .insert({
          user_id: user.id,
          section_id: sectionId,
          title,
          file_path: filePath,
          file_url: publicUrl,
        })
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        await supabaseClient.storage.from('audio-files').remove([filePath])
        return new Response(
          JSON.stringify({ error: 'Failed to save audio file', details: error }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      dbData = data
    }

    console.log('Successfully created record:', dbData.id)

    return new Response(
      JSON.stringify({ success: true, data: dbData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
