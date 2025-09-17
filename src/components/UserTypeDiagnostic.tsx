import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const UserTypeDiagnostic = () => {
  const { user, profile } = useAuth();

  return (
    <Card className="m-4 border-2 border-red-500">
      <CardHeader>
        <CardTitle className="text-red-600">🔍 User Type Diagnostic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">User Info:</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded">
            {JSON.stringify({
              id: user?.id,
              email: user?.email,
              user_metadata: user?.user_metadata
            }, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3 className="font-semibold">Profile Info:</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded">
            {JSON.stringify({
              id: profile?.id,
              user_type: profile?.user_type,
              professional_type: profile?.professional_type,
              role: profile?.role,
              admin_role: (profile as any)?.admin_role,
              school_id: profile?.school_id,
              association_id: profile?.association_id,
              verification_status: profile?.verification_status
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Expected User Type:</h3>
          <div className="p-2 bg-blue-100 rounded">
            {profile?.user_type === "scolaire-privee" ? (
              <span className="text-green-600 font-bold">✅ Should be SCOLAIRE-PRIVEE</span>
            ) : profile?.user_type === "scolaire-publique" ? (
              <span className="text-blue-600 font-bold">✅ Should be SCOLAIRE-PUBLIQUE</span>
            ) : profile?.user_type === 'association' ? (
              <span className="text-purple-600 font-bold">✅ Should be ASSOCIATION</span>
            ) : (
              <span className="text-gray-600 font-bold">Should be PARTICULIER</span>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Database Columns Check:</h3>
          <div className="space-y-1">
            <div>user_type column exists: {profile?.hasOwnProperty('user_type') ? '✅' : '❌'}</div>
            <div>professional_type column exists: {profile?.hasOwnProperty('professional_type') ? '✅' : '❌'}</div>
            <div>user_type value: <code>{profile?.user_type || 'null'}</code></div>
            <div>professional_type value: <code>{profile?.professional_type || 'null'}</code></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
