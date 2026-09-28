/**
 * CropPilotAI: Supabase Cloud Database Migration Runner
 * Applies /supabase/migrations/001_initial_schema.sql to Supabase PostgreSQL.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server environment
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Client } = pg;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

const migrationFilePath = path.resolve(__dirname, '../../supabase/migrations/001_initial_schema.sql');

async function runMigration() {
  console.log('\n=============================================================');
  console.log('🌱 CropPilotAI: Supabase Database Migration Runner');
  console.log('=============================================================\n');

  if (!fs.existsSync(migrationFilePath)) {
    console.error(`❌ Migration file not found at: ${migrationFilePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationFilePath, 'utf8');
  console.log(`📄 Loaded migration script: ${path.basename(migrationFilePath)} (${sql.length} bytes)`);

  // Scenario A: Direct DATABASE_URL connection string provided
  if (DATABASE_URL && !DATABASE_URL.includes('your-password')) {
    console.log('🔗 Connecting to PostgreSQL using direct connection string (DATABASE_URL)...');
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(' Connected to Supabase PostgreSQL!');
      console.log('⚡ Applying SQL migration scripts...');
      await client.query(sql);
      console.log(' Migration applied successfully!');
      await client.end();
      return;
    } catch (err) {
      console.error('❌ Direct PostgreSQL migration error:', err.message);
      await client.end();
    }
  }

  // Scenario B: Supabase URL and Service Role Key provided
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_URL.includes('your-supabase')) {
    console.log(`🔗 Verifying Supabase API connection to: ${SUPABASE_URL}`);
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      // Test querying a core table
      const { data, error } = await supabase.from('farms').select('count', { count: 'exact', head: true });
      if (!error) {
        console.log(' Schema tables already exist and are reachable via Supabase client.');
        console.log(' Database is active and ready.');
        return;
      } else {
        console.log(`ℹ️ Supabase responded: ${error.message}`);
        console.log('💡 To apply fresh schema to Supabase Cloud directly:');
        console.log('   1. Open Supabase Dashboard: https://supabase.com/dashboard/project/_/sql');
        console.log('   2. Paste the contents of supabase/migrations/001_initial_schema.sql');
        console.log('   3. Click "RUN" to initialize tables, RLS policies, and triggers.');
      }
    } catch (err) {
      console.error('⚠️ Supabase connection test error:', err.message);
    }
  } else {
    console.log('ℹ️ No live SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY configured in server/.env.');
    console.log('💡 Step-by-Step Instructions to run migrations manually in Supabase Console:');
    console.log('   1. Navigate to https://supabase.com/dashboard');
    console.log('   2. Select your project -> Click "SQL Editor" on the left navigation.');
    console.log('   3. Click "New Query", paste the SQL from supabase/migrations/001_initial_schema.sql');
    console.log('   4. Click "Run". All 4 tables, RLS policies, and indexes will be created.');
    console.log('\n Mock/In-memory fallback is active in the backend so you can test features right away!');
  }
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
