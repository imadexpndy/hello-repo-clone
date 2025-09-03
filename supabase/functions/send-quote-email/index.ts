import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingId, pdfUrl } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch booking details
    const { data: booking, error } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        profiles!inner (
          full_name,
          email,
          organizations!inner (
            name,
            type
          )
        ),
        spectacles!inner (
          title,
          description
        ),
        spectacle_sessions!inner (
          date,
          time,
          venue
        )
      `)
      .eq('id', bookingId)
      .single()

    if (error) throw error

    const sessionDate = new Date(booking.spectacle_sessions.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Votre Devis EDJS</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background: #2563eb;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
              }
              .content {
                  background: #f8fafc;
                  padding: 30px;
                  border-radius: 0 0 8px 8px;
              }
              .highlight {
                  background: #dbeafe;
                  padding: 15px;
                  border-radius: 6px;
                  margin: 20px 0;
              }
              .button {
                  display: inline-block;
                  background: #2563eb;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 6px;
                  margin: 10px 0;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e2e8f0;
                  color: #64748b;
                  font-size: 12px;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>EDJS - École de Jeunes Spectateurs</h1>
              <p>Votre Devis de Réservation</p>
          </div>
          
          <div class="content">
              <p>Bonjour ${booking.profiles.full_name},</p>
              
              <p>Nous avons bien reçu votre demande de réservation pour le spectacle <strong>"${booking.spectacles.title}"</strong>.</p>
              
              <div class="highlight">
                  <h3>Détails de votre réservation :</h3>
                  <ul>
                      <li><strong>École :</strong> ${booking.profiles.organizations.name}</li>
                      <li><strong>Spectacle :</strong> ${booking.spectacles.title}</li>
                      <li><strong>Date :</strong> ${sessionDate}</li>
                      <li><strong>Heure :</strong> ${booking.spectacle_sessions.time}</li>
                      <li><strong>Nombre d'élèves :</strong> ${booking.student_count}</li>
                      <li><strong>Accompagnateurs :</strong> ${booking.teacher_count}</li>
                      <li><strong>Prix total :</strong> ${booking.total_price}€</li>
                  </ul>
              </div>
              
              <p>Vous trouverez ci-joint votre devis détaillé au format PDF. Ce devis est valable 30 jours.</p>
              
              <p>Vous pouvez également télécharger votre devis directement depuis votre espace personnel :</p>
              <a href="${Deno.env.get('FRONTEND_URL')}/teacher/bookings" class="button">Accéder à mon espace</a>
              
              <p>Pour confirmer votre réservation, veuillez nous contacter par email ou téléphone. Notre équipe se fera un plaisir de finaliser les détails avec vous.</p>
              
              <p>Nous nous réjouissons de vous accueillir prochainement !</p>
              
              <p>Cordialement,<br>L'équipe EDJS</p>
          </div>
          
          <div class="footer">
              <p>EDJS - École de Jeunes Spectateurs</p>
              <p>Email: contact@edjs.art | Téléphone: +212 5 22 XX XX XX</p>
              <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          </div>
      </body>
      </html>
    `

    // Send email using Resend (you'll need to configure this)
    const emailData: EmailData = {
      to: booking.profiles.email,
      subject: `Devis EDJS - ${booking.spectacles.title} - ${booking.profiles.organizations.name}`,
      html: emailHtml
    }

    // For now, we'll just log the email (in production, integrate with email service)
    console.log('Email would be sent:', emailData)
    console.log('PDF URL:', pdfUrl)

    // In production, you would integrate with an email service like Resend:
    /*
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EDJS <noreply@edjs.art>',
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
      }),
    })
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
