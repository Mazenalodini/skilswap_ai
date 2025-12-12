// AI Utility Functions
// Integrates with OpenAI API for real intelligence, falling back to mock data if no key is provided.

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Helper to call OpenAI
async function callLLM(systemPrompt: string, userPrompt: string, jsonMode = true): Promise<any> {
    if (!OPENAI_API_KEY) {
        console.warn('Missing VITE_OPENAI_API_KEY, falling back to mock data.');
        return null;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                response_format: jsonMode ? { type: 'json_object' } : undefined,
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;

        // Sanitize JSON if it comes wrapped in markdown
        if (jsonMode) {
            content = content.replace(/```json\n?|```/g, '').trim();
        }

        return jsonMode ? JSON.parse(content) : content;
    } catch (error) {
        console.error('AI Call Failed:', error);
        return null;
    }
}

export interface AIMatchResult {
    providerId: string;
    score: number; // 0-100
    reason: string;
}

export interface AIProposal {
    coverLetter: string;
    estimatedTime: string;
    suggestedPrice: number;
}

export const aiService = {
    /**
     * Checks if the AI service is connected and working
     */
    checkConnection: async (): Promise<{ connected: boolean; message: string }> => {
        if (!OPENAI_API_KEY) {
            return { connected: false, message: 'Missing VITE_OPENAI_API_KEY' };
        }
        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
            });
            if (response.ok) {
                return { connected: true, message: 'Connected to OpenAI' };
            } else {
                return { connected: false, message: `API Error: ${response.statusText}` };
            }
        } catch (error: any) {
            return { connected: false, message: `Connection Failed: ${error.message}` };
        }
    },

    /**
     * Matches a service request with the best providers
     */
    matchProviders: async (requestTitle: string, requestDescription: string): Promise<AIMatchResult[]> => {
        // For matching, we realistically need the full DB of providers, which we don't have here.
        // We will keep this as a simulation or a simple filter for now, 
        // as "Real AI Matching" usually requires Vector DBs (pgvector) which is a backend task.
        // We will improve the simulation slightly.
        await new Promise(resolve => setTimeout(resolve, 1500));
        return [
            { providerId: 'mock-provider-1', score: 95, reason: 'High expertise in required skills and excellent past ratings.' },
            { providerId: 'mock-provider-2', score: 88, reason: 'Good match for budget and timeline.' },
            { providerId: 'mock-provider-3', score: 75, reason: 'Capable but has less experience in this specific niche.' }
        ];
    },

    /**
     * Generates a proposal draft for a provider
     */
    generateProposal: async (requestDescription: string, providerSkills: string[]): Promise<AIProposal> => {
        const systemPrompt = `You are a professional freelancer assistant. Write a short, persuasive cover letter. Return JSON: { "coverLetter": string, "estimatedTime": string, "suggestedPrice": number }`;
        const userPrompt = `Request: "${requestDescription}". My Skills: ${providerSkills.join(', ')}.`;

        const result = await callLLM(systemPrompt, userPrompt);

        if (result) return result;

        // Fallback
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            coverLetter: `Dear Client,\n\nI noticed your request for "${requestDescription.substring(0, 30)}..." and I am very interested. With my skills in ${providerSkills.join(', ')}, I am confident I can deliver high-quality results.\n\nBest regards,`,
            estimatedTime: '3-5 Days',
            suggestedPrice: 150
        };
    },

    /**
     * Analyzes text for inappropriate content or fraud
     */
    moderateContent: async (text: string): Promise<{ safe: boolean; reason?: string }> => {
        const systemPrompt = `You are a content moderator. excessive profanity, hate speech, or obvious scam attempts (like asking to move off-platform for payment) are unsafe. Return JSON: { "safe": boolean, "reason": string | null }`;
        const result = await callLLM(systemPrompt, text);

        if (result) return result;

        // Fallback
        const forbiddenWords = ['scam', 'hack', 'illegal', 'whatsapp', 'telegram'];
        const hasForbidden = forbiddenWords.some(word => text.toLowerCase().includes(word));
        return {
            safe: !hasForbidden,
            reason: hasForbidden ? 'Potential safety policy violation detected.' : undefined
        };
    },

    /**
     * Generates a REAL HARD skill verification quiz
     */
    generateSkillQuiz: async (skill: string): Promise<{ id: string; question: string; options: string[] }[]> => {
        const systemPrompt = `You are an expert examiner. Generate 5 HARD, senior-level multiple-choice questions to test the skill: "${skill}". 
        Focus on edge cases, best practices, and deep understanding, not just syntax.
        Return JSON: { "questions": [{ "id": string, "question": string, "options": string[] }] }`;

        const result = await callLLM(systemPrompt, `Generate quiz for ${skill}`);

        if (result && result.questions) return result.questions;

        // Fallback Mock
        await new Promise(resolve => setTimeout(resolve, 1500));
        return [
            {
                id: '1',
                question: `What is a common advanced pitfall when working with ${skill} in production?`,
                options: ['Memory Leaks', 'Race Conditions', 'Security Vulnerabilities', 'All of the above']
            },
            {
                id: '2',
                question: `Which design pattern is best suited for scaling ${skill} applications?`,
                options: ['Singleton', 'Observer', 'Factory', 'Dependency Injection']
            },
            {
                id: '3',
                question: `How do you handle version conflicts in ${skill}?`,
                options: ['Semantic Versioning', 'Lockfiles', 'Docker Containers', 'Manual Updates']
            },
            {
                id: '4',
                question: `Explain the security implications of XSS in ${skill}.`,
                options: ['Critical Risk', 'Minor Annoyance', 'Not Applicable', 'Browser handles it']
            },
            {
                id: '5',
                question: `What is the most efficient way to debug performance issues in ${skill}?`,
                options: ['Profiling Tools', 'Console Logs', 'User Reports', 'Guesswork']
            }
        ];
    },

    /**
     * Real AI Quiz Evaluation
     */
    evaluateQuiz: async (skill: string, answers: Record<string, string>): Promise<{ score: number; passed: boolean; feedback: string }> => {
        const systemPrompt = `You are an expert examiner. Evaluate the user's answers for a ${skill} quiz. 
        Determine if they passed (Senior Level > 80%).
        Return JSON: { "score": number (0-100), "passed": boolean, "feedback": string (in Arabic, encouraging but professional) }`;
        const userPrompt = JSON.stringify({ skill, answers });

        const result = await callLLM(systemPrompt, userPrompt);
        if (result) return result;

        // Fallback
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockScore = Math.floor(Math.random() * 30) + 70;
        return {
            score: mockScore,
            passed: mockScore >= 80,
            feedback: mockScore >= 80 ? 'أداء ممتاز! تظهر إجاباتك فهماً عميقاً للموضوع.' : 'أداء جيد، ولكن تحتاج إلى مراجعة بعض المفاهيم المتقدمة.'
        };
    },

    /**
     * AI Dispute Resolution Judge
     */
    analyzeDispute: async (chatHistory: any[], contractDetails: any): Promise<{ verdict: 'client_wins' | 'provider_wins' | 'split'; confidence: number; justification: string; suggested_action: string }> => {
        const systemPrompt = `You are an impartial AI Judge for a freelance platform. 
        Analyze the chat history and contract contract to determine who is right in a dispute.
        - Rules: Provider must deliver what was promised. Client must be reasonable with revisions.
        - Return JSON: { "verdict": "client_wins" | "provider_wins" | "split", "confidence": number, "justification": string (Arabic), "suggested_action": string }`;

        const userPrompt = JSON.stringify({ chatHistory, contractDetails });
        const result = await callLLM(systemPrompt, userPrompt);

        if (result) return result;

        // Fallback
        return {
            verdict: 'split',
            confidence: 50,
            justification: 'نظراً لعدم توفر البيانات الكاملة للذكاء الاصطناعي حالياً، نقترح حلاً وسطاً.',
            suggested_action: 'إعادة 50% من المبلغ للعميل.'
        };
    },

    /**
     * AI Fraud/Suspicion Detector
     */
    detectFraud: async (activityLog: any): Promise<{ isSuspicious: boolean; riskLevel: 'low' | 'medium' | 'high'; flags: string[] }> => {
        const systemPrompt = `You are a sophisticated Fraud Detection AI. Analyze the user activity log for patterns like:
        - Money laundering (rapid large deposits/withdrawals)
        - Platform circumvention (sharing emails/phones)
        - Bot behavior
        Return JSON: { "isSuspicious": boolean, "riskLevel": string, "flags": string[] }`;

        const result = await callLLM(systemPrompt, JSON.stringify(activityLog));
        if (result) return result;

        return { isSuspicious: false, riskLevel: 'low', flags: [] };
    },

    /**
     * AI Service Evaluator
     */
    evaluateService: async (serviceData: any): Promise<{ qualityScore: number; strengths: string[]; weaknesses: string[]; improvementTips: string[] }> => {
        const systemPrompt = `You are a Quality Assurance AI. Analyze this service offering (title, description, price, portfolio).
        Rate its quality (0-100) based on clarity, professionalism, and value.
        Return JSON: { "qualityScore": number, "strengths": string[], "weaknesses": string[], "improvementTips": string[] }`;

        const result = await callLLM(systemPrompt, JSON.stringify(serviceData));
        if (result) return result;

        return {
            qualityScore: 85,
            strengths: ['واضح وموجز'],
            weaknesses: ['يمكن أن يكون أكثر تفصيلاً'],
            improvementTips: ['أضف المزيد من نماذج الأعمال']
        };
    },

    /**
     * AUTONOMOUS AI JUDGE (Phase 6)
     * Analyzes dispute AND executes the verdict.
     */
    resolveDisputeAndEnforce: async (chatHistory: any[], contractDetails: any): Promise<{
        success: boolean;
        verdict: 'client_wins' | 'provider_wins' | 'split';
        actionTaken: string;
        confidence: number;
        justification: string;
    }> => {
        const systemPrompt = `You are an AUTONOMOUS AI JUDGE. 
        Analyze the dispute. If you are >85% confident, decide the verdict.
        - Rules: 
          1. If provider delivered work matching description -> Provider Wins (Release Funds).
          2. If provider failed to deliver or ghosted -> Client Wins (Refund).
          3. If ambiguous -> Split (50/50).
        
        Return JSON: { 
            "verdict": "client_wins" | "provider_wins" | "split", 
            "confidence": number (0-100), 
            "justification": string (Arabic, strict and formal),
            "action_to_execute": "release_funds" | "refund_client" | "split_funds"
        }`;

        const result = await callLLM(systemPrompt, JSON.stringify({ chatHistory, contractDetails }));

        // Mock Execution Logic (In real app, this would call Supabase DB)
        if (result && result.confidence > 85) {
            // Simulator: "Executing" database transaction...
            const actionMap = {
                'release_funds': 'تم تحويل المبلغ كاملاً إلى مقدم الخدمة وإغلاق العقد.',
                'refund_client': 'تم إعادة المبلغ كاملاً إلى العميل وإلغاء المشروع.',
                'split_funds': 'تم تقسيم المبلغ مناصفة بين الطرفين وإغلاق النزاع.'
            };

            return {
                success: true,
                verdict: result.verdict,
                confidence: result.confidence,
                justification: result.justification,
                actionTaken: actionMap[result.action_to_execute as keyof typeof actionMap] || 'تم تنفيذ الحكم.'
            };
        }

        // If low confidence, ask for human review
        return {
            success: false,
            verdict: 'split',
            confidence: result?.confidence || 0,
            justification: result?.justification || 'لم أتمكن من التوصل إلى حكم قاطع. يرجى مراجعة الإدارة.',
            actionTaken: 'تم تحويل القضية للمراجعة البشرية لعدم كفاية الأدلة.'
        };
    },

    /**
     * SMART SEARCH AGENT (Phase 6)
     * Understands natural language queries to filter/rank services.
     */
    searchServicesSmart: async (query: string, services: any[]): Promise<{ matchedServiceIds: string[]; reasoning: string }> => {
        const systemPrompt = `You are a Smart Search Agent. 
        Analyze the user's natural language query (e.g., "I need a cheap logo fast").
        Match it against the provided list of services.
        - "Cheap" -> Sort by lower price.
        - "Fast" -> Sort by deadline/delivery time.
        - "Best/Pro" -> Sort by rating/experience.
        
        Return JSON: { 
            "matchedServiceIds": string[] (IDs of services that match, sorted by relevance),
            "reasoning": string (Short explanation of why these were chosen)
        }`;

        // Optimize: Send only necessary fields to save tokens and limit count
        const servicesMinified = services.slice(0, 30).map(s => ({
            id: s.id,
            title: s.title,
            description: s.description ? s.description.substring(0, 100) + '...' : '',
            price: s.price,
            rating: s.rating
        }));

        const result = await callLLM(systemPrompt, JSON.stringify({ query, services: servicesMinified }));

        if (result && result.matchedServiceIds) {
            return result;
        }

        // Fallback: Simple keyword match
        const lowerQuery = query.toLowerCase();
        const matches = services.filter(s =>
            s.title.toLowerCase().includes(lowerQuery) ||
            s.description.toLowerCase().includes(lowerQuery)
        ).map(s => s.id);

        return {
            matchedServiceIds: matches,
            reasoning: 'عرض النتائج بناءً على تطابق الكلمات المفتاحية (Fallback).'
        };
    }
};
