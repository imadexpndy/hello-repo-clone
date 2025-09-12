// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @deno-types="https://esm.sh/@supabase/supabase-js@2"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ReservationData {
  userEmail: string;
  userName: string;
  spectacleName: string;
  sessionDate: string;
  sessionTime: string;
  location: string;
  ticketCount: number;
  totalAmount: number;
  reservationId: string;
  paymentMethod?: string;
  userPhone?: string;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reservationData }: { reservationData: ReservationData } = await req.json()

    // Get environment variables
    const supabaseUrl = (globalThis as any).Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = (globalThis as any).Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // SMTP configuration
    const smtpHost = (globalThis as any).Deno.env.get('SMTP_HOST')!
    const smtpPort = (globalThis as any).Deno.env.get('SMTP_PORT')!
    const smtpUser = (globalThis as any).Deno.env.get('SMTP_USER')!
    const smtpPassword = (globalThis as any).Deno.env.get('SMTP_PASSWORD')!
    const fromEmail = (globalThis as any).Deno.env.get('FROM_EMAIL')! || 'noreply@edjs.ma'

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      throw new Error('SMTP configuration missing')
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Email templates
    const getClientEmailTemplate = (data: ReservationData) => {
      const paymentInstructions = data.paymentMethod === 'bank_transfer' 
        ? `
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="color: #856404; margin-top: 0;">⚠️ Important - Paiement par Virement</h3>
          <p style="color: #856404; margin-bottom: 10px;">
            <strong>Vous avez 72 heures pour effectuer le virement bancaire, sinon votre réservation sera automatiquement annulée.</strong>
          </p>
          <div style="background-color: #fff; padding: 10px; border-radius: 3px;">
            <h4 style="margin-top: 0; color: #856404;">Informations bancaires - EDJS</h4>
            <p style="margin: 5px 0;"><strong>Bénéficiaire:</strong> École du Jeune Spectateur</p>
            <p style="margin: 5px 0;"><strong>Banque:</strong> Attijariwafa Bank</p>
            <p style="margin: 5px 0;"><strong>RIB:</strong> 007 780 0000271100000012 85</p>
            <p style="margin: 5px 0;"><strong>IBAN:</strong> MA64 0077 8000 0027 1100 0000 1285</p>
            <p style="margin: 5px 0;"><strong>SWIFT/BIC:</strong> BCMAMAMC</p>
          </div>
          <p style="color: #856404; font-size: 12px; margin-bottom: 0;">
            💡 N'oubliez pas de mentionner votre référence: <strong>${data.reservationId}</strong>
          </p>
        </div>
        `
        : `
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p style="color: #155724; margin: 0;">
            ✅ Votre paiement ${data.paymentMethod === 'card' ? 'par carte' : 'en espèces'} a été confirmé.
          </p>
        </div>
        `;

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmation de réservation - EDJS</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50;">École du Jeune Spectateur</h1>
            <h2 style="color: #27ae60;">✅ Réservation Confirmée</h2>
          </div>
          
          <p>Bonjour <strong>${data.userName}</strong>,</p>
          
          <p>Votre réservation a été confirmée avec succès ! Voici les détails :</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c3e50;">Détails de la réservation</h3>
            <p><strong>Référence:</strong> ${data.reservationId}</p>
            <p><strong>Spectacle:</strong> ${data.spectacleName}</p>
            <p><strong>Date & Heure:</strong> ${data.sessionDate} à ${data.sessionTime}</p>
            <p><strong>Lieu:</strong> ${data.location}</p>
            <p><strong>Nombre de billets:</strong> ${data.ticketCount}</p>
            <p><strong>Montant total:</strong> ${data.totalAmount} DH</p>
            <p><strong>Mode de paiement:</strong> ${data.paymentMethod === 'card' ? 'Carte bancaire' : data.paymentMethod === 'bank_transfer' ? 'Virement bancaire' : 'Espèces'}</p>
          </div>
          
          ${paymentInstructions}
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c3e50;">Besoin d'aide ?</h3>
            <p>Pour toute question, contactez-nous :</p>
            <p>📧 Email: contact@edjs.ma</p>
            <p>📱 WhatsApp: +212 661 234 567</p>
          </div>
          
          <p>Nous avons hâte de vous accueillir au spectacle !</p>
          
          <p style="margin-top: 30px;">
            Cordialement,<br>
            <strong>L'équipe EDJS</strong>
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            École du Jeune Spectateur - Rabat, Maroc<br>
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </body>
        </html>
      `;
    };

    const getAdminEmailTemplate = (data: ReservationData) => {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Nouvelle réservation - EDJS Admin</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50;">EDJS - Administration</h1>
            <h2 style="color: #e74c3c;">🔔 Nouvelle Réservation</h2>
          </div>
          
          <p>Une nouvelle réservation vient d'être effectuée :</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c3e50;">Détails de la réservation</h3>
            <p><strong>Référence:</strong> ${data.reservationId}</p>
            <p><strong>Client:</strong> ${data.userName}</p>
            <p><strong>Email:</strong> ${data.userEmail}</p>
            ${data.userPhone ? `<p><strong>Téléphone:</strong> ${data.userPhone}</p>` : ''}
            <p><strong>Spectacle:</strong> ${data.spectacleName}</p>
            <p><strong>Date & Heure:</strong> ${data.sessionDate} à ${data.sessionTime}</p>
            <p><strong>Lieu:</strong> ${data.location}</p>
            <p><strong>Nombre de billets:</strong> ${data.ticketCount}</p>
            <p><strong>Montant total:</strong> ${data.totalAmount} DH</p>
            <p><strong>Mode de paiement:</strong> ${data.paymentMethod === 'card' ? 'Carte bancaire' : data.paymentMethod === 'bank_transfer' ? 'Virement bancaire' : 'Espèces'}</p>
          </div>
          
          ${data.paymentMethod === 'bank_transfer' ? `
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Action Requise - Virement Bancaire</h3>
            <p style="color: #856404;">
              Le client doit effectuer le virement dans les 72h. Surveillez les paiements entrants.
            </p>
          </div>
          ` : ''}
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c3e50;">Actions à effectuer</h3>
            <p>• Vérifier la disponibilité de la session</p>
            <p>• Confirmer la réservation dans le système</p>
            ${data.paymentMethod === 'bank_transfer' ? '<p>• Surveiller le virement bancaire (72h)</p>' : ''}
            <p>• Préparer les billets pour le client</p>
          </div>
          
          <p style="margin-top: 30px;">
            <strong>Système de réservation EDJS</strong><br>
            ${new Date().toLocaleString('fr-FR')}
          </p>
        </body>
        </html>
      `;
    };

    // Send email to client
    const clientEmailResponse = await fetch(`https://${smtpHost}:${smtpPort}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${smtpUser}:${smtpPassword}`)}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: reservationData.userEmail,
        subject: `Confirmation de réservation - ${reservationData.spectacleName}`,
        html: getClientEmailTemplate(reservationData)
      })
    });

    // Send email to admin
    const adminEmailResponse = await fetch(`https://${smtpHost}:${smtpPort}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${smtpUser}:${smtpPassword}`)}`
      },
      body: JSON.stringify({
        from: fromEmail,
        to: 'imad@expndy.com',
        subject: `Nouvelle réservation - ${reservationData.spectacleName} - ${reservationData.reservationId}`,
        html: getAdminEmailTemplate(reservationData)
      })
    });

    const clientEmailSent = clientEmailResponse.ok;
    const adminEmailSent = adminEmailResponse.ok;

    return new Response(
      JSON.stringify({ 
        success: true, 
        clientEmailSent, 
        adminEmailSent,
        message: `Emails sent - Client: ${clientEmailSent}, Admin: ${adminEmailSent}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending emails:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        clientEmailSent: false,
        adminEmailSent: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
