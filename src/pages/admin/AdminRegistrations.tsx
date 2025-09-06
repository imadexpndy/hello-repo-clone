import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Eye, Search } from 'lucide-react';

interface PendingRegistration {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  organization_id: string;
  verification_status: string;
  verification_documents: string[];
  created_at: string;
}

export default function AdminRegistrations() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <DashboardLayout title="Accès Refusé" subtitle="">
        <div className="text-center py-8">
          <p>Accès non autorisé. Seuls les administrateurs peuvent voir cette page.</p>
        </div>
      </DashboardLayout>
    );
  }
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<PendingRegistration | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRegistrations = async () => {
    try {
      // First, let's check all profiles to debug
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, email, full_name, verification_status, role')
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('All profiles (debug):', allProfiles);
      console.log('All profiles error:', allError);

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          email,
          full_name,
          phone,
          organization_id,
          verification_status,
          verification_documents,
          created_at
        `)
        .in('verification_status', ['pending', 'under_review'])
        .order('created_at', { ascending: false });

      console.log('Pending registrations:', data);
      console.log('Query error:', error);

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Erreur de base de données",
          description: `Erreur: ${error.message}`,
          variant: "destructive",
        });
        setRegistrations([]);
      } else {
        setRegistrations(data || []);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast({
        title: "Erreur",
        description: `Impossible de charger les demandes: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleApproval = async () => {
    if (!selectedRegistration) return;

    try {
      // Real database update for actual registrations
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_status: approvalAction === 'approve' ? 'approved' : 'rejected',
          is_verified: approvalAction === 'approve',
          season_verified_at: approvalAction === 'approve' ? new Date().toISOString() : null,
        })
        .eq('id', selectedRegistration.id);

      if (error) throw error;

      // Log the approval action (optional - only if audit_logs table exists)
      try {
        await supabase.from('audit_logs').insert({
          user_id: selectedRegistration.user_id,
          action: approvalAction === 'approve' ? 'APPROVE' : 'REJECT',
          table_name: 'profiles',
          entity: 'public_school_registration',
          record_id: selectedRegistration.id,
          new_values: {
            verification_status: approvalAction === 'approve' ? 'approved' : 'rejected',
            notes: approvalNotes
          }
        });
      } catch (auditError) {
        console.log('Audit logging not available:', auditError);
      }

      toast({
        title: "Succès",
        description: `Demande ${approvalAction === 'approve' ? 'approuvée' : 'rejetée'} avec succès`,
      });

      setShowApprovalDialog(false);
      setSelectedRegistration(null);
      setApprovalNotes('');
      fetchRegistrations();
    } catch (error) {
      console.error('Error updating registration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter la demande",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En cours d'examen</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredRegistrations = registrations.filter(reg =>
    reg.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout 
      title="Demandes d'Inscription" 
      subtitle="Gestion des demandes d'inscription des écoles publiques"
    >
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'Inscription en Attente</CardTitle>
          <CardDescription>
            Gestion des demandes d'inscription nécessitant une approbation administrative
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou école..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>École</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune demande d'inscription en attente
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">
                        {registration.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.organization_id || 'N/A'}</TableCell>
                      <TableCell>{registration.phone || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(registration.verification_status)}</TableCell>
                      <TableCell>
                        {new Date(registration.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setApprovalAction('approve');
                              setShowApprovalDialog(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setApprovalAction('reject');
                              setShowApprovalDialog(true);
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la Demande</DialogTitle>
            <DialogDescription>
              Informations complètes sur la demande d'inscription
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Nom Complet</Label>
                  <p>{selectedRegistration.full_name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p>{selectedRegistration.email}</p>
                </div>
                <div>
                  <Label className="font-semibold">Téléphone</Label>
                  <p>{selectedRegistration.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Organisation ID</Label>
                  <p>{selectedRegistration.organization_id || 'N/A'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Statut</Label>
                  <p>{getStatusBadge(selectedRegistration.verification_status)}</p>
                </div>
              </div>
              {selectedRegistration.verification_documents && selectedRegistration.verification_documents.length > 0 && (
                <div>
                  <Label className="font-semibold">Documents de Vérification</Label>
                  <ul className="list-disc list-inside mt-2">
                    {selectedRegistration.verification_documents.map((doc, index) => (
                      <li key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                        Document {index + 1}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approuver' : 'Rejeter'} la Demande
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve' 
                ? 'Cette action approuvera la demande et donnera accès aux spectacles.'
                : 'Cette action rejettera la demande. L\'utilisateur ne pourra pas accéder aux spectacles.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez des notes sur cette décision..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleApproval}
              variant={approvalAction === 'approve' ? 'default' : 'destructive'}
            >
              {approvalAction === 'approve' ? 'Approuver' : 'Rejeter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
