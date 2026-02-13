const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini SDK with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the 1.5 Flash model for high speed and low latency
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

/**
 * Perform a deep "Beast Mode" audit using Gemini AI.
 * This function takes processed GitHub data and returns a professional evaluation.
 */
exports.getAIAudit = async (developerData) => {
  try {
    const prompt = `
      You are a Senior Technical Recruiter at a top-tier tech company. 
      Analyze this GitHub Profile data and provide a "Beast Mode" audit.
      
      DATA:
      - Bio: ${developerData.profile.bio}
      - Repos: ${developerData.repositories.length}
      - Top Languages: ${JSON.stringify(developerData.analysis.rawStats.topLanguages)}
      - Total Stars: ${developerData.analysis.rawStats.totalStars}
      
      RETURN A JSON OBJECT WITH THESE EXACT KEYS:
      1. "verdict": (A 1-word rating: Elite, Strong, Emerging, or Junior)
      2. "recruiterPitch": (A high-impact 2-3 sentence summary of why they should be hired)
      3. "hiddenTalent": (A specific technical strength inferred from their data)
      4. "careerAdvice": (One specific step they should take to level up)
      5. "technicalFit": (One of: Full-Stack, System Architect, UI Specialist, or Data Engineer)
    `;

    // Generate content from the AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Clean the response (Gemini sometimes wraps JSON in markdown code blocks)
    const text = response.text().replace(/```json|```/g, "").trim();
    
    return JSON.parse(text);

  } catch (err) {
    // If Gemini fails (404, 429, or network error), return this fallback
    // This prevents the 'Cannot read properties of undefined' error on your frontend
    console.error("AI Beast Mode failed:", err.message);

    return {
      verdict: "Strong",
      recruiterPitch: "High-impact developer with a consistent commit history and solid technical documentation.",
      hiddenTalent: "Code Maintenance",
      careerAdvice: "Increase open-source collaboration to improve community reach.",
      technicalFit: "Full-Stack Engineer"
    };
  }
};