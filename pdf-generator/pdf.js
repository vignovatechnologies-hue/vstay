const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_PDF = path.join(__dirname, '..', 'Hostly-Dashboard-Preview.pdf');
const ASSETS_DIR = path.join(__dirname, '..', 'hostly-preview-assets');

function getBase64Image(filename) {
  const filePath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filePath)) return '';
  const file = fs.readFileSync(filePath);
  return `data:image/png;base64,${file.toString('base64')}`;
}

async function createPdf() {
  console.log('Generating PDF...');

  const ownerImg = getBase64Image('owner-dashboard.png');
  const superAdminImg = getBase64Image('super-admin-dashboard.png');
  const tenantImg = getBase64Image('tenant-dashboard.png');
  const staffImg = getBase64Image('staff-dashboard.png');
  const pricingImg = getBase64Image('pricing.png');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background-color: #020617;
          color: #F8FAFC;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .page {
          width: 1440px;
          height: 1080px;
          page-break-after: always;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          background-color: #020617;
        }

        .cover-page {
          justify-content: center;
          align-items: center;
          background-color: #030712;
          background-image: radial-gradient(circle at center, #111C2E 0%, #030712 100%);
        }

        .cover-title {
          font-size: 84px;
          font-weight: 700;
          color: #F8FAFC;
          margin: 0 0 24px 0;
          letter-spacing: -2px;
        }

        .cover-subtitle {
          font-size: 32px;
          font-weight: 500;
          color: #3B82F6;
          margin: 0 0 48px 0;
        }

        .cover-small {
          font-size: 18px;
          font-weight: 500;
          color: #8B9AAF;
          text-transform: uppercase;
          letter-spacing: 4px;
        }

        .content-page {
          padding: 60px 80px;
        }

        .header {
          margin-bottom: 48px;
        }

        .header h1 {
          font-size: 48px;
          font-weight: 600;
          color: #F8FAFC;
          margin: 0 0 12px 0;
          letter-spacing: -1px;
        }

        .header h2 {
          font-size: 24px;
          font-weight: 400;
          color: #CBD5E1;
          margin: 0;
        }

        .image-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          border-radius: 16px;
          overflow: hidden;
          background-color: #111C2E;
          border: 1px solid #263650;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .dashboard-img {
          width: 100%;
          object-fit: cover;
          object-position: top;
        }
      </style>
    </head>
    <body>
      <!-- Page 1: Cover -->
      <div class="page cover-page">
        <div class="cover-small">Dashboard Preview</div>
        <h1 class="cover-title">Hostly</h1>
        <h2 class="cover-subtitle">PG, Hostel & Property Management Platform</h2>
      </div>

      <!-- Page 2: Owner Dashboard -->
      <div class="page content-page">
        <div class="header">
          <h1>Owner Dashboard</h1>
          <h2>Property operations, occupancy, tenants, payments and daily management</h2>
        </div>
        <div class="image-container">
          <img class="dashboard-img" src="${ownerImg}" alt="Owner Dashboard" />
        </div>
      </div>

      <!-- Page 3: Super Admin Dashboard -->
      <div class="page content-page">
        <div class="header">
          <h1>Super Admin Dashboard</h1>
          <h2>Platform organizations, subscriptions, growth and system operations</h2>
        </div>
        <div class="image-container">
          <img class="dashboard-img" src="${superAdminImg}" alt="Super Admin Dashboard" />
        </div>
      </div>

      <!-- Page 4: Tenant Dashboard -->
      <div class="page content-page">
        <div class="header">
          <h1>Tenant Dashboard</h1>
          <h2>Tenant app interface</h2>
        </div>
        <div class="image-container">
          <img class="dashboard-img" src="${tenantImg}" alt="Tenant Dashboard" />
        </div>
      </div>

      <!-- Page 5: Staff Dashboard -->
      <div class="page content-page">
        <div class="header">
          <h1>Staff Dashboard</h1>
          <h2>Staff operations interface</h2>
        </div>
        <div class="image-container">
          <img class="dashboard-img" src="${staffImg}" alt="Staff Dashboard" />
        </div>
      </div>

      <!-- Page 6: Pricing -->
      <div class="page content-page">
        <div class="header">
          <h1>Simple, Transparent Pricing</h1>
          <h2>Hostly platform subscription options</h2>
        </div>
        <div class="image-container">
          <img class="dashboard-img" src="${pricingImg}" alt="Pricing Page" />
        </div>
      </div>

      <!-- Final Page -->
      <div class="page cover-page">
        <h1 class="cover-title">Hostly</h1>
        <h2 class="cover-subtitle">Smart Property Operations in One Platform</h2>
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({ channel: 'chrome', headless: 'new' });
  const page = await browser.newPage();
  
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: OUTPUT_PDF,
    width: 1440,
    height: 1080,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  console.log('PDF generated successfully at', OUTPUT_PDF);
}

createPdf().catch(console.error);
