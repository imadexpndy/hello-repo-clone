// Comprehensive session testing for professional users
import fs from 'fs';

// Read and parse the sessions.ts file
const sessionsFile = fs.readFileSync('./src/data/sessions.ts', 'utf8');

// Extract the SESSIONS array from the file
const sessionsMatch = sessionsFile.match(/export const SESSIONS[^=]*=\s*\[([\s\S]*?)\];/);
if (!sessionsMatch) {
  console.error('Could not find SESSIONS array');
  process.exit(1);
}

// Parse sessions manually (simplified approach)
const sessionsText = sessionsMatch[1];
const sessionLines = sessionsText.split('\n').filter(line => line.trim().startsWith('{ id:'));

const sessions = [];
sessionLines.forEach(line => {
  const idMatch = line.match(/id:\s*'([^']+)'/);
  const dateMatch = line.match(/date:\s*'([^']+)'/);
  const timeMatch = line.match(/time:\s*'([^']+)'/);
  const locationMatch = line.match(/location:\s*'([^']+)'/);
  const audienceMatch = line.match(/audienceType:\s*'([^']+)'/);
  const spectacleMatch = line.match(/spectacleId:\s*'([^']+)'/);
  const capacityMatch = line.match(/capacity:\s*(\d+)/);
  const priceMatch = line.match(/price:\s*(\d+)/);

  if (idMatch && dateMatch && timeMatch && locationMatch && audienceMatch && spectacleMatch) {
    sessions.push({
      id: idMatch[1],
      date: dateMatch[1],
      time: timeMatch[1],
      location: locationMatch[1],
      audienceType: audienceMatch[1],
      spectacleId: spectacleMatch[1],
      capacity: capacityMatch ? parseInt(capacityMatch[1]) : 0,
      price: priceMatch ? parseInt(priceMatch[1]) : null
    });
  }
});

// Filter function similar to getUserTypeSessions for professional users
function getProfessionalSessions(spectacleId, professionalType) {
  return sessions
    .filter(session => session.spectacleId === spectacleId)
    .filter(session => session.audienceType === professionalType)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

const spectacles = [
  'le-petit-prince',
  'tara-sur-la-lune', 
  'leau-la',
  'mirath-atfal',
  'simple-comme-bonjour',
  'charlotte',
  'estevanico',
  'flash',
  'antigone',
  'alice-chez-les-merveilles'
];

const professionalTypes = [
  { type: 'scolaire-privee', name: 'PRIVATE SCHOOLS', expectedPrice: 100 },
  { type: 'scolaire-publique', name: 'PUBLIC SCHOOLS', expectedPrice: null },
  { type: 'association', name: 'ASSOCIATIONS', expectedPrice: null }
];

console.log('=== COMPREHENSIVE PROFESSIONAL USER SESSION TESTING ===\n');

let totalErrors = 0;

professionalTypes.forEach(profType => {
  console.log(`\n🏫 TESTING ${profType.name} (${profType.type})`);
  console.log('='.repeat(80));
  
  spectacles.forEach(spectacleId => {
    console.log(`\n🎭 ${spectacleId.toUpperCase().replace(/-/g, ' ')}`);
    console.log('-'.repeat(60));
    
    const professionalSessions = getProfessionalSessions(spectacleId, profType.type);
    
    console.log(`Sessions for ${profType.name}: ${professionalSessions.length}`);
    
    if (professionalSessions.length === 0) {
      console.log('❌ NO SESSIONS FOUND');
      totalErrors++;
    } else {
      professionalSessions.forEach((session, index) => {
        console.log(`\n${index + 1}. Session ID: ${session.id}`);
        console.log(`   📅 Date: ${session.date}`);
        console.log(`   🕐 Time: ${session.time}`);
        console.log(`   📍 Location: ${session.location}`);
        console.log(`   👥 Audience: ${session.audienceType}`);
        console.log(`   🎫 Capacity: ${session.capacity}`);
        console.log(`   💰 Price: ${session.price ? session.price + ' DH' : 'FREE'}`);
        
        // Verify audience type
        if (session.audienceType !== profType.type) {
          console.log(`   ❌ ERROR: Expected '${profType.type}', got '${session.audienceType}'`);
          totalErrors++;
        } else {
          console.log(`   ✅ Correct audience type`);
        }
        
        // Verify pricing
        if (session.price !== profType.expectedPrice) {
          console.log(`   ❌ ERROR: Expected price ${profType.expectedPrice}, got ${session.price}`);
          totalErrors++;
        } else {
          console.log(`   ✅ Correct pricing`);
        }
      });
    }
    
    // Expected session counts vary by spectacle and professional type
    let expectedCount;
    if (profType.type === 'scolaire-privee') {
      expectedCount = 4; // Usually 4 private school sessions per spectacle
    } else if (profType.type === 'scolaire-publique') {
      expectedCount = 2; // Usually 2 public school sessions per spectacle
    } else if (profType.type === 'association') {
      expectedCount = 2; // Usually 2 association sessions per spectacle
    }
    
    if (professionalSessions.length !== expectedCount) {
      console.log(`\n❌ ERROR: Expected ${expectedCount} sessions, found ${professionalSessions.length}`);
      totalErrors++;
    } else {
      console.log(`\n✅ Correct session count (${expectedCount})`);
    }
  });
});

console.log('\n' + '='.repeat(80));
console.log('=== TESTING COMPLETE ===');
if (totalErrors === 0) {
  console.log('🎉 ALL PROFESSIONAL USER TESTS PASSED - NO ERRORS FOUND');
} else {
  console.log(`❌ FOUND ${totalErrors} ERRORS`);
}
console.log('='.repeat(80));
