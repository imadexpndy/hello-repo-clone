import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Users, UserPlus, Eye, Trash2, Ban, CheckCircle, XCircle, Mail, Calendar, Shield } from 'lucide-react';

export default function AdminUsers() {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [adminRoles, setAdminRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [userDetailsDialogOpen, setUserDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    roleId: '',
    customPermissions: [],
    invitedByName: ''
  });

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
    'settings_write': 'Écriture Paramètres'
  };

  const userTypeLabels = {
    'particulier': 'Particulier',
    'scolaire-privee': 'Scolaire Privé',
    'scolaire-publique': 'Scolaire Public',
    'association': 'Association',
    'teacher_private': 'Enseignant Privé'
  };

  const getUserTypeBadgeColor = (userType) => {
    switch (userType) {
      case 'particulier': return 'bg-blue-100 text-blue-800';
      case 'scolaire-privee': return 'bg-green-100 text-green-800';
      case 'scolaire-publique': return 'bg-purple-100 text-purple-800';
      case 'association': return 'bg-orange-100 text-orange-800';
      case 'teacher_private': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredUsers = () => {
    if (activeTab === 'all') return users;
    return users.filter(user => user.user_type === activeTab);
  };

  const getUserCounts = () => {
    const counts = {
      all: users.length,
      particulier: users.filter(u => u.user_type === 'particulier').length,
      'scolaire-privee': users.filter(u => u.user_type === 'scolaire-privee').length,
      'scolaire-publique': users.filter(u => u.user_type === 'scolaire-publique').length,
      association: users.filter(u => u.user_type === 'association').length
    };
    return counts;
  };

  useEffect(() => {
    fetchUsers();
    fetchAdminRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          admin_user_permissions (
            id,
            role_id,
            custom_permissions,
            admin_roles (
              name,
              display_name,
              permissions
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminRoles = async () => {
    try {
      const { data, error } = await (supabase as any).rpc('get_admin_roles');

      if (error) {
        console.error('Error fetching admin roles:', error);
        return;
      }

      setAdminRoles(data || []);
    } catch (error) {
      console.error('Error in fetchAdminRoles:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', selectedUser.user_id);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Erreur lors de la suppression de l\'utilisateur');
        return;
      }

      toast.success('Utilisateur supprimé avec succès');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error in handleDeleteUser:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (user) => {
    try {
      const newStatus = user.is_blocked ? false : true;
      
      // Use any type to bypass TypeScript issues
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ is_blocked: newStatus })
        .eq('user_id', user.user_id);

      if (error) {
        console.error('Block/unblock error:', error);
        toast.error('Erreur lors de la modification du statut');
        return;
      }

      toast.success(newStatus ? 'Utilisateur bloqué' : 'Utilisateur débloqué');
      fetchUsers();
    } catch (error) {
      console.error('Error in handleBlockUser:', error);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteForm.email) {
      toast.error('Veuillez saisir un email');
      return;
    }

    try {
      setLoading(true);

      const { data: permissionData, error: permissionError } = await (supabase as any).rpc('create_admin_permissions', {
        p_role_id: inviteForm.roleId || null,
        p_custom_permissions: inviteForm.customPermissions
      });

      if (permissionError) {
        console.error('Permission creation error:', permissionError);
        toast.error('Erreur lors de la création des permissions');
        return;
      }

      const { error } = await supabase.functions.invoke('send-admin-invitation', {
        body: {
          email: inviteForm.email,
          invitedByName: inviteForm.invitedByName,
          permissionId: permissionData.id
        }
      });

      if (error) {
        console.error('Invitation error:', error);
        toast.error('Erreur lors de l\'envoi de l\'invitation');
        return;
      }

      toast.success('Invitation envoyée avec succès');
      setInviteDialogOpen(false);
      setInviteForm({ email: '', roleId: '', customPermissions: [], invitedByName: '' });
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermissions = async (userId: string, roleId: string, customPermissions: string[]) => {
    try {
      setLoading(true);

      const { data, error } = await (supabase as any).rpc('update_user_permissions', {
        p_user_id: userId,
        p_role_id: roleId || null,
        p_custom_permissions: customPermissions
      });

      if (data && !data.success) {
        throw new Error(data.error || 'Permission update failed');
      }

      if (error) {
        console.error('Permission update error:', error);
        toast.error('Erreur lors de la mise à jour des permissions');
        return;
      }

      toast.success('Permissions mises à jour avec succès');
      setPermissionsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = (user: any) => {
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

  const PermissionsEditor = ({ user, adminRoles, permissionLabels, onSave, onCancel }: any) => {
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
  };

  return (
    <DashboardLayout>
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

        {/* Users Tabs */}
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
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">
                    Tous ({getUserCounts().all})
                  </TabsTrigger>
                  <TabsTrigger value="particulier">
                    Particuliers ({getUserCounts().particulier})
                  </TabsTrigger>
                  <TabsTrigger value="scolaire-privee">
                    Scolaire Privé ({getUserCounts()['scolaire-privee']})
                  </TabsTrigger>
                  <TabsTrigger value="scolaire-publique">
                    Scolaire Public ({getUserCounts()['scolaire-publique']})
                  </TabsTrigger>
                  <TabsTrigger value="association">
                    Associations ({getUserCounts().association})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Email Confirmé</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Rôle Admin</TableHead>
                        <TableHead>Créé le</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredUsers().map((user: any) => (
                        <TableRow key={user.user_id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{user.full_name || 'Sans nom'}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getUserTypeBadgeColor(user.user_type)}>
                              {userTypeLabels[user.user_type] || 'Non défini'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {user.is_verified ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className={user.is_verified ? 'text-green-600' : 'text-red-600'}>
                                {user.is_verified ? 'Confirmé' : 'En attente'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {user.is_blocked ? (
                                <Ban className="h-4 w-4 text-red-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              <span className={user.is_blocked ? 'text-red-600' : 'text-green-600'}>
                                {user.is_blocked ? 'Bloqué' : 'Actif'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {getUserRole(user)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(user.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setUserDetailsDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {isSuperAdmin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setPermissionsDialogOpen(true);
                                  }}
                                >
                                  <Shield className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleBlockUser(user)}
                                className={user.is_blocked ? 'text-green-600' : 'text-orange-600'}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                              {isSuperAdmin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={userDetailsDialogOpen} onOpenChange={setUserDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'utilisateur</DialogTitle>
              <DialogDescription>
                Informations complètes sur l'utilisateur sélectionné
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nom complet</Label>
                    <p className="text-sm">{selectedUser.full_name || 'Non renseigné'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Type d'utilisateur</Label>
                    <Badge className={getUserTypeBadgeColor(selectedUser.user_type)}>
                      {userTypeLabels[selectedUser.user_type] || 'Non défini'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Statut de vérification</Label>
                    <div className="flex items-center gap-2">
                      {selectedUser.is_verified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={selectedUser.is_verified ? 'text-green-600' : 'text-red-600'}>
                        {selectedUser.is_verified ? 'Email confirmé' : 'Email non confirmé'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Statut du compte</Label>
                    <div className="flex items-center gap-2">
                      {selectedUser.is_blocked ? (
                        <Ban className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <span className={selectedUser.is_blocked ? 'text-red-600' : 'text-green-600'}>
                        {selectedUser.is_blocked ? 'Compte bloqué' : 'Compte actif'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date d'inscription</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{new Date(selectedUser.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rôle administrateur</Label>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">
                      {getUserRole(selectedUser)}
                    </Badge>
                  </div>
                </div>

                {selectedUser.admin_user_permissions?.[0]?.custom_permissions?.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Permissions personnalisées</Label>
                    <div className="flex flex-wrap gap-1">
                      {selectedUser.admin_user_permissions[0].custom_permissions.map((perm: string) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {permissionLabels[perm] || perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur {selectedUser?.email} ?
                Cette action est irréversible et supprimera toutes les données associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer définitivement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
