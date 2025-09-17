import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Settings, LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  headerActions 
}) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock notifications data
  const notifications = [
    { id: 1, title: 'Nouvelle réservation', message: 'Une nouvelle réservation pour Le Petit Prince', time: '5 min' },
    { id: 2, title: 'Confirmation requise', message: 'Veuillez confirmer la session du 15 mars', time: '1h' },
    { id: 3, title: 'Mise à jour système', message: 'Le système sera mis à jour ce soir', time: '2h' }
  ];
  
  const handleSettingsClick = () => {
    if (profile?.admin_role) {
      navigate('/admin/settings');
    } else {
      navigate('/profile');
    }
  };
  
  const handleNotificationClick = () => {
    setNotificationsOpen(true);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Recherche: ${searchQuery}`);
      // Here you would implement actual search functionality
    }
  };
  
  const handleAvatarClick = () => {
    navigate('/profile');
  };

  const getUserInitials = () => {
    const name = profile?.full_name || profile?.first_name || profile?.name || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getUserTypeBadgeVariant = () => {
    // Use user_type as primary source
    if (profile?.user_type) {
      switch (profile.user_type) {
        case 'scolaire-privee':
        case 'scolaire-publique':
          return 'secondary';
        case 'association':
          return 'outline';
        case 'particulier':
          return 'secondary';
        default:
          return 'secondary';
      }
    }
    
    // Fallback to admin_role for admins
    switch (profile?.role) {
      case 'admin_full':
      case 'super_admin':
        return 'destructive';
      case 'scolaire-privee':
      case 'scolaire-publique':
        return 'secondary';
      case 'association':
        return 'outline';
      case 'partner':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getUserTypeDisplayName = () => {
    // Use user_type as primary source
    if (profile?.user_type) {
      switch (profile.user_type) {
        case 'scolaire-privee':
          return 'École Privée';
        case 'scolaire-publique':
          return 'École Publique';
        case 'association':
          return 'Association';
        case 'particulier':
          return 'Client';
        default:
          return profile.user_type;
      }
    }
    
    // Fallback to admin_role for admins and other roles
    switch (profile?.role) {
      case 'admin_full':
        return 'Administrateur';
      case 'super_admin':
        return 'Super Admin';
      case 'scolaire-privee':
        return 'École Privée';
      case 'scolaire-publique':
        return 'École Publique';
      case 'association':
        return 'Association';
      case 'partner':
        return 'Partenaire';
      case 'b2c_user':
        return 'Client';
      default:
        return 'Utilisateur';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-full items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-2" />
                <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 max-w-md flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-muted/50 focus-visible:ring-1"
                  />
                </form>
              </div>

              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={handleNotificationClick}
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    {notifications.length}
                  </Badge>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSettingsClick}
                  title="Paramètres"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center gap-3 pl-2 border-l">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">
                      {profile?.full_name || profile?.first_name || 'Utilisateur'}
                    </p>
                    <Badge variant={getUserTypeBadgeVariant()} className="text-xs">
                      {getUserTypeDisplayName()}
                    </Badge>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSettingsClick}>
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground animate-fade-in">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        {subtitle}
                      </p>
                    )}
                  </div>
                  {headerActions && (
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                      {headerActions}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              Vous avez {notifications.length} nouvelles notifications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">Il y a {notification.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setNotificationsOpen(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};