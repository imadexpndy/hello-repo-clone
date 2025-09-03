import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Accueil', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment;
      switch (segment) {
        case 'b2c':
          label = 'Espace Client';
          break;
        case 'booking':
          label = 'Réservation';
          break;
        case 'teacher':
          label = 'Espace Enseignant';
          break;
        case 'admin':
          label = 'Administration';
          break;
        case 'association':
          label = 'Association';
          break;
        case 'partner':
          label = 'Partenaire';
          break;
        default:
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      breadcrumbs.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index === 0 && <Home className="h-4 w-4" />}
          
          {index < breadcrumbItems.length - 1 ? (
            <Link 
              to={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">
              {item.label}
            </span>
          )}
          
          {index < breadcrumbItems.length - 1 && (
            <ChevronRight className="h-4 w-4" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};