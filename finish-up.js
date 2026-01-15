// Finish Up Job Search Logic
const MOCK_JOBS = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechVision Inc.",
        location: "Remote • Worldwide",
        remote: true,
        verified: true,
        salary: "$130,000 - $160,000",
        description: "We're looking for a Senior Frontend Developer with 5+ years of experience in React.js, TypeScript, and modern web technologies. You'll be building scalable web applications and leading frontend architecture decisions.",
        tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Jest", "Remote"],
        posted: "2 days ago",
        trustScore: 94,
        source: "LinkedIn",
        applicationUrl: "https://techvision.com/careers/frontend"
    },
    {
        id: 2,
        title: "Full Stack Engineer",
        company: "InnovateTech Solutions",
        location: "San Francisco, CA",
        remote: false,
        verified: true,
        salary: "$140,000 - $180,000",
        description: "Join our growing engineering team to build cutting-edge SaaS products. We value clean code, testing, and continuous improvement.",
        tags: ["Node.js", "Python", "AWS", "Docker", "React", "PostgreSQL"],
        posted: "1 day ago",
        trustScore: 92,
        source: "Company Website",
        applicationUrl: "https://innovatech.com/jobs/full-stack"
    },
    {
        id: 3,
        title: "DevOps Engineer",
        company: "CloudSystems",
        location: "Remote • USA",
        remote: true,
        verified: true,
        salary: "$120,000 - $150,000",
        description: "Manage our cloud infrastructure and CI/CD pipelines. Experience with Kubernetes, Terraform, and monitoring tools required.",
        tags: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD", "Python", "Remote"],
        posted: "3 days ago",
        trustScore: 91,
        source: "Glassdoor",
        applicationUrl: "https://cloudsystems.com/careers/devops"
    },
    {
        id: 4,
        title: "Product Manager",
        company: "StartUpXYZ",
        location: "New York, NY",
        remote: true,
        verified: false,
        salary: "$110,000 - $140,000",
        description: "Fast-growing startup looking for an experienced Product Manager to lead product strategy and development.",
        tags: ["Product Management", "Agile", "User Research", "Roadmapping", "Remote"],
        posted: "5 days ago",
        trustScore: 65,
        source: "Indeed",
        applicationUrl: "https://startupxyz.com/jobs/pm"
    },
    {
        id: 5,
        title: "Data Scientist",
        company: "DataInsights Corp",
        location: "Boston, MA",
        remote: true,
        verified: true,
        salary: "$135,000 - $170,000",
        description: "Apply machine learning techniques to solve complex business problems. PhD or MS in relevant field preferred.",
        tags: ["Python", "Machine Learning", "SQL", "TensorFlow", "PyTorch", "Statistics", "Remote"],
        posted: "1 week ago",
        trustScore: 93,
        source: "LinkedIn",
        applicationUrl: "https://datainsights.com/careers/data-scientist"
    },
    {
        id: 6,
        title: "UX/UI Designer",
        company: "DesignFirst",
        location: "Remote • Global",
        remote: true,
        verified: true,
        salary: "$95,000 - $130,000",
        description: "Create beautiful and functional user interfaces for our digital products. Strong portfolio required.",
        tags: ["Figma", "UI/UX", "Prototyping", "User Research", "Web Design", "Mobile", "Remote"],
        posted: "4 days ago",
        trustScore: 89,
        source: "Company Website",
        applicationUrl: "https://designfirst.com/careers/designer"
    },
    {
        id: 7,
        title: "Backend Engineer",
        company: "API Masters",
        location: "Austin, TX",
        remote: false,
        verified: true,
        salary: "$125,000 - $155,000",
        description: "Build scalable backend services and APIs. Experience with microservices architecture and cloud platforms.",
        tags: ["Java", "Spring Boot", "PostgreSQL", "Redis", "AWS", "Docker"],
        posted: "2 days ago",
        trustScore: 90,
        source: "LinkedIn",
        applicationUrl: "https://apimasters.com/jobs/backend"
    },
    {
        id: 8,
        title: "Marketing Director",
        company: "GrowthHackers",
        location: "Remote • USA",
        remote: true,
        verified: false,
        salary: "$90,000 - $120,000",
        description: "Lead our marketing efforts and drive customer acquisition. Experience with digital marketing required.",
        tags: ["Marketing", "SEO", "Content Strategy", "Social Media", "Analytics", "Remote"],
        posted: "1 week ago",
        trustScore: 60,
        source: "Indeed",
        applicationUrl: "https://growthhackers.com/jobs/marketing"
    },
    {
        id: 9,
        title: "Cybersecurity Analyst",
        company: "SecureNet",
        location: "Washington, DC",
        remote: true,
        verified: true,
        salary: "$115,000 - $145,000",
        description: "Protect our systems and data from security threats. Security certifications preferred.",
        tags: ["Security", "SIEM", "Incident Response", "Compliance", "Networking", "Remote"],
        posted: "3 days ago",
        trustScore: 95,
        source: "Company Website",
        applicationUrl: "https://securenet.com/careers/security"
    },
    {
        id: 10,
        title: "Mobile Developer",
        company: "AppCreators",
        location: "Remote • Worldwide",
        remote: true,
        verified: true,
        salary: "$110,000 - $140,000",
        description: "Develop mobile applications for iOS and Android using React Native. Published apps in store required.",
        tags: ["React Native", "iOS", "Android", "JavaScript", "TypeScript", "Mobile", "Remote"],
        posted: "1 day ago",
        trustScore: 88,
        source: "Glassdoor",
        applicationUrl: "https://appcreators.com/jobs/mobile"
    }
];

