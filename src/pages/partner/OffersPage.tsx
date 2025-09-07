import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Calendar, Users, Percent, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OffersPage() {
  const [filter, setFilter] = useState('active');
  
  const offers = [
    {
      id: 1,
      title: 'Réduction Groupe Scolaire',
      description: 'Bénéficiez de 15% de réduction pour toute réservation de groupe de plus de 100 élèves',
      discount: '15%',
      type: 'percentage',
      category: 'group',
      validUntil: '2024-04-30',
      minStudents: 100,
      spectacles: ['Le Petit Prince', 'Charlotte', 'Tara sur la Lune'],
      status: 'active',
      used: false
    },
    {
      id: 2,
      title: 'Offre Printemps 2024',
      description: 'Tarif spécial pour les représentations du mois d\'avril - 200 MAD par élève au lieu de 250 MAD',
      discount: '50 MAD',
      type: 'fixed',
      category: 'seasonal',
      validUntil: '2024-04-30',
      minStudents: 50,
      spectacles: ['Tous les spectacles'],
      status: 'active',
      used: true
    },
    {
      id: 3,
      title: 'Partenaire Fidèle',
      description: 'Réduction permanente de 10% pour les partenaires ayant effectué plus de 5 réservations',
      discount: '10%',
      type: 'percentage',
      category: 'loyalty',
      validUntil: '2024-12-31',
      minStudents: 1,
      spectacles: ['Tous les spectacles'],
      status: 'active',
      used: false
    },
    {
      id: 4,
      title: 'Offre Rentrée 2023',
      description: 'Promotion spéciale de septembre - Déjà expirée',
      discount: '20%',
      type: 'percentage',
      category: 'seasonal',
      validUntil: '2023-10-31',
      minStudents: 75,
      spectacles: ['Le Petit Prince'],
      status: 'expired',
      used: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'group': return <Users className="h-4 w-4" />;
      case 'seasonal': return <Calendar className="h-4 w-4" />;
      case 'loyalty': return <Star className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isExpiringSoon = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const filteredOffers = offers.filter(offer => {
    if (filter === 'active') return offer.status === 'active';
    if (filter === 'expired') return offer.status === 'expired';
    if (filter === 'used') return offer.used;
    return true;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Offres Spéciales</h1>
        <p className="text-gray-600">Découvrez nos promotions et réductions exclusives</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Offres disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{offers.filter(o => o.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Percent className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisées</p>
                <p className="text-2xl font-bold text-gray-900">{offers.filter(o => o.used).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expirent bientôt</p>
                <p className="text-2xl font-bold text-gray-900">{offers.filter(o => isExpiringSoon(o.validUntil)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Économies totales</p>
                <p className="text-2xl font-bold text-gray-900">1,250 MAD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'active' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('active')}
        >
          Actives
        </Button>
        <Button 
          variant={filter === 'used' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('used')}
        >
          Utilisées
        </Button>
        <Button 
          variant={filter === 'expired' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('expired')}
        >
          Expirées
        </Button>
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          Toutes
        </Button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className={`transition-all hover:shadow-lg ${offer.status === 'active' && !offer.used ? 'border-green-200' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(offer.category)}
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(offer.status)}>
                    {offer.status === 'active' ? 'Active' : offer.status === 'expired' ? 'Expirée' : 'Utilisée'}
                  </Badge>
                  {isExpiringSoon(offer.validUntil) && offer.status === 'active' && (
                    <Badge className="bg-orange-100 text-orange-800">
                      Expire bientôt
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">{offer.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Réduction:</span>
                      <p className="text-lg font-bold text-green-600">{offer.discount}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Min. élèves:</span>
                      <p className="font-semibold">{offer.minStudents}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-600">Valide jusqu'au:</span>
                      <p className="font-semibold">{formatDate(offer.validUntil)}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600 text-sm">Spectacles concernés:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {offer.spectacles.map((spectacle, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spectacle}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {offer.status === 'active' && !offer.used && (
                  <Button className="w-full">
                    Utiliser cette offre
                  </Button>
                )}
                
                {offer.used && (
                  <Button variant="outline" className="w-full" disabled>
                    Déjà utilisée
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune offre trouvée</h3>
            <p className="text-gray-600">Il n'y a pas d'offres correspondant à vos critères de recherche.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
