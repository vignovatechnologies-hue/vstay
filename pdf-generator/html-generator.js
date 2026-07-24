const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'vstay-preview-assets');
const OUTPUT_HTML = path.join(__dirname, '..', 'Vstay-Dashboard-Preview.html');

function getBase64Image(filename) {
  const filePath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filePath)) return '';
  const file = fs.readFileSync(filePath);
  return `data:image/png;base64,${file.toString('base64')}`;
}

function generateHtml() {
  console.log('Reading screenshots...');
  const ownerImg = getBase64Image('owner-dashboard.png');
  const superAdminImg = getBase64Image('super-admin-dashboard.png');
  const tenantImg = getBase64Image('tenant-dashboard.png');
  const staffImg = getBase64Image('staff-dashboard.png');
  const pricingImg = getBase64Image('pricing.png');

  console.log('Constructing HTML...');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vstay - Dashboard Preview</title>
  <style>
    /* System Font Stack & Reset */
    :root {
      --bg-page: #020617;
      --bg-deep: #030712;
      --bg-section: #050B18;
      --bg-card: #111C2E;
      --bg-secondary: #0D1728;
      --border: #263650;
      --text-primary: #F8FAFC;
      --text-secondary: #CBD5E1;
      --text-muted: #8B9AAF;
      --primary: #2563EB;
      --bright: #3B82F6;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: var(--bg-page);
      color: var(--text-primary);
      line-height: 1.5;
      overflow-x: hidden;
    }

    /* Typography */
    h1, h2, h3 { font-weight: 600; line-height: 1.2; }
    h1 { font-size: 3rem; margin-bottom: 0.5rem; letter-spacing: -1px; }
    h2 { font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-secondary); font-weight: 500; }
    p { color: var(--text-muted); font-size: 1.1rem; }

    /* Layout & Sections */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    section {
      padding: 6rem 0;
      border-bottom: 1px solid var(--border);
    }
    section:nth-child(even) {
      background-color: var(--bg-section);
    }

    /* Hero */
    .hero {
      text-align: center;
      padding: 8rem 0;
      background: radial-gradient(circle at top, var(--bg-card) 0%, var(--bg-deep) 100%);
      border-bottom: 1px solid var(--border);
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 1rem;
      background-color: rgba(59, 130, 246, 0.1);
      color: var(--bright);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .hero h1 { font-size: 4rem; color: var(--text-primary); }
    .hero h2 { color: var(--bright); font-size: 1.75rem; margin-bottom: 1.5rem; }
    .hero p { max-width: 600px; margin: 0 auto; color: var(--text-secondary); }

    /* Sticky Navigation */
    .nav-wrapper {
      position: sticky;
      top: 0;
      z-index: 40;
      background-color: rgba(2, 6, 23, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .nav {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      overflow-x: auto;
    }
    .nav a {
      color: var(--text-secondary);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .nav a:hover {
      background-color: var(--bg-card);
      color: var(--text-primary);
    }
    .nav a.active {
      background-color: var(--primary);
      color: white;
    }

    /* Section Content */
    .section-header {
      margin-bottom: 3rem;
      text-align: center;
    }
    .section-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .section-header h2 { font-size: 1.25rem; color: var(--text-muted); margin-bottom: 0; }

    /* Premium Image Wrapper */
    .image-wrapper {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.30);
      cursor: zoom-in;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .image-wrapper:hover {
      transform: translateY(-4px);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.40);
      border-color: rgba(59, 130, 246, 0.5);
    }
    .image-wrapper img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
      border: 1px solid var(--border);
    }

    /* Final Section */
    .final {
      text-align: center;
      padding: 6rem 0;
      background-color: var(--bg-deep);
      border: none;
    }

    /* Lightbox Modal */
    .lightbox {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(3, 7, 18, 0.95);
      z-index: 100;
      padding: 2rem;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .lightbox.active {
      display: flex;
    }
    .lightbox img {
      max-width: 90%;
      max-height: 90vh;
      border-radius: 12px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      border: 1px solid var(--border);
      object-fit: contain;
    }
    .close-btn {
      position: absolute;
      top: 1.5rem;
      right: 2rem;
      color: var(--text-muted);
      font-size: 2rem;
      cursor: pointer;
      background: none;
      border: none;
      transition: color 0.2s;
    }
    .close-btn:hover {
      color: white;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero { padding: 4rem 1rem; }
      .hero h1 { font-size: 2.5rem; }
      .hero h2 { font-size: 1.25rem; }
      .nav { justify-content: flex-start; padding: 1rem; }
      .container { padding: 0 1rem; }
      section { padding: 3rem 0; }
      .section-header h1 { font-size: 2rem; }
      .image-wrapper { padding: 0.5rem; border-radius: 12px; }
      .lightbox { padding: 1rem; }
      .lightbox img { max-width: 100%; }
    }
  </style>
</head>
<body>

  <!-- Hero Section -->
  <header class="hero">
    <div class="container">
      <span class="badge">Product Preview</span>
      <h1>Vstay</h1>
      <h2>PG, Hostel & Property Management Platform</h2>
      <p>A unified platform for property operations, tenants, staff, payments, subscriptions and administration.</p>
    </div>
  </header>

  <!-- Sticky Navigation -->
  <div class="nav-wrapper">
    <nav class="nav">
      <a href="#owner" class="nav-link active">Owner Dashboard</a>
      <a href="#super-admin" class="nav-link">Super Admin</a>
      <a href="#tenant" class="nav-link">Tenant</a>
      <a href="#staff" class="nav-link">Staff</a>
      <a href="#pricing" class="nav-link">Pricing</a>
    </nav>
  </div>

  <!-- Owner Dashboard -->
  <section id="owner">
    <div class="container">
      <div class="section-header">
        <h1>Owner Dashboard</h1>
        <h2>Property operations, occupancy, tenants, payments and daily management.</h2>
      </div>
      <div class="image-wrapper" onclick="openLightbox(this)">
        <img src="${ownerImg}" alt="Owner Dashboard" loading="lazy">
      </div>
    </div>
  </section>

  <!-- Super Admin -->
  <section id="super-admin">
    <div class="container">
      <div class="section-header">
        <h1>Super Admin Dashboard</h1>
        <h2>Platform organizations, subscriptions, growth and system operations.</h2>
      </div>
      <div class="image-wrapper" onclick="openLightbox(this)">
        <img src="${superAdminImg}" alt="Super Admin Dashboard" loading="lazy">
      </div>
    </div>
  </section>

  <!-- Tenant -->
  <section id="tenant">
    <div class="container">
      <div class="section-header">
        <h1>Tenant Dashboard</h1>
        <h2>Dedicated tenant interface.</h2>
      </div>
      <div class="image-wrapper" onclick="openLightbox(this)">
        <img src="${tenantImg}" alt="Tenant Dashboard" loading="lazy">
      </div>
    </div>
  </section>

  <!-- Staff -->
  <section id="staff">
    <div class="container">
      <div class="section-header">
        <h1>Staff Dashboard</h1>
        <h2>Operational interfaces for managers and staff.</h2>
      </div>
      <div class="image-wrapper" onclick="openLightbox(this)">
        <img src="${staffImg}" alt="Staff Dashboard" loading="lazy">
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section id="pricing">
    <div class="container">
      <div class="section-header">
        <h1>Pricing</h1>
        <h2>Platform subscription options.</h2>
      </div>
      <div class="image-wrapper" onclick="openLightbox(this)">
        <img src="${pricingImg}" alt="Pricing Page" loading="lazy">
      </div>
    </div>
  </section>

  <!-- Final Footer -->
  <section class="final">
    <div class="container">
      <h1>Vstay</h1>
      <p>Smart Property Operations in One Platform</p>
    </div>
  </section>

  <!-- Lightbox Modal -->
  <div class="lightbox" id="lightbox" onclick="closeLightbox(event)">
    <button class="close-btn" onclick="closeLightbox(event)">&times;</button>
    <img id="lightbox-img" src="" alt="Expanded Preview">
  </div>

  <!-- JavaScript -->
  <script>
    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    window.openLightbox = function(wrapper) {
      const img = wrapper.querySelector('img');
      if(img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };

    window.closeLightbox = function(e) {
      if (e) {
        // Only close if clicking background or close button (not the image itself)
        if (e.target.tagName === 'IMG' && e.target.id === 'lightbox-img') return;
      }
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 200);
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Smooth Scroll & Active Nav Tracking
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          const navHeight = document.querySelector('.nav-wrapper').offsetHeight;
          const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const navHeight = document.querySelector('.nav-wrapper').offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 100;
        if (pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
          link.classList.add('active');
        }
      });
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
  console.log('Successfully generated HTML preview at:', OUTPUT_HTML);
}

generateHtml();
