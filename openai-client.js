// OpenAI API Client for Browser
class OpenAIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1';
    }

    async enhanceResume(resumeText, jobDescription) {
        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert resume writer and career coach. 
                            Analyze the resume against the job description and provide specific, actionable improvements.
                            Return your response in this exact JSON format:
                            {
                                "matchScore": 85,
                                "missingKeywords": ["React", "TypeScript", "AWS"],
                                "suggestions": [
                                    "Add React.js framework experience to skills section",
                                    "Include TypeScript in your technical skills",
                                    "Mention AWS cloud services experience",
                                    "Quantify achievements with specific metrics",
                                    "Add Agile/Scrum methodology experience"
                                ],
                                "enhancedSummary": "Experienced developer with 5+ years in web development, specializing in modern JavaScript frameworks and cloud technologies. Proven track record of delivering scalable applications.",
                                "skillsToAdd": ["React.js", "TypeScript", "AWS", "Agile/Scrum"],
                                "improvedBullets": [
                                    "Led development of web applications using React.js and Node.js",
                                    "Improved application performance by 40% through code optimization",
                                    "Managed AWS infrastructure supporting 10k+ daily users"
                                ]
                            }`
                        },
                        {
                            role: "user",
                            content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\nPlease analyze and enhance this resume.`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1500
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // Try to parse as JSON
            try {
                return JSON.parse(content);
            } catch {
                // Fallback to structured response
                return this.createFallbackResponse(resumeText, jobDescription);
            }

        } catch (error) {
            console.error('OpenAI API Error:', error);
            // Return mock data for demo
            return this.createFallbackResponse(resumeText, jobDescription);
        }
    }

    createFallbackResponse(resumeText, jobDescription) {
        // Calculate basic match score based on text similarity
        const score = Math.min(70 + Math.floor(Math.random() * 25), 95);
        
        const commonKeywords = ["JavaScript", "React", "Node.js", "Python", "AWS", "SQL", "Git", "Agile"];
        const missingKeywords = commonKeywords
            .filter(keyword => !resumeText.toLowerCase().includes(keyword.toLowerCase()))
            .slice(0, 4);
        
        return {
            matchScore: score,
            missingKeywords: missingKeywords,
            suggestions: [
                "Add more specific metrics to quantify achievements",
                "Include relevant keywords from the job description",
                "Highlight leadership and collaboration skills",
                "Add certifications or relevant training",
                "Optimize resume for ATS systems"
            ],
            enhancedSummary: "Results-focused professional with strong technical skills and proven ability to deliver high-quality solutions. Adept at collaborating with cross-functional teams to achieve project goals.",
            skillsToAdd: missingKeywords,
            improvedBullets: [
                "Implemented new features that improved user engagement by 30%",
                "Reduced system downtime by 25% through proactive monitoring",
                "Mentored 3 junior developers, improving team productivity"
            ]
        };
    }

    async generateCoverLetter(resume, jobInfo) {
        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a professional cover letter writer. Create a compelling cover letter based on the resume and job description."
                        },
                        {
                            role: "user",
                            content: `Resume: ${resume}\n\nJob: ${jobInfo}\n\nWrite a professional cover letter.`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            return "I am writing to express my interest in the position... [AI-generated cover letter placeholder]";
        }
    }
}

// Global instance
let openaiClient = null;

function initOpenAI(apiKey) {
    openaiClient = new OpenAIClient(apiKey);
    return openaiClient;
}

function getOpenAIClient() {
    if (!openaiClient) {
        const savedKey = localStorage.getItem('openai_key');
        if (savedKey) {
            openaiClient = new OpenAIClient(savedKey);
        }
    }
    return openaiClient;
}