let currentJob = null;

function loadJobs() {
    const jobsContainer = document.getElementById('jobsContainer');
    const loadingElement = document.querySelector('.loading-jobs');
    
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    displayJobs(MOCK_JOBS);
    updateJobStats();
}

function searchJobs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const locationTerm = document.getElementById('locationInput').value.toLowerCase();
    const remoteOnly = document.getElementById('remoteOnly').checked;
    const verifiedOnly = document.getElementById('verifiedOnly').checked;
    const jobType = document.getElementById('jobType').value;
    const experienceLevel = document.getElementById('experienceLevel').value;
    const sortBy = document.getElementById('sortBy').value;
    
    let filteredJobs = MOCK_JOBS.filter(job => {
        // Text search
        const matchesSearch = !searchTerm || 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            job.description.toLowerCase().includes(searchTerm);
        
        // Location filter
        const matchesLocation = !locationTerm || 
            job.location.toLowerCase().includes(locationTerm);
        
        // Remote filter
        const matchesRemote = !remoteOnly || job.remote;
        
        // Verified filter
        const matchesVerified = !verifiedOnly || job.verified;
        
        // Job type filter
        const matchesJobType = !jobType || 
            (jobType === 'remote' && job.remote) ||
            (jobType === 'fulltime' && job.title.toLowerCase().includes('senior') || job.title.toLowerCase().includes('full')) ||
            (jobType === 'parttime' && job.title.toLowerCase().includes('junior')) ||
            (jobType === 'contract' && job.title.toLowerCase().includes('contract'));
        
        // Experience level filter
        const matchesExperience = !experienceLevel || 
            (experienceLevel === 'entry' && (job.title.toLowerCase().includes('junior') || job.title.toLowerCase().includes('entry'))) ||
            (experienceLevel === 'mid' && !job.title.toLowerCase().includes('senior') && !job.title.toLowerCase().includes('junior')) ||
            (experienceLevel === 'senior' && job.title.toLowerCase().includes('senior'));
        
        return matchesSearch && matchesLocation && matchesRemote && matchesVerified && matchesJobType && matchesExperience;
    });
    
    // Sort jobs
    filteredJobs.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                // Simple date sorting based on posted text
                return getDaysAgo(a.posted) - getDaysAgo(b.posted);
            case 'salary':
                // Extract numeric salary for comparison
                const aSalary = extractSalary(a.salary);
                const bSalary = extractSalary(b.salary);
                return bSalary - aSalary;
            case 'relevance':
            default:
                // Sort by trust score (verified jobs first)
                if (a.verified !== b.verified) return b.verified - a.verified;
                return b.trustScore - a.trustScore;
        }
    });
    
    displayJobs(filteredJobs);
    updateJobStats(filteredJobs);
}

