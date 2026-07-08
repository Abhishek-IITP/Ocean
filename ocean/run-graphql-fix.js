const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database security hardening...");
  try {
    // 1. Enable RLS on all tables dynamically
    console.log("Enabling RLS on all tables in public schema...");
    await prisma.$executeRawUnsafe(`
      DO $$
      DECLARE
          tbl record;
      BEGIN
          FOR tbl IN 
              SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public'
          LOOP
              EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl.tablename);
          END LOOP;
      END $$;
    `);
    console.log("RLS enabled on all tables successfully.");

    // 2. Revoke SELECT permissions on ALL tables from 'anon' and 'authenticated' roles
    console.log("Revoking SELECT privileges from client roles...");
    await prisma.$executeRawUnsafe(`REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon, authenticated;`);
    await prisma.$executeRawUnsafe(`ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT ON TABLES FROM anon, authenticated;`);
    console.log("Privileges revoked successfully.");

    // 3. Create default 'Deny all' RLS policies for all tables to satisfy linter
    console.log("Creating default 'Deny all' RLS policies to satisfy Supabase linter...");
    await prisma.$executeRawUnsafe(`
      DO $$
      DECLARE
          tbl record;
      BEGIN
          FOR tbl IN 
              SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public'
          LOOP
              EXECUTE format('DROP POLICY IF EXISTS "Deny all" ON %I;', tbl.tablename);
              EXECUTE format('CREATE POLICY "Deny all" ON %I FOR ALL USING (false);', tbl.tablename);
          END LOOP;
      END $$;
    `);
    console.log("Default RLS policies created successfully.");

    console.log("Database security hardening completed successfully!");
  } catch (error) {
    console.error("Hardening failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
