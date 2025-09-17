import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Users, UserPlus, Shield, Mail, Activity, Settings } from 'lucide-react';

export default function AdminUsers() {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [adminRoles, setAdminRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    roleId: '',
    customPermissions: [],
    invitedByName: ''
  });
  const [healthCheck, setHealthCheck] = useState(null);

  const permissionLabels = {
    'spectacles_read': 'Lecture Spectacles',
    'spectacles_write': 'Écriture Spectacles',
    'sessions_read': 'Lecture Sessions',
    'sessions_write': 'Écriture Sessions',
    'bookings_read': 'Lecture Réservations',
    'bookings_write': 'Écriture Réservations',
    'users_read': 'Lecture Utilisateurs',
    'users_write': 'Écriture Utilisateurs',
    'organizations_read': 'Lecture Organisations',
    'organizations_write': 'Écriture Organisations',
    'communications_read': 'Lecture Communications',
    'communications_write': 'Écriture Communications',
    'audit_read': 'Lecture Audit',
    'analytics_read': 'Lecture Statistiques',
    'registrations_read': 'Lecture Inscriptions',
    'registrations_write': 'Écriture Inscriptions',
    'settings_read': 'Lecture Paramètres',
    'settings_write': 'Écriture Paramètres',
    'super_admin': 'Super Administrateur'
  };

  useEffect(() => {
    document.title = "Gestion des Utilisateurs | EDJS";
    fetchUsers();
    fetchInvitations();
    fetchAdminRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Starting user fetch...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Raw query result:', { data, error, count: data?.length });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      // For now, add empty admin permissions array to each user
      const usersWithPermissions = data?.map(profile => ({
        ...profile,
        admin_user_permissions: []
      })) || [];

      console.log('Processed users:', usersWithPermissions);
      setUsers(usersWithPermissions);
      
      if (usersWithPermissions.length === 0) {
        console.warn('No users found in profiles table');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(`Erreur lors du chargement des utilisateurs: ${error.message}`);
    }
  };

  const fetchAdminRoles = async () => {
    // Use hardcoded roles for now to avoid TypeScript issues
    // These match the roles created in the migration
    setAdminRoles([
      { 
        id: 'admin_spectacles', 
        name: 'admin_spectacles', 
        display_name: 'Gestionnaire de Spectacles', 
        permissions: ['spectacles_read', 'spectacles_write'] 
      },
      { 
        id: 'admin_bookings', 
        name: 'admin_bookings', 
        display_name: 'Gestionnaire de Réservations', 
        permissions: ['bookings_read', 'bookings_write'] 
      },
      { 
        id: 'admin_users', 
        name: 'admin_users', 
        display_name: 'Gestionnaire d\'Utilisateurs', 
        permissions: ['users_read', 'users_write'] 
      },
      { 
        id: 'admin_full', 
        name: 'admin_full', 
        display_name: 'Administrateur Complet', 
        permissions: ['spectacles_read', 'spectacles_write', 'bookings_read', 'bookings_write', 'users_read', 'users_write', 'reports_read'] 
      },
      { 
        id: 'super_admin', 
        name: 'super_admin', 
        display_name: 'Super Administrateur', 
        permissions: ['super_admin'] 
      }
    ]);
  };

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_invitations')
        .select('*')
        .is('accepted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    try {
      setLoading(true);
      
      // Skip admin permissions creation for now until migration is applied
      console.log('Admin permissions will be created after database migration');
      const permissionData = null;
      
      console.log('Sending invitation with data:', inviteForm);
      
      const { data, error } = await supabase.functions.invoke('send-admin-invitation', {
        body: {
          ...inviteForm,
          permissionId: permissionData?.id
        }
      });

      console.log('Invitation response:', { data, error });

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        toast.error(`Erreur: ${data.error}`);
        return;
      }

      if (data?.recoveryLink) {
        await navigator.clipboard.writeText(data.recoveryLink);
        toast.success("Utilisateur existant: lien de connexion copié dans le presse-papiers");
      } else {
        if (data?.inviteLink) {
          await navigator.clipboard.writeText(data.inviteLink);
          toast.success("Lien d'invitation copié dans le presse-papiers");
        } else {
          toast.success('Invitation envoyée avec succès!');
        }
      }

      setInviteDialogOpen(false);
      setInviteForm({ email: '', roleId: '', customPermissions: [], invitedByName: '' });
      fetchInvitations();
    } catch (error) {
      console.error('Error sending invitation:', error);
      const errorMessage = error?.message || 'Erreur lors de l\'envoi de l\'invitation';
      toast.error(`Erreur détaillée: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const runHealthCheck = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-invitation', {
        body: { health: true }
      });

      if (error) throw error;

      setHealthCheck(data);
      const supaMode = data?.using === 'supabase-auth';
      const status = supaMode
        ? (data.canInvite ? 'success' : 'error')
        : (data.hasApiKey && data.fromLooksValid ? 'success' : 'error');
      const message = supaMode
        ? (data.canInvite ? 'Configuration email (Supabase) OK ✓' : 'Problème config: Supabase service role manquant')
        : (data.hasApiKey && data.fromLooksValid 
          ? 'Configuration email OK ✓' 
          : `Problème config: ${!data.hasApiKey ? 'API Key manquante' : ''} ${!data.fromLooksValid ? 'RESEND_FROM invalide' : ''}`);
      
      toast[status](message);
    } catch (error) {
      console.error('Health check failed:', error);
      toast.error('Échec vérification configuration');
    }
  };

  const resendInvitation = async (email: string, role: string, name: string, token?: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('send-admin-invitation', {
        body: {
          email,
          role,
          invitedByName: name || 'Admin',
          invitationToken: token
        }
      });

      if (data?.error) {
        toast.error(`Erreur: ${data.error}`);
      } else if (data?.recoveryLink) {
        await navigator.clipboard.writeText(data.recoveryLink);
        toast.success("Utilisateur existant: lien de connexion copié dans le presse-papiers");
      } else {
        toast.success('Invitation renvoyée avec succès!');
        fetchInvitations();
      }
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast.error('Erreur lors du renvoi de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermissions = async (userId: string, roleId: string, customPermissions: string[]) => {
    try {
      console.log('Updating permissions for user:', userId, { roleId, customPermissions });
      
      // For now, just show success message
      // Actual implementation will be added after database migration
      toast.success('Permissions mises à jour avec succès (simulation)');
      setPermissionsDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
    }
  };

  const openPermissionsDialog = (user: any) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  const getBadgeVariant = (permissions: string[]) => {
    if (!permissions || permissions.length === 0) return 'outline';
    if (permissions.includes('super_admin')) return 'destructive';
    if (permissions.length > 5) return 'default';
    return 'secondary';
  };

  const getUserPermissions = (user: any) => {
    const userPerms = user.admin_user_permissions?.[0];
    if (!userPerms) return [];
    
    const rolePermissions = userPerms.admin_roles?.permissions || [];
    const customPermissions = userPerms.custom_permissions || [];
    
    return [...new Set([...rolePermissions, ...customPermissions])];
  };

  const getUserRoleDisplay = (user: any) => {
    const userPerms = user.admin_user_permissions?.[0];
    if (!userPerms) return 'Aucun rôle';
    
    if (userPerms.admin_roles) {
      return userPerms.admin_roles.display_name;
    }
    
    const customPerms = userPerms.custom_permissions || [];
    if (customPerms.length > 0) {
      return 'Permissions personnalisées';
    }
    
    return 'Aucun rôle';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs et leurs permissions d'accès
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter un Admin
          </Button>
        )}
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Les nouveaux utilisateurs apparaîtront ici automatiquement après leur inscription et confirmation d'email.
              </p>
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 max-w-lg mx-auto">
                <p className="font-medium mb-2">Pour que les utilisateurs apparaissent :</p>
                <ol className="list-decimal list-inside space-y-1 text-left">
                  <li>L'utilisateur doit s'inscrire via l'application</li>
                  <li>Confirmer son adresse email</li>
                  <li>Le profil sera créé automatiquement</li>
                </ol>
              </div>
            </div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Créé le</TableHead>
                    {isSuperAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.full_name || user.first_name + ' ' + user.last_name || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(getUserPermissions(user))}>
                          {getUserRoleDisplay(user)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString('fr-FR')}</TableCell>
                      {isSuperAdmin && (
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openPermissionsDialog(user)}
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Gérer
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gérer les permissions - {selectedUser?.full_name || selectedUser?.email}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <PermissionsEditor
              user={selectedUser}
              adminRoles={adminRoles}
              permissionLabels={permissionLabels}
              onSave={handleUpdatePermissions}
              onCancel={() => setPermissionsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un Administrateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <Label>Rôle prédéfini</Label>
              <Select value={inviteForm.roleId} onValueChange={(value) => setInviteForm({...inviteForm, roleId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Permissions personnalisées uniquement</SelectItem>
                  {adminRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.display_name}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({role.permissions?.length || 0} permissions)
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Permissions personnalisées</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={inviteForm.customPermissions.includes(key)}
                      onCheckedChange={(checked) => {
                        const newPermissions = checked
                          ? [...inviteForm.customPermissions, key]
                          : inviteForm.customPermissions.filter(p => p !== key);
                        setInviteForm({...inviteForm, customPermissions: newPermissions});
                      }}
                    />
                    <Label htmlFor={key} className="text-xs">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSendInvitation} disabled={loading}>
                Envoyer l'invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </DashboardLayout>
  );
}

        <div>
          <Label>Permissions personnalisées</Label>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded p-3">
            {Object.entries(permissionLabels).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={customPermissions.includes(key)}
                  onCheckedChange={(checked) => {
                    const newPermissions = checked
                      ? [...customPermissions, key]
                      : customPermissions.filter(p => p !== key);
                    setCustomPermissions(newPermissions);
                  }}
                />
                <Label htmlFor={key} className="text-sm">{String(label)}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </div>
    );
  }
}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  {!inviteForm.roleId && (
                    <div>
                      <Label>Permissions personnalisées</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                        {Object.entries(permissionLabels).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={inviteForm.customPermissions.includes(key)}
                              onCheckedChange={(checked) => {
                                const newPermissions = checked
                                  ? [...inviteForm.customPermissions, key]
                                  : inviteForm.customPermissions.filter(p => p !== key);
                                setInviteForm({...inviteForm, customPermissions: newPermissions});
                              }}
                            />
                            <Label htmlFor={key} className="text-xs">{label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button onClick={handleSendInvitation} className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer l'invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>
  ) : null;

  return (
    <DashboardLayout 
      title="Gestion des Utilisateurs"
      subtitle="Gérez les utilisateurs et les administrateurs de la plateforme"
      headerActions={headerActions}
    >
      {/* Health Check Results */}
      {healthCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Configuration Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthCheck?.using === 'supabase-auth' ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant={healthCheck.canInvite ? 'default' : 'destructive'}>
                    {healthCheck.canInvite ? '✓' : '✗'} Supabase Auth actif
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={healthCheck.hasServiceRole ? 'default' : 'destructive'}>
                    {healthCheck.hasServiceRole ? '✓' : '✗'} Service Role
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={healthCheck.hasUrl ? 'default' : 'destructive'}>
                    {healthCheck.hasUrl ? '✓' : '✗'} Project URL
                  </Badge>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={healthCheck.hasApiKey ? 'default' : 'destructive'}>
                      {healthCheck.hasApiKey ? '✓' : '✗'} API Key
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={healthCheck.hasFrom ? 'default' : 'destructive'}>
                      {healthCheck.hasFrom ? '✓' : '✗'} RESEND_FROM
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={healthCheck.fromLooksValid ? 'default' : 'destructive'}>
                      {healthCheck.fromLooksValid ? '✓' : '✗'} Format Valide
                    </Badge>
                  </div>
                </div>
                {healthCheck.sanitizedFromPreview && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Adresse détectée: {healthCheck.sanitizedFromPreview}
                  </p>
                )}
                {healthCheck.notes && healthCheck.notes.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer">Détails de validation</summary>
                    <ul className="text-xs text-muted-foreground mt-1 ml-4">
                      {healthCheck.notes.map((note, i) => (
                        <li key={i}>• {note}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </>
            )}

          </CardContent>
        </Card>
      )}

      {/* Active Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utilisateurs Actifs ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Créé le</TableHead>
                {isSuperAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name || user.first_name + ' ' + user.last_name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(getUserPermissions(user))}>
                      {getUserRoleDisplay(user)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString('fr-FR')}</TableCell>
                   {isSuperAdmin && (
                     <TableCell>
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => openPermissionsDialog(user)}
                       >
                         <Settings className="h-3 w-3 mr-1" />
                         Gérer
                       </Button>
                     </TableCell>
                   )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permissions Management Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gérer les permissions - {selectedUser?.full_name || selectedUser?.email}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <PermissionsEditor
              user={selectedUser}
              adminRoles={adminRoles}
              permissionLabels={permissionLabels}
              onSave={handleUpdatePermissions}
              onCancel={() => setPermissionsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Invitations en attente ({invitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Envoyée le</TableHead>
                  <TableHead>Expire le</TableHead>
                  {isSuperAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation: any) => (
                  <TableRow key={invitation.id}>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {adminRoles.find(r => r.id === invitation.role_id)?.display_name || 'Permissions personnalisées'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(invitation.created_at).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{new Date(invitation.expires_at).toLocaleDateString('fr-FR')}</TableCell>
                    {isSuperAdmin && (
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resendInvitation(invitation.email, invitation.role, 'Admin', invitation.invitation_token)}
                          disabled={loading}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Renvoyer
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

// Permissions Editor Component
function PermissionsEditor({ user, adminRoles, permissionLabels, onSave, onCancel }: any) {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);

  useEffect(() => {
    const userPerms = user.admin_user_permissions?.[0];
    if (userPerms) {
      setSelectedRoleId(userPerms.role_id || '');
      setCustomPermissions(userPerms.custom_permissions || []);
    }
  }, [user]);

  const handleSave = () => {
    onSave(user.user_id, selectedRoleId, customPermissions);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Rôle prédéfini</Label>
        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Permissions personnalisées uniquement</SelectItem>
            {adminRoles.map((role: any) => (
              <SelectItem key={role.id} value={role.id}>
                {role.display_name}
                <span className="text-xs text-muted-foreground ml-2">
                  ({role.permissions?.length || 0} permissions)
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Permissions personnalisées</Label>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded p-3">
          {Object.entries(permissionLabels).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={customPermissions.includes(key)}
                onCheckedChange={(checked) => {
                  const newPermissions = checked
                    ? [...customPermissions, key]
                    : customPermissions.filter(p => p !== key);
                  setCustomPermissions(newPermissions);
                }}
              />
              <Label htmlFor={key} className="text-sm">{String(label)}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}