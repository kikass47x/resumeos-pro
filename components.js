// Component loader for navbar and footer
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${componentPath}`);
        }
        
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Initialize any component-specific scripts
        initializeComponent(elementId);
        
    } catch (error) {
        console.error('Component load error:', error);
        // Fallback content
        if (elementId === 'navbar') {
            document.getElementById('navbar').innerHTML = createFallbackNavbar();
        } else if (elementId === 'footer') {
            document.getElementById('footer').innerHTML = createFallbackFooter();
        }
    }
}

function initializeComponent(elementId) {
    if (elementId === 'navbar') {
        setupNavbar();
    }
}

function setupNavbar() {
    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage.includes('easy-fix') && href.includes('easy-fix')) ||
            (currentPage.includes('finish-up') && href.includes('finish-up'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Setup mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Setup theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Check saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }
}

function createFallbackNavbar() {
    return `
        <nav class="navbar">
            <div class="nav-container">
                <a href="index.html" class="logo">
                    <span class="logo-icon">🚀</span>
                    <span>ResumeOS Pro</span>
                </a>
                
                <div class="nav-links">
                    <a href="index.html" class="nav-link">
                        <i class="fas fa-home"></i> Home
                    </a>
                    <a href="easy-fix.html" class="nav-link">
                        <i class="fas fa-magic"></i> Easy Fix
                    </a>
                    <a href="finish-up.html" class="nav-link">
                        <i class="fas fa-rocket"></i> Finish Up
                    </a>
                    <a href="#" class="btn btn-primary">
                        <i class="fas fa-user"></i> Sign In
                    </a>
                </div>
            </div>
        </nav>
    `;
}

function createFallbackFooter() {
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>ResumeOS Pro</h3>
                        <p>AI-powered career platform for the modern job seeker.</p>
                    </div>
                    <div class="footer-section">
                        <h4>Features</h4>
                        <a href="easy-fix.html">Easy Fix</a>
                        <a href="finish-up.html">Finish Up</a>
                    </div>
                    <div class="footer-section">
                        <h4>Connect</h4>
                        <div class="social-links">
                            <a href="#"><i class="fab fa-twitter"></i></a>
                            <a href="#"><i class="fab fa-github"></i></a>
                            <a href="#"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 ResumeOS Pro. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
}

// Export for module usage
if (typeof module !== 'undefined') {
    module.exports = { loadComponent };
}