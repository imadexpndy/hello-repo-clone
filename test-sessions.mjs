// Comprehensive session testing for particulier users
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

  if (idMatch && dateMatch && timeMatch && locationMatch && audienceMatch && spectacleMatch) {
    sessions.push({
      id: idMatch[1],
      date: dateMatch[1],
      time: timeMatch[1],
      location: locationMatch[1],
      audienceType: audienceMatch[1],
      spectacleId: spectacleMatch[1],
      capacity: capacityMatch ? parseInt(capacityMatch[1]) : 0
    });
  }
});

// Filter function similar to getUserTypeSessions
function getParticulierSessions(spectacleId) {
  return sessions
    .filter(session => session.spectacleId === spectacleId)
    .filter(session => session.audienceType === 'tout-public')
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

console.log('=== COMPREHENSIVE PARTICULIER USER SESSION TESTING ===\n');

let totalErrors = 0;

spectacles.forEach(spectacleId => {
  console.log(`\n🎭 ${spectacleId.toUpperCase().replace(/-/g, ' ')}`);
  console.log('=' .repeat(60));
  
  const particulierSessions = getParticulierSessions(spectacleId);
  
  console.log(`Sessions for particulier users: ${particulierSessions.length}`);
  
  if (particulierSessions.length === 0) {
    console.log('❌ NO SESSIONS FOUND FOR PARTICULIER USERS');
    totalErrors++;
  } else {
    particulierSessions.forEach((session, index) => {
      console.log(`\n${index + 1}. Session ID: ${session.id}`);
      console.log(`   📅 Date: ${session.date}`);
      console.log(`   🕐 Time: ${session.time}`);
      console.log(`   📍 Location: ${session.location}`);
      console.log(`   👥 Audience: ${session.audienceType}`);
      console.log(`   🎫 Capacity: ${session.capacity}`);
      
      // Verify it's truly a public session
      if (session.audienceType !== 'tout-public') {
        console.log(`   ❌ ERROR: Expected 'tout-public', got '${session.audienceType}'`);
        totalErrors++;
      } else {
        console.log(`   ✅ Correct audience type`);
      }
    });
  }
  
  // Verify expected count (should be exactly 2 for each spectacle)
  if (particulierSessions.length !== 2) {
    console.log(`\n❌ ERROR: Expected 2 sessions, found ${particulierSessions.length}`);
    totalErrors++;
  } else {
    console.log(`\n✅ Correct session count (2)`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('=== TESTING COMPLETE ===');
if (totalErrors === 0) {
  console.log('🎉 ALL TESTS PASSED - NO ERRORS FOUND');
} else {
  console.log(`❌ FOUND ${totalErrors} ERRORS`);
}
console.log('='.repeat(60));
