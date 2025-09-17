import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, User, Menu } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
    setIsOpen(false);
  };

  const getUserInitials = () => {
    const name = profile?.full_name || profile?.first_name || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const NavigationItems = () => (
    <>
      <Link to="/profile" onClick={() => setIsOpen(false)}>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <User className="h-4 w-4 mr-2" />
          Profil
        </Button>
      </Link>
      
      <div className="flex items-center space-x-2 px-3 py-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">
          {profile?.full_name || profile?.first_name || 'Utilisateur'}
        </span>
      </div>

      <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
        <LogOut className="h-4 w-4 mr-2" />
        Déconnexion
      </Button>
    </>
  );

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/b82bf764-c505-4dd6-960c-99a6acf57b3e.png" 
              alt="EDJS" 
              className="h-6 md:h-8 w-auto"
            />
            <span className="font-bold text-base md:text-lg">EDJS</span>
          </Link>

          {user && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profil
                  </Button>
                </Link>
                
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {profile?.full_name || profile?.first_name || 'Utilisateur'}
                  </span>
                </div>

                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <div className="flex flex-col space-y-4 mt-8">
                      <NavigationItems />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};