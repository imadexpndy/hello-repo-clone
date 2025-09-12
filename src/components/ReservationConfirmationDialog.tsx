import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, CreditCard, AlertTriangle, MessageCircle } from 'lucide-react';

interface ReservationConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: {
    reservationId: string;
    spectacleName: string;
    sessionDate: string;
    sessionTime: string;
    location: string;
    ticketCount: number;
    totalAmount: number;
    paymentMethod: string;
    userName: string;
    userEmail: string;
    userPhone: string;
  };
}

export const ReservationConfirmationDialog: React.FC<ReservationConfirmationDialogProps> = ({
  isOpen,
  onClose,
  reservationData
}) => {
  const handleWhatsAppContact = () => {
    const message = `Bonjour EDJS,\n\nJe viens de confirmer ma réservation:\n\n🎭 Spectacle: ${reservationData.spectacleName}\n📅 Session: ${reservationData.sessionDate} à ${reservationData.sessionTime}\n📍 Lieu: ${reservationData.location}\n👥 Nombre de billets: ${reservationData.ticketCount}\n💰 Montant total: ${reservationData.totalAmount} DH\n🆔 Référence: ${reservationData.reservationId}\n\nNom: ${reservationData.userName}\nEmail: ${reservationData.userEmail}\nTéléphone: ${reservationData.userPhone}\n\n${reservationData.paymentMethod === 'bank_transfer' ? 'Je procéderai au virement bancaire dans les 72h.' : 'Merci de confirmer ma réservation.'}`;
    
    const whatsappUrl = `https://wa.me/212661234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return 'Carte bancaire';
      case 'bank_transfer': return 'Virement bancaire';
      case 'cash': return 'Espèces';
      default: return method;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
            ✅ Réservation Confirmée
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Reservation Details - Horizontal Layout */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Détails de la réservation</h3>
                  <Badge variant="outline" className="text-sm">
                    Réf: {reservationData.reservationId}
                  </Badge>
                </div>
                
                {/* Main reservation info in horizontal layout */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Spectacle</p>
                      <p className="font-medium text-sm">{reservationData.spectacleName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date & Heure</p>
                      <p className="font-medium text-sm">{reservationData.sessionDate}</p>
                      <p className="font-medium text-sm">{reservationData.sessionTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lieu</p>
                      <p className="font-medium text-sm">{reservationData.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Billets</p>
                      <p className="font-medium text-sm">{reservationData.ticketCount} billet(s)</p>
                    </div>
                  </div>
                </div>
                
                {/* Payment and total in horizontal layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mode de paiement</p>
                      <p className="font-medium">{getPaymentMethodLabel(reservationData.paymentMethod)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-green-600">{reservationData.totalAmount} DH</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Reminder and Contact - Horizontal Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Reminder for Bank Transfer */}
            {reservationData.paymentMethod === 'bank_transfer' && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-800">Rappel Important - Paiement par Virement</h4>
                      <p className="text-sm text-orange-700">
                        Vous avez <strong>72 heures</strong> pour effectuer le virement bancaire, sinon votre réservation sera automatiquement annulée.
                      </p>
                      <div className="bg-orange-100 p-3 rounded-lg mt-3">
                        <h5 className="font-medium text-orange-800 mb-2">Informations bancaires - EDJS</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-orange-700">
                          <p><strong>Bénéficiaire:</strong> École du Jeune Spectateur</p>
                          <p><strong>Banque:</strong> Attijariwafa Bank</p>
                          <p><strong>RIB:</strong> 007 780 0000271100000012 85</p>
                          <p><strong>IBAN:</strong> MA64 0077 8000 0027 1100 0000 1285</p>
                          <p className="sm:col-span-2"><strong>SWIFT/BIC:</strong> BCMAMAMC</p>
                        </div>
                      </div>
                      <p className="text-xs text-orange-600 mt-2">
                        💡 N'oubliez pas de mentionner votre référence: <strong>{reservationData.reservationId}</strong>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-800">Besoin d'aide ?</h4>
                    <p className="text-sm text-green-700">
                      Pour toute question concernant votre réservation, n'hésitez pas à nous contacter via WhatsApp.
                    </p>
                    <div className="mt-4">
                      <Button
                        onClick={handleWhatsAppContact}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contacter via WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-8"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
