import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Play, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { seedSpectacles, seedSessions } from '@/utils/seedData';

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false);
  const [spectaclesSeeded, setSpectaclesSeeded] = useState(false);
  const [sessionsSeeded, setSessionsSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeedSpectacles = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting spectacles seeding...');
      await seedSpectacles();
      setSpectaclesSeeded(true);
      console.log('Spectacles seeded successfully');
    } catch (err) {
      console.error('Spectacles seeding error:', err);
      setError(`Error seeding spectacles: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting sessions seeding...');
      await seedSessions();
      setSessionsSeeded(true);
      console.log('Sessions seeded successfully');
    } catch (err) {
      console.error('Sessions seeding error:', err);
      setError(`Error seeding sessions: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAll = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting full data seeding...');
      await seedSpectacles();
      setSpectaclesSeeded(true);
      console.log('Spectacles completed, starting sessions...');
      await seedSessions();
      setSessionsSeeded(true);
      console.log('All data seeded successfully');
    } catch (err) {
      console.error('Full seeding error:', err);
      setError(`Error seeding data: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Database Seeding</h1>
          <p className="text-gray-600">Initialize your database with spectacles and sessions data</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {/* Seed All Button */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6" />
                Quick Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Seed both spectacles and sessions data in one go. This will populate your database with all the necessary data.
              </p>
              <Button 
                onClick={handleSeedAll}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Seeding Data...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Seed All Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Individual Seeding Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Spectacles</span>
                  {spectaclesSeeded && <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Seeded</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Seed spectacles including Flash, Le Petit Prince, Estevanico, and others.
                </p>
                <Button 
                  onClick={handleSeedSpectacles}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Seed Spectacles
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sessions</span>
                  {sessionsSeeded && <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Seeded</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Seed sessions with private school dates for Casablanca and Rabat.
                </p>
                <Button 
                  onClick={handleSeedSessions}
                  disabled={loading || !spectaclesSeeded}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Seed Sessions
                </Button>
                {!spectaclesSeeded && (
                  <p className="text-sm text-gray-500 mt-2">
                    Seed spectacles first
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Success Message */}
          {spectaclesSeeded && sessionsSeeded && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>Database successfully seeded! You can now view sessions at <a href="/sessions" className="underline">/sessions</a></span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
