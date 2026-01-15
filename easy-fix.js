// Easy Fix Resume Enhancement Logic
let currentResume = {
    text: '',
    fileName: '',
    type: ''
};

let currentResults = null;

function saveAPIKey() {
    const keyInput = document.getElementById('apiKey');
    const key = keyInput.value.trim();
    
    if (!key) {
        alert('Please enter your OpenAI API key');
        return;
    }
    
    if (!key.startsWith('sk-')) {
        alert('Please enter a valid OpenAI API key (starts with sk-)');
        return;
    }
    
    localStorage.setItem('openai_key', key);
    document.getElementById('apiSection').style.display = 'none';
    alert('API key saved successfully!');
    
    // Initialize OpenAI client
    initOpenAI(key);
}

function showTextInput() {
    document.getElementById('textInputContainer').style.display = 'block';
}

function useTextResume() {
    const text = document.getElementById('resumeText').value.trim();
    if (!text) {
        alert('Please enter your resume text');
        return;
    }
    
    if (text.length < 100) {
        alert('Resume text should be at least 100 characters');
        return;
    }
    
    currentResume = {
        text: text,
        fileName: 'pasted_resume.txt',
        type: 'text/plain'
    };
    
    document.getElementById('fileInfo').innerHTML = `
        <div class="file-success">
            <i class="fas fa-check-circle"></i>
            Text resume ready (${text.length} characters)
        </div>
    `;
    
    document.getElementById('textInputContainer').style.display = 'none';
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload PDF, TXT, or DOCX files only');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('File too large. Maximum size is 5MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        currentResume = {
            text: e.target.result,
            fileName: file.name,
            type: file.type,
            size: file.size
        };
        
        // Display file info
        document.getElementById('fileInfo').innerHTML = `
            <div class="file-success">
                <i class="fas fa-check-circle"></i>
                ${file.name} (${(file.size / 1024).toFixed(1)} KB)
                <br>
                <small>Ready for enhancement</small>
            </div>
        `;
    };
    
    if (file.type === 'application/pdf') {
        // For PDF, we'll use text extraction
        // Note: For production, include PDF.js library
        reader.readAsText(file);
    } else {
        reader.readAsText(file);
    }
}

async function enhanceResume() {
    // Check API key
    const apiKey = localStorage.getItem('openai_key');
    if (!apiKey) {
        alert('Please enter your OpenAI API key first');
        document.getElementById('apiSection').style.display = 'block';
        return;
    }
    
    // Check resume
    if (!currentResume.text || currentResume.text.length < 50) {
        alert('Please upload or paste your resume text');
        return;
    }
    
    // Check job description
    const jobDescription = document.getElementById('jobDescription').value.trim();
    if (!jobDescription || jobDescription.length < 100) {
        alert('Please enter a job description (at least 100 characters)');
        return;
    }
    
    // Get enhancement options
    const options = {
        keywords: document.getElementById('optKeywords').checked,
        ats: document.getElementById('optATS').checked,
        skills: document.getElementById('optSkills').checked,
        quantify: document.getElementById('optQuantify').checked
    };
    
    // Show loading state
    const analyzeBtn = document.getElementById('analyzeBtn');
    const originalHTML = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing with AI...';
    analyzeBtn.disabled = true;
    
    try {
        // Initialize OpenAI client
        const openai = initOpenAI(apiKey);
        
        // Call API
        const results = await openai.enhanceResume(currentResume.text, jobDescription);
        currentResults = results;
        
        // Display results
        displayResults(results);
        
    } catch (error) {
        console.error('Enhancement error:', error);
        alert('Error enhancing resume: ' + error.message);
    } finally {
        // Restore button
        analyzeBtn.innerHTML = originalHTML;
        analyzeBtn.disabled = false;
    }
}

function displayResults(results) {
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    
    // Animate match score
    const scoreElement = document.getElementById('matchScore');
    const scoreCircle = document.getElementById('scoreCircle');
    animateScore(scoreElement, scoreCircle, results.matchScore);
    
    // Update match feedback
    const feedbackElement = document.getElementById('matchFeedback');
    feedbackElement.textContent = getMatchFeedback(results.matchScore);
    
    // Display suggestions
    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = results.suggestions
        .map(suggestion => `
            <div class="suggestion-item">
                <i class="fas fa-lightbulb"></i>
                <span>${suggestion}</span>
            </div>
        `).join('');
    
    // Display enhanced preview
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = `
        <div class="preview-section">
            <h4>Enhanced Summary</h4>
            <p>${results.enhancedSummary}</p>
        </div>
        
        <div class="preview-section">
            <h4>Skills to Add</h4>
            <div class="tags">
                ${results.skillsToAdd.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="preview-section">
            <h4>Improved Bullet Points</h4>
            <ul>
                ${results.improvedBullets.map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
        </div>
        
        <div class="preview-section">
            <h4>Missing Keywords</h4>
            <div class="tags">
                ${results.missingKeywords.map(keyword => `<span class="tag">${keyword}</span>`).join('')}
            </div>
        </div>
    `;
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function animateScore(element, circle, targetScore) {
    let currentScore = 0;
    const increment = targetScore / 50; // 50 steps
    
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        
        // Update text
        element.textContent = Math.round(currentScore) + '%';
        
        // Update circle
        const degrees = (currentScore / 100) * 360;
        circle.style.background = `conic-gradient(var(--success) ${degrees}deg, var(--dark-light) 0deg)`;
    }, 20);
}

function getMatchFeedback(score) {
    if (score >= 90) {
        return 'Excellent match! Your resume aligns very well with the job description.';
    } else if (score >= 80) {
        return 'Good match! Some optimizations suggested to improve your chances.';
    } else if (score >= 70) {
        return 'Moderate match. Consider implementing the suggestions below.';
    } else if (score >= 60) {
        return 'Fair match. Several improvements needed for better alignment.';
    } else {
        return 'Low match. Significant improvements recommended.';
    }
}

function downloadResults() {
    if (!currentResults) {
        alert('No results to download. Please enhance a resume first.');
        return;
    }
    
    const content = `
RESUME ENHANCEMENT RESULTS
============================

Match Score: ${currentResults.matchScore}%

MISSING KEYWORDS
----------------
${currentResults.missingKeywords.join(', ')}

ENHANCEMENT SUGGESTIONS
-----------------------
${currentResults.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

ENHANCED SUMMARY
----------------
${currentResults.enhancedSummary}

SKILLS TO ADD
-------------
${currentResults.skillsToAdd.join(', ')}

IMPROVED BULLET POINTS
----------------------
${currentResults.improvedBullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Generated by ResumeOS Pro - ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-resume-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetForm() {
    currentResume = { text: '', fileName: '', type: '' };
    currentResults = null;
    document.getElementById('fileInfo').innerHTML = '';
    document.getElementById('jobDescription').value = '';
    document.getElementById('resumeText').value = '';
    document.getElementById('textInputContainer').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('charCount').textContent = '0';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize file input listener
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
});