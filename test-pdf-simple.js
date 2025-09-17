// Simple test to verify jsPDF functionality and devis generation
import { jsPDF } from 'jspdf';
import fs from 'fs';

console.log('Starting PDF generation tests...');

// Test function to verify jsPDF is working
const testPDFGeneration = () => {
  try {
    console.log('Testing basic PDF generation...');
    const doc = new jsPDF();
    doc.text('Test PDF', 20, 20);
    const output = doc.output('arraybuffer');
    console.log('Basic PDF test successful, size:', output.byteLength);
    return new Uint8Array(output);
  } catch (error) {
    console.error('Basic PDF test failed:', error);
    throw error;
  }
};

// Simplified devis generation function
const generateSimpleDevis = (data) => {
  try {
    console.log('Generating simple devis...');
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('DEVIS', 20, 30);
    
    // Basic info
    doc.setFontSize(12);
    doc.text(`École: ${data.schoolName}`, 20, 50);
    doc.text(`Contact: ${data.contactName}`, 20, 60);
    doc.text(`Spectacle: ${data.spectacleName}`, 20, 70);
    doc.text(`Date: ${data.spectacleDate}`, 20, 80);
    doc.text(`Élèves: ${data.studentsCount}`, 20, 90);
    doc.text(`Total: ${data.totalAmount} DH`, 20, 100);
    
    const output = doc.output('arraybuffer');
    console.log('Simple devis generated, size:', output.byteLength);
    return new Uint8Array(output);
  } catch (error) {
    console.error('Simple devis generation failed:', error);
    throw error;
  }
};

// Test 1: Basic jsPDF functionality
try {
  console.log('\n=== Test 1: Basic PDF Generation ===');
  const basicPdf = testPDFGeneration();
  fs.writeFileSync('test-basic.pdf', basicPdf);
  console.log('✅ Basic PDF generation successful');
} catch (error) {
  console.error('❌ Basic PDF generation failed:', error.message);
  process.exit(1);
}

// Test 2: Simple devis generation
try {
  console.log('\n=== Test 2: Simple Devis Generation ===');
  const testData = {
    schoolName: "École Test",
    contactName: "Jean Dupont",
    spectacleName: "Le Petit Prince",
    spectacleDate: "2025-01-15",
    studentsCount: 25,
    totalAmount: 2500
  };
  
  const devisPdf = generateSimpleDevis(testData);
  fs.writeFileSync('test-simple-devis.pdf', devisPdf);
  console.log('✅ Simple devis generation successful');
} catch (error) {
  console.error('❌ Simple devis generation failed:', error.message);
}

console.log('\nPDF tests completed.');
