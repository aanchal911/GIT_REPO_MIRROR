import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GitHubRepoData, AnalysisResult } from "../types";

export const analyzeRepositoryWithGemini = async (repoData: GitHubRepoData, targetRole: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      repoName: { type: Type.STRING },
      totalScore: { type: Type.NUMBER, description: "Overall quality score from 0-100" },
      level: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced", "Production-Ready"] },
      summary: { type: Type.STRING, description: "A 2-3 sentence recruiter-style summary." },
      metrics: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["category", "score", "feedback"]
        }
      },
      roadmap: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            category: { type: Type.STRING, enum: ["Structure", "Testing", "Documentation", "Code Quality", "CI/CD", "Skills"] }
          },
          required: ["id", "title", "description", "priority", "category"]
        }
      },
      targetRole: { type: Type.STRING },
      roleCompatibilityScore: { type: Type.NUMBER, description: "Score 0-100 indicating fit for the target role" },
      detectedSkills: { 
          type: Type.ARRAY, 
          items: { 
              type: Type.OBJECT,
              properties: {
                  name: { type: Type.STRING },
                  proficiency: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] }
              },
              required: ["name", "proficiency"]
          }, 
          description: "List of technologies and estimated proficiency based on usage" 
      },
      roleAnalysis: { type: Type.STRING, description: "Brief analysis of why the repo fits or does not fit the target role" },
      readmeAudit: {
          type: Type.OBJECT,
          properties: {
              overview: { type: Type.BOOLEAN },
              installation: { type: Type.BOOLEAN },
              usage: { type: Type.BOOLEAN },
              visuals: { type: Type.BOOLEAN },
          },
          required: ["overview", "installation", "usage", "visuals"]
      },
      commitAnalysis: { type: Type.STRING, description: "Analysis of commit message quality and frequency pattern." }
    },
    required: ["repoName", "totalScore", "level", "summary", "metrics", "roadmap", "targetRole", "roleCompatibilityScore", "detectedSkills", "roleAnalysis", "readmeAudit", "commitAnalysis"]
  };

  const roleContext = targetRole 
    ? `The user is explicitly targeting the job role: "${targetRole}". Analyze how well this project demonstrates the skills required for this specific role.` 
    : `The user has not specified a role, so assume a general "Software Engineer" role.`;

  const commitContext = repoData.recentCommits.length > 0 
    ? `Recent Commit Messages: \n${repoData.recentCommits.map(c => `- ${c.message}`).join("\n")}`
    : "No recent commits available.";

  const prompt = `
    You are a Senior Technical Recruiter and Principal Engineer. 
    Analyze this GitHub repository based on the provided metadata, file structure, commits, and README.
    
    Repository: ${repoData.owner}/${repoData.repo}
    Language: ${repoData.language}
    Stars: ${repoData.stars}
    Description: ${repoData.description}
    
    File Structure (partial):
    ${repoData.fileTree.join("\n")}
    
    README Content (partial):
    ${repoData.readmeContent}

    ${commitContext}

    Task:
    1. Evaluate the repository on: Code Quality, Project Structure, Documentation, Tests, Real-World Relevance, and Git Practices.
    2. Assign a strict general quality score (0-100). Be critical. Most student projects should be 40-60.
    3. ${roleContext}
    4. Detect skills and estimate proficiency (Beginner/Intermediate/Advanced) based on complexity of usage in the file structure and README.
    5. Audit the README: Does it have an overview? Installation steps? Usage guide? Visuals/Screenshots?
    6. Analyze Git Hygiene: Do the commit messages look professional ("Fix bug" vs "Fix race condition in auth service")?
    7. Provide a personalized roadmap.
    
    Return pure JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2 // Low temperature for consistent analysis
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze repository with AI.");
  }
};
