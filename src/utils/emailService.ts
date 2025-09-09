import { supabase } from '@/integrations/supabase/client';
import { generateTicketPDF, generateBulkTicketsPDF, type TicketData } from './pdfGenerator';

export interface EmailConfirmationData {
  userEmail: string;
  userName: string;
  spectacleName: string;
  reservationId: string;
  ticketData: TicketData;
  isBulkReservation?: boolean;
}

export const sendConfirmationEmail = async (data: EmailConfirmationData): Promise<boolean> => {
  try {
    // Generate PDF ticket
    const pdfBuffer = data.isBulkReservation 
      ? generateBulkTicketsPDF(data.ticketData)
      : generateTicketPDF(data.ticketData);
    
    // Convert to base64 for email attachment
    const pdfBase64 = btoa(String.fromCharCode(...pdfBuffer));
    
    // Prepare email content
    const emailSubject = `Confirmation de réservation - ${data.spectacleName}`;
    const emailBody = generateEmailBody(data);
    
    // Send email via Supabase Edge Function (to be implemented)
    const { data: result, error } = await supabase.functions.invoke('send-confirmation-email', {
      body: {
        to: data.userEmail,
        subject: emailSubject,
        html: emailBody,
        attachments: [{
          filename: `billet-${data.reservationId}.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf'
        }]
      }
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }

    console.log('Confirmation email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error in sendConfirmationEmail:', error);
    return false;
  }
};

const generateEmailBody = (data: EmailConfirmationData): string => {
  const { ticketData, spectacleName, reservationId } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #2980b9, #3498db); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .ticket-info { background: #f8f9fa; padding: 15px; border-left: 4px solid #2980b9; margin: 20px 0; }
        .footer { background: #34495e; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .btn { background: #2980b9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Confirmation de Réservation</h1>
        <h2>${spectacleName}</h2>
      </div>
      
      <div class="content">
        <p>Bonjour ${data.userName},</p>
        
        <p>Nous avons le plaisir de vous confirmer votre réservation pour le spectacle <strong>${spectacleName}</strong>.</p>
        
        <div class="ticket-info">
          <h3>Détails de votre réservation :</h3>
          <ul>
            <li><strong>Date :</strong> ${ticketData.spectacleDate}</li>
            <li><strong>Heure :</strong> ${ticketData.spectacleTime}</li>
            <li><strong>Lieu :</strong> ${ticketData.venue}</li>
            <li><strong>Adresse :</strong> ${ticketData.venueAddress}</li>
            ${ticketData.numberOfChildren ? `<li><strong>Nombre d'enfants :</strong> ${ticketData.numberOfChildren}</li>` : ''}
            ${ticketData.numberOfAccompanying ? `<li><strong>Nombre d'accompagnateurs :</strong> ${ticketData.numberOfAccompanying}</li>` : ''}
            ${ticketData.numberOfParticipants ? `<li><strong>Nombre de participants :</strong> ${ticketData.numberOfParticipants}</li>` : ''}
            <li><strong>Prix total :</strong> ${ticketData.ticketPrice} DH</li>
            <li><strong>ID Réservation :</strong> ${reservationId}</li>
          </ul>
        </div>
        
        <p><strong>Votre billet est en pièce jointe de cet email.</strong> Veuillez l'imprimer ou le présenter sur votre téléphone à l'entrée.</p>
        
        ${ticketData.paymentMethod === 'Virement bancaire' ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h4 style="color: #856404; margin-top: 0;">Instructions pour le virement bancaire :</h4>
            <p style="color: #856404;">
              Veuillez effectuer le virement bancaire dans les 48h suivant cette confirmation.<br>
              <strong>Coordonnées bancaires :</strong><br>
              Banque : [À compléter]<br>
              IBAN : [À compléter]<br>
              Référence : ${reservationId}<br>
              <br>
              <em>Votre réservation sera confirmée définitivement après réception du paiement.</em>
            </p>
          </div>
        ` : ''}
        
        <p>En cas de questions, n'hésitez pas à nous contacter à <a href="mailto:inscription@edjs.ma">inscription@edjs.ma</a> ou au [numéro de téléphone].</p>
        
        <p>Nous avons hâte de vous accueillir pour ce spectacle !</p>
        
        <p>Cordialement,<br>L'équipe EDJS</p>
      </div>
      
      <div class="footer">
        <p>EDJS - École de Jeunes Spectacles</p>
        <p>www.edjs.art | inscription@edjs.ma</p>
        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </body>
    </html>
  `;
};
