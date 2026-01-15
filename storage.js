// LocalStorage helper functions
const Storage = {
    set: function(key, value) {
        try {
            const stringValue = JSON.stringify(value);
            localStorage.setItem(key, stringValue);
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    get: function(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    remove: function(key) {
        localStorage.removeItem(key);
    },

    clear: function() {
        localStorage.clear();
    },

    // Specific data methods
    saveResume: function(resumeData) {
        return this.set('current_resume', resumeData);
    },

    getResume: function() {
        return this.get('current_resume');
    },

    saveEnhancedResume: function(enhancedData) {
        return this.set('enhanced_resume', enhancedData);
    },

    getEnhancedResume: function() {
        return this.get('enhanced_resume');
    },

    saveApplication: function(applicationData) {
        const applications = this.get('applications') || [];
        applications.push({
            ...applicationData,
            id: Date.now(),
            submittedAt: new Date().toISOString()
        });
        return this.set('applications', applications);
    },

    getApplications: function() {
        return this.get('applications') || [];
    },

    getApplicationStats: function() {
        const applications = this.getApplications();
        return {
            total: applications.length,
            submitted: applications.filter(app => app.status === 'submitted').length,
            viewed: applications.filter(app => app.status === 'viewed').length,
            interviewed: applications.filter(app => app.status === 'interviewed').length,
            rejected: applications.filter(app => app.status === 'rejected').length,
            accepted: applications.filter(app => app.status === 'accepted').length
        };
    },

    // API Key management
    saveAPIKey: function(apiKey) {
        return this.set('openai_key', apiKey);
    },

    getAPIKey: function() {
        return this.get('openai_key');
    },

    clearAPIKey: function() {
        this.remove('openai_key');
    },

    // User preferences
    savePreferences: function(preferences) {
        return this.set('user_preferences', preferences);
    },

    getPreferences: function() {
        return this.get('user_preferences') || {
            theme: 'dark',
            notifications: true,
            autoSave: true
        };
    },

    // Session data (cleared on browser close)
    setSession: function(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },

    getSession: function(key) {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
};

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = Storage;
}

// Global helper functions
function getItem(key) {
    return Storage.get(key);
}

function setItem(key, value) {
    return Storage.set(key, value);
}

function removeItem(key) {
    return Storage.remove(key);
}

function clearStorage() {
    Storage.clear();
}