function getDaysAgo(postedText) {
    if (postedText.includes('day')) {
        return parseInt(postedText) || 1;
    } else if (postedText.includes('week')) {
        return 7;
    } else if (postedText.includes('month')) {
        return 30;
    }
    return 0;
}

function extractSalary(salaryText) {
    const match = salaryText.match(/\$([0-9,]+)/);
    if (match) {
        return parseInt(match[1].replace(/,/g, ''));
    }
    return 0;
}

function displayJobs(jobs) {
    const container = document.getElementById('jobsContainer');
    const noResults = document.getElementById('noResults');
    
    if (jobs.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    container.innerHTML = jobs.map(job => `
        <div class="job-card ${job.verified ? 'verified' : 'unverified'}" data-job-id="${job.id}">
            <div class="job-badge ${job.verified ? 'verified-badge' : 'warning-badge'}">
                <i class="fas fa-${job.verified ? 'shield-alt' : 'exclamation-triangle'}"></i>
                ${job.verified ? 'Verified & Safe' : 'Unverified - Check Carefully'}
            </div>
            
            <div class="job-header">
                <h3>${job.title}</h3>
                <div class="company-info">
                    <span class="company">${job.company}</span>
                    <span class="source">via ${job.source}</span>
                </div>
            </div>
            
            <div class="job-details">
                <div class="detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                    ${job.remote ? '<span class="remote-tag"><i class="fas fa-home"></i> Remote</span>' : ''}
                </div>
                
                <div class="detail">
                    <i class="fas fa-money-bill-wave"></i>
                    <span class="salary">${job.salary}</span>
                </div>
                
                <div class="detail">
                    <i class="fas fa-chart-line"></i>
                    <span>Trust Score: ${job.trustScore}/100</span>
                </div>
            </div>
            
            <div class="job-description">
                <p>${job.description.substring(0, 150)}...</p>
            </div>
            
            <div class="job-tags">
                ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <div class="job-footer">
                <span class="posted">
                    <i class="fas fa-clock"></i> ${job.posted}
                </span>
                
                <div class="job-actions">
                    <button class="btn btn-small" onclick="viewJobDetails(${job.id})">
                        <i class="fas fa-eye"></i> Details
                    </button>
                    <button class="btn btn-primary" onclick="applyForJob(${job.id})">
                        <i class="fas fa-paper-plane"></i> Finish Up
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateJobStats(jobs = MOCK_JOBS) {
    const totalJobs = jobs.length;
    const verifiedJobs = jobs.filter(job => job.verified).length;
    
    document.getElementById('totalJobs').textContent = totalJobs;
    document.getElementById('verifiedJobs').textContent = verifiedJobs;
}

function viewJobDetails(jobId) {
    const job = MOCK_JOBS.find(j => j.id === jobId);
    if (!job) return;
    
    currentJob = job;
    
    const modalHTML = `
        <div class="job-modal">
            <div class="modal-header">
                <h2>${job.title}</h2>
                <button class="close-modal" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-content">
                <div class="modal-section">
                    <h3><i class="fas fa-building"></i> Company</h3>
                    <p>${job.company}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Location</h3>
                    <p>${job.location} ${job.remote ? '(Remote Available)' : ''}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-money-bill-wave"></i> Salary</h3>
                    <p>${job.salary}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-shield-alt"></i> Verification</h3>
                    <div class="verification-details">
                        <div class="verification-item ${job.verified ? 'verified' : 'warning'}">
                            <i class="fas fa-${job.verified ? 'check-circle' : 'exclamation-circle'}"></i>
                            <span>${job.verified ? 'Verified Company' : 'Unverified - Proceed with Caution'}</span>
                        </div>
                        <div class="verification-item">
                            <i class="fas fa-chart-line"></i>
                            <span>Trust Score: ${job.trustScore}/100</span>
                        </div>
                        <div class="verification-item">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Source: ${job.source}</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-file-alt"></i> Job Description</h3>
                    <p>${job.description}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-tags"></i> Requirements</h3>
                    <div class="tags">
                        ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="closeModal()">
                        <i class="fas fa-times"></i> Close
                    </button>
                    <button class="btn btn-primary" onclick="applyForJob(${job.id})">
                        <i class="fas fa-paper-plane"></i> Apply Now
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.id = 'jobModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.getElementById('jobModal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function applyForJob(jobId) {
    const job = MOCK_JOBS.find(j => j.id === jobId);
    if (!job) return;
    
    currentJob = job;
    
    // Check if user has enhanced resume
    const enhancedResume = localStorage.getItem('enhanced_resume');
    if (!enhancedResume) {
        if (confirm('You need to enhance your resume first with Easy Fix. Would you like to go there now?')) {
            window.location.href = 'easy-fix.html';
        }
        return;
    }
    
    // Show application manager
    showApplicationManager(job);
}

function showApplicationManager(job) {
    const manager = document.getElementById('applicationManager');
    const appForm = document.getElementById('appForm');
    
    // Load enhanced resume data
    const enhancedResume = JSON.parse(localStorage.getItem('enhanced_resume') || '{}');
    
    appForm.innerHTML = `
        <div class="app-form-section">
            <h4>Applying for: ${job.title} at ${job.company}</h4>
        </div>
        
        <div class="app-form-section">
            <h5><i class="fas fa-file-alt"></i> Resume Selection</h5>
            <div class="resume-selection">
                <div class="resume-option selected">
                    <i class="fas fa-check-circle"></i>
                    <div class="resume-info">
                        <strong>Enhanced Resume</strong>
                        <small>Match Score: ${enhancedResume.matchScore || 85}%</small>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="app-form-section">
            <h5><i class="fas fa-user"></i> Personal Information</h5>
            <div class="form-grid">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" value="John Doe" readonly>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="john.doe@example.com" readonly>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" value="+1 (555) 123-4567" readonly>
                </div>
            </div>
        </div>
        
        <div class="app-form-section">
            <h5><i class="fas fa-file-signature"></i> Cover Letter</h5>
            <div class="cover-letter-toggle">
                <label>
                    <input type="checkbox" checked>
                    Include AI-generated cover letter
                </label>
                <textarea placeholder="Optional: Customize your cover letter..." rows="4"></textarea>
            </div>
        </div>
        
        <div class="app-form-actions">
            <button class="btn btn-secondary" onclick="closeApplicationManager()">
                <i class="fas fa-times"></i> Cancel
            </button>
            <button class="btn btn-primary" onclick="submitApplication()">
                <i class="fas fa-paper-plane"></i> Submit Application
            </button>
        </div>
    `;
    
    manager.style.display = 'block';
    
    // Scroll to manager
    manager.scrollIntoView({ behavior: 'smooth' });
}

function closeApplicationManager() {
    document.getElementById('applicationManager').style.display = 'none';
}

function submitApplication() {
    if (!currentJob) return;
    
    // Get existing applications
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Add new application
    applications.push({
        jobId: currentJob.id,
        jobTitle: currentJob.title,
        company: currentJob.company,
        appliedAt: new Date().toISOString(),
        status: 'submitted',
        enhancedResumeUsed: true
    });
    
    // Save applications
    localStorage.setItem('applications', JSON.stringify(applications));
    
    // Close manager
    closeApplicationManager();
    
    // Show success message
    alert(`✅ Application submitted successfully for "${currentJob.title}" at ${currentJob.company}!\n\nYou'll receive a confirmation email shortly.`);
    
    // Update UI
    const applyButtons = document.querySelectorAll(`[onclick="applyForJob(${currentJob.id})"]`);
    applyButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-check"></i> Applied';
        btn.disabled = true;
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
    });
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('locationInput').value = '';
    document.getElementById('remoteOnly').checked = false;
    document.getElementById('verifiedOnly').checked = true;
    document.getElementById('jobType').value = '';
    document.getElementById('experienceLevel').value = '';
    document.getElementById('sortBy').value = 'relevance';
    
    loadJobs();
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Set up search input listeners
    const searchInputs = ['searchInput', 'locationInput', 'remoteOnly', 'verifiedOnly', 'jobType', 'experienceLevel', 'sortBy'];
    
    searchInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.type === 'checkbox' || element.tagName === 'SELECT') {
                element.addEventListener('change', searchJobs);
            } else {
                element.addEventListener('input', searchJobs);
            }
        }
    });
    
    // Load initial jobs
    loadJobs();
});