#!/usr/bin/env node

/**
 * Generate PDF from the one-pager-2 page
 * Run with: node scripts/generate-one-pager-pdf.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_PATH = 'D:\\2026 job search\\TRAIGENT-AI\\One-pager\\traigent-one-pager.pdf';

async function generatePDF() {
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    // Set viewport to match A4 landscape
    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 2,
    });

    // Navigate to the one-pager-2 page
    // For local dev: http://localhost:5173/#/one-pager-2
    // For production: https://www.traigent.ai/#/one-pager-2
    const url = 'http://localhost:5173/#/one-pager-2';
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for the one-pager content to render
    await page.waitForSelector('section', { timeout: 10000 });
    
    // Give animations time to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Created directory: ${outputDir}`);
    }

    // Generate PDF with A4 landscape dimensions
    await page.pdf({
      path: OUTPUT_PATH,
      format: 'A4',
      landscape: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      printBackground: true,
    });

    console.log(`✓ PDF generated successfully: ${OUTPUT_PATH}`);
    await browser.close();
    process.exit(0);
    
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
}

generatePDF();
