import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Loader2, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentStatusButtonProps {
  bookingId: string;
  currentStatus: 'pending' | 'paid' | 'confirmed';
  userRole: string;
  onStatusUpdate: (newStatus: string) => void;
}

export const PaymentStatusButton: React.FC<PaymentStatusButtonProps> = ({
  bookingId,
  currentStatus,
  userRole,
  onStatusUpdate
}) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handlePaymentConfirmation = async () => {
    setProcessing(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: 'completed',
          payment_confirmed_at: new Date().toISOString(),
          payment_method: 'bank_transfer'
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;

      // Send notification to admin
      await supabase.functions.invoke('send-payment-notification', {
        body: {
          bookingId,
          userRole,
          action: 'payment_confirmed'
        }
      });

      toast({
        title: "Paiement confirmé",
        description: "Votre confirmation de paiement a été enregistrée. Nous vérifierons le virement sous 24h.",
      });

      onStatusUpdate('paid');
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de confirmer le paiement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (userRole === 'b2c_user') {
    return null; // B2C users don't need this button
  }

  if (currentStatus === 'confirmed') {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Paiement confirmé</strong> - Votre réservation est validée
        </AlertDescription>
      </Alert>
    );
  }

  if (currentStatus === 'paid') {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>En attente de vérification</strong> - Nous vérifions votre paiement (24h max)
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <Alert className="border-orange-200 bg-orange-50">
        <Clock className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Paiement en attente</strong> - Effectuez le virement puis confirmez ci-dessous
        </AlertDescription>
      </Alert>
      
      <Button 
        onClick={handlePaymentConfirmation}
        disabled={processing}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <CheckCircle className="mr-2 h-4 w-4" />
        J'ai effectué le paiement
      </Button>
      
      <p className="text-xs text-gray-600 text-center">
        Cliquez uniquement après avoir effectué le virement bancaire
      </p>
    </div>
  );
};
