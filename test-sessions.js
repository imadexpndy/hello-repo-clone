// Comprehensive session testing for particulier users
import { getUserTypeSessions } from './src/data/sessions.ts';

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

spectacles.forEach(spectacleId => {
  console.log(`\n🎭 ${spectacleId.toUpperCase()}`);
  console.log('=' .repeat(50));
  
  // Test as particulier user
  const particulierSessions = getUserTypeSessions(spectacleId, 'particulier');
  
  console.log(`Sessions for particulier users: ${particulierSessions.length}`);
  
  if (particulierSessions.length === 0) {
    console.log('❌ NO SESSIONS FOUND FOR PARTICULIER USERS');
  } else {
    particulierSessions.forEach((session, index) => {
      console.log(`${index + 1}. ${session.id}`);
      console.log(`   Date: ${session.date}`);
      console.log(`   Time: ${session.time}`);
      console.log(`   Location: ${session.location}`);
      console.log(`   Audience: ${session.audienceType}`);
      console.log(`   Capacity: ${session.capacity}`);
      
      // Verify it's truly a public session
      if (session.audienceType !== 'tout-public') {
        console.log(`   ❌ ERROR: Expected 'tout-public', got '${session.audienceType}'`);
      } else {
        console.log(`   ✅ Correct audience type`);
      }
    });
  }
  
  // Verify expected count (should be exactly 2 for each spectacle)
  if (particulierSessions.length !== 2) {
    console.log(`❌ ERROR: Expected 2 sessions, found ${particulierSessions.length}`);
  } else {
    console.log(`✅ Correct session count (2)`);
  }
});

console.log('\n=== TESTING COMPLETE ===');
