import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Theater, 
  Ticket, 
  LogOut, 
  HelpCircle,
  ChevronDown 
} from 'lucide-react';

export function UserDropdown() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:inline">
            {profile?.full_name || profile?.first_name || 'Utilisateur'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {profile?.full_name || profile?.first_name || 'Mon compte'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigation('/spectacles')}>
          <Theater className="mr-2 h-4 w-4" />
          <span>Spectacles</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigation('/my-reservations')}>
          <Ticket className="mr-2 h-4 w-4" />
          <span>Réservations</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigation('/help')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Aide et support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
