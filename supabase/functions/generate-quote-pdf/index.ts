import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingData {
  id: string;
  user_id: string;
  student_count: number;
  teacher_count: number;
  grade_level: string;
  special_requirements: string;
  contact_phone: string;
  school_address: string;
  total_price: number;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    organizations: {
      name: string;
      type: string;
    };
  };
  spectacles: {
    title: string;
    description: string;
    age_range: string;
    duration: number;
    price_school: number;
  };
  spectacle_sessions: {
    date: string;
    time: string;
    venue: string;
  };
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

    const { bookingId } = await req.json()

    // Fetch booking details with related data
    const { data: booking, error: bookingError } = await supabaseClient
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
          description,
          age_range,
          duration,
          price_school
        ),
        spectacle_sessions!inner (
          date,
          time,
          venue
        )
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError) {
      throw new Error(`Failed to fetch booking: ${bookingError.message}`)
    }

    const bookingData = booking as BookingData

    // Generate PDF content
    const pdfContent = generatePDFHTML(bookingData)

    // Convert HTML to PDF using Puppeteer or similar
    const pdfBuffer = await generatePDF(pdfContent)

    // Upload PDF to Supabase Storage
    const fileName = `quote-${bookingId}-${Date.now()}.pdf`
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('quotes')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Failed to upload PDF: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('quotes')
      .getPublicUrl(fileName)

    // Update booking with PDF URL
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        quote_pdf_url: urlData.publicUrl,
        quote_generated_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (updateError) {
      throw new Error(`Failed to update booking: ${updateError.message}`)
    }

    // Send email with PDF attachment
    await sendQuoteEmail(bookingData, urlData.publicUrl)

    return new Response(
      JSON.stringify({
        success: true,
        pdfUrl: urlData.publicUrl,
        message: 'Quote PDF generated and sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error generating PDF quote:', error)
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

function generatePDFHTML(booking: BookingData): string {
  const sessionDate = new Date(booking.spectacle_sessions.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Devis - ${booking.spectacles.title}</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
            }
            .quote-info {
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            .section {
                margin-bottom: 30px;
            }
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #2563eb;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 5px;
                margin-bottom: 15px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
            }
            .info-item {
                margin-bottom: 10px;
            }
            .info-label {
                font-weight: bold;
                color: #64748b;
            }
            .price-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .price-table th,
            .price-table td {
                border: 1px solid #e2e8f0;
                padding: 12px;
                text-align: left;
            }
            .price-table th {
                background: #f1f5f9;
                font-weight: bold;
            }
            .total-row {
                background: #2563eb;
                color: white;
                font-weight: bold;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                text-align: center;
                color: #64748b;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">EDJS - École de Jeunes Spectateurs</div>
            <p>Devis de Réservation de Spectacle</p>
        </div>

        <div class="quote-info">
            <div class="info-grid">
                <div>
                    <div class="info-item">
                        <span class="info-label">N° Devis:</span> EDJS-${booking.id.slice(-8).toUpperCase()}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Date:</span> ${new Date().toLocaleDateString('fr-FR')}
                    </div>
                </div>
                <div>
                    <div class="info-item">
                        <span class="info-label">Statut:</span> ${booking.status === 'pending' ? 'En attente' : 'Confirmé'}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Validité:</span> 30 jours
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Informations Client</div>
            <div class="info-grid">
                <div>
                    <div class="info-item">
                        <span class="info-label">École:</span> ${booking.profiles.organizations.name}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Contact:</span> ${booking.profiles.full_name}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span> ${booking.profiles.email}
                    </div>
                </div>
                <div>
                    <div class="info-item">
                        <span class="info-label">Téléphone:</span> ${booking.contact_phone}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Adresse:</span> ${booking.school_address}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Niveau:</span> ${booking.grade_level.toUpperCase()}
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Détails du Spectacle</div>
            <div class="info-item">
                <span class="info-label">Titre:</span> ${booking.spectacles.title}
            </div>
            <div class="info-item">
                <span class="info-label">Description:</span> ${booking.spectacles.description}
            </div>
            <div class="info-grid">
                <div>
                    <div class="info-item">
                        <span class="info-label">Âge recommandé:</span> ${booking.spectacles.age_range}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Durée:</span> ${booking.spectacles.duration} minutes
                    </div>
                </div>
                <div>
                    <div class="info-item">
                        <span class="info-label">Date:</span> ${sessionDate}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Heure:</span> ${booking.spectacle_sessions.time}
                    </div>
                </div>
            </div>
            ${booking.spectacle_sessions.venue ? `
            <div class="info-item">
                <span class="info-label">Lieu:</span> ${booking.spectacle_sessions.venue}
            </div>
            ` : ''}
        </div>

        <div class="section">
            <div class="section-title">Détail des Prix</div>
            <table class="price-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantité</th>
                        <th>Prix Unitaire</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Élèves</td>
                        <td>${booking.student_count}</td>
                        <td>${booking.spectacles.price_school}€</td>
                        <td>${booking.spectacles.price_school * booking.student_count}€</td>
                    </tr>
                    <tr>
                        <td>Accompagnateurs (50% de réduction)</td>
                        <td>${booking.teacher_count}</td>
                        <td>${booking.spectacles.price_school * 0.5}€</td>
                        <td>${booking.spectacles.price_school * 0.5 * booking.teacher_count}€</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3">TOTAL</td>
                        <td>${booking.total_price}€</td>
                    </tr>
                </tbody>
            </table>
        </div>

        ${booking.special_requirements ? `
        <div class="section">
            <div class="section-title">Besoins Spéciaux</div>
            <p>${booking.special_requirements}</p>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">Conditions</div>
            <ul>
                <li>Ce devis est valable 30 jours à compter de sa date d'émission</li>
                <li>La réservation sera confirmée après validation de votre part</li>
                <li>Le paiement peut être effectué par virement bancaire ou chèque</li>
                <li>Annulation possible jusqu'à 48h avant la représentation</li>
            </ul>
        </div>

        <div class="footer">
            <p>EDJS - École de Jeunes Spectateurs | contact@edjs.art | +212 5 22 XX XX XX</p>
            <p>Ce document a été généré automatiquement le ${new Date().toLocaleString('fr-FR')}</p>
        </div>
    </body>
    </html>
  `
}

async function generatePDF(htmlContent: string): Promise<Uint8Array> {
  // For this demo, we'll use a simple HTML to PDF conversion
  // In production, you'd use Puppeteer or similar
  const encoder = new TextEncoder()
  return encoder.encode(htmlContent) // This is a placeholder - in real implementation, convert HTML to PDF
}

async function sendQuoteEmail(booking: BookingData, pdfUrl: string): Promise<void> {
  // Email sending logic would go here
  // You could use Resend, SendGrid, or similar service
  console.log(`Email would be sent to ${booking.profiles.email} with PDF: ${pdfUrl}`)
}
