import { supabase } from '@/integrations/supabase/client';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ReservationEmailData {
  userEmail: string;
  userName: string;
  spectacleName: string;
  sessionDate: string;
  sessionTime: string;
  location: string;
  ticketCount: number;
  totalAmount: number;
  reservationId: string;
}

export const sendConfirmationEmail = async (data: ReservationEmailData): Promise<boolean> => {
  try {
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #BDCF00; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmation de réservation</h1>
            <p>L'École des jeunes spectateurs</p>
          </div>
          <div class="content">
            <h2>Bonjour ${data.userName},</h2>
            <p>Votre réservation a été confirmée avec succès !</p>
            
            <div class="details">
              <h3>Détails de votre réservation :</h3>
              <p><strong>Spectacle :</strong> ${data.spectacleName}</p>
              <p><strong>Date :</strong> ${new Date(data.sessionDate).toLocaleDateString('fr-FR')}</p>
              <p><strong>Heure :</strong> ${data.sessionTime}</p>
              <p><strong>Lieu :</strong> ${data.location}</p>
              <p><strong>Nombre de billets :</strong> ${data.ticketCount}</p>
              <p><strong>Montant total :</strong> ${data.totalAmount} MAD</p>
              <p><strong>Numéro de réservation :</strong> ${data.reservationId}</p>
            </div>
            
            <p>Veuillez présenter cette confirmation le jour du spectacle.</p>
            <p>En cas de questions, n'hésitez pas à nous contacter.</p>
          </div>
          <div class="footer">
            <p>L'École des jeunes spectateurs - Rabat & Casablanca</p>
            <p>Email: contact@edjs.ma | Tél: +212 5XX XX XX XX</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nouvelle réservation</h1>
            <p>Notification administrateur</p>
          </div>
          <div class="content">
            <h2>Nouvelle réservation reçue</h2>
            
            <div class="details">
              <h3>Détails de la réservation :</h3>
              <p><strong>Client :</strong> ${data.userName}</p>
              <p><strong>Email :</strong> ${data.userEmail}</p>
              <p><strong>Spectacle :</strong> ${data.spectacleName}</p>
              <p><strong>Date :</strong> ${new Date(data.sessionDate).toLocaleDateString('fr-FR')}</p>
              <p><strong>Heure :</strong> ${data.sessionTime}</p>
              <p><strong>Lieu :</strong> ${data.location}</p>
              <p><strong>Nombre de billets :</strong> ${data.ticketCount}</p>
              <p><strong>Montant total :</strong> ${data.totalAmount} MAD</p>
              <p><strong>Numéro de réservation :</strong> ${data.reservationId}</p>
            </div>
            
            <p>Veuillez traiter cette réservation dans le système administrateur.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send user confirmation email
    const userEmailData: EmailData = {
      to: data.userEmail,
      subject: `Confirmation de réservation - ${data.spectacleName}`,
      html: userEmailHtml,
      text: `Confirmation de réservation pour ${data.spectacleName} le ${new Date(data.sessionDate).toLocaleDateString('fr-FR')} à ${data.sessionTime}. Numéro de réservation: ${data.reservationId}`
    };

    // Send admin notification email
    const adminEmailData: EmailData = {
      to: 'admin@edjs.ma',
      subject: `Nouvelle réservation - ${data.spectacleName} - ${data.userName}`,
      html: adminEmailHtml,
      text: `Nouvelle réservation de ${data.userName} (${data.userEmail}) pour ${data.spectacleName} le ${new Date(data.sessionDate).toLocaleDateString('fr-FR')}. Montant: ${data.totalAmount} MAD`
    };

    // Use Supabase Edge Functions to send emails
    const { error: userEmailError } = await supabase.functions.invoke('send-email', {
      body: userEmailData
    });

    const { error: adminEmailError } = await supabase.functions.invoke('send-email', {
      body: adminEmailData
    });

    if (userEmailError) {
      console.error('Error sending user email:', userEmailError);
      return false;
    }

    if (adminEmailError) {
      console.error('Error sending admin email:', adminEmailError);
      // Don't fail the whole process if admin email fails
    }

    return true;
  } catch (error) {
    console.error('Error in sendConfirmationEmail:', error);
    return false;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking email:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkEmailExists:', error);
    return false;
  }
};
