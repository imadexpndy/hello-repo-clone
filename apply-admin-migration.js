import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read Supabase config
const supabaseUrl = 'https://aioldzmwwhukzabrizkt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb2xkem13d2h1a3phYnJpemt0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjUxMDc2NywiZXhwIjoyMDQyMDg2NzY3fQ.BxnOGLQKPMJSKOhCBhUKKFYGqNnLBqQhzFXJOlmJKAE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyAdminMigration() {
  try {
    console.log('🔄 Applying admin permissions migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase/migrations/20250917000000_create_admin_permissions.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration file loaded, executing SQL...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('❌ Error applying migration:', error);
      
      // Try direct SQL execution as fallback
      console.log('🔄 Trying direct SQL execution...');
      const { data: directData, error: directError } = await supabase
        .from('_migrations')
        .select('*')
        .limit(1);
        
      if (directError) {
        console.log('📝 Executing SQL statements individually...');
        
        // Split SQL into individual statements and execute
        const statements = migrationSQL
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
          if (statement.trim()) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            try {
              const { error: stmtError } = await supabase.rpc('exec_sql', {
                sql: statement + ';'
              });
              if (stmtError) {
                console.warn(`⚠️ Statement warning:`, stmtError.message);
              }
            } catch (e) {
              console.warn(`⚠️ Statement error:`, e.message);
            }
          }
        }
      }
    } else {
      console.log('✅ Migration applied successfully');
    }
    
    // Verify tables were created
    console.log('🔍 Verifying admin tables...');
    
    const { data: rolesData, error: rolesError } = await supabase
      .from('admin_roles')
      .select('count')
      .limit(1);
      
    const { data: permissionsData, error: permissionsError } = await supabase
      .from('admin_user_permissions')
      .select('count')
      .limit(1);
    
    if (!rolesError && !permissionsError) {
      console.log('✅ Admin tables verified successfully');
      
      // Check if we have any roles
      const { data: rolesList, error: rolesListError } = await supabase
        .from('admin_roles')
        .select('name, display_name')
        .limit(10);
        
      if (!rolesListError && rolesList) {
        console.log(`📋 Found ${rolesList.length} admin roles:`);
        rolesList.forEach(role => {
          console.log(`  - ${role.name}: ${role.display_name}`);
        });
      }
    } else {
      console.error('❌ Admin tables verification failed:');
      if (rolesError) console.error('  admin_roles:', rolesError.message);
      if (permissionsError) console.error('  admin_user_permissions:', permissionsError.message);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
applyAdminMigration();
