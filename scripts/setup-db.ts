import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { neon } from '@neondatabase/serverless';

// Load .env.local first, then fallback to .env
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

async function main() {
  const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  
  if (!connectionString || connectionString.includes('dummy') || connectionString.includes('example')) {
    console.log('\n⚠️  প্রকৃত Neon DB লিঙ্ক পাওয়া যায়নি (No valid DATABASE_URL in .env.local).');
    console.log('\n📌 Neon DB কানেক্ট করার ৩টি সহজ ধাপ:');
    console.log('১. https://console.neon.tech এ গিয়ে একটি ফ্রি প্রজেক্ট তৈরি করুন।');
    console.log('২. আপনার প্রজেক্টের "Connection String" কপি করুন।');
    console.log('৩. আপনার প্রোজেক্টের .env.local ফাইলে পেস্ট করুন:');
    console.log('   DATABASE_URL="postgresql://neondb_owner:YOUR_ACTUAL_PASSWORD@ep-xxx.neon.tech/neondb?sslmode=require"');
    console.log('\n৪. এরপর টার্মিনালে কমান্ডটি রান করুন:');
    console.log('   npm run db:setup\n');
    return;
  }

  console.log('🔌 Neon DB তে কানেক্ট করা হচ্ছে...');
  const sql = neon(connectionString);

  try {
    const sqlFile = path.join(process.cwd(), 'lib/db/migrate.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    console.log('📜 SQL টেবিল মাইগ্রেশন চালানো হচ্ছে...');
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await sql.query(statement);
    }

    console.log('🎉 অভিনন্দন! আপনার Neon DB তে সকল টেবিল সফলভাবে তৈরি করা হয়েছে।');
  } catch (err) {
    console.error('❌ মাইগ্রেশন বার্তা:', err);
  }
}

main();
