// GPT-Based Proposal Review Integration for Grant System

const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Uses GPT to review a proposal based on abstract and objectives.
 * Returns structured output: score, summary, and recommendation.
 */
async function gptReviewProposal({ abstract, objectives }) {
  const prompt = `
You are a grant reviewer. Based on the abstract and objectives below, evaluate the quality of the proposal.

Evaluate:
1. Clarity and structure of the abstract
2. Innovation or originality
3. Feasibility and relevance to the grant theme

Return only in the following format:
Score: <number between 0-100>
Explanation: <2-3 line summary>
Recommendation: <Recommended |Not Recommended>

---
Abstract:
${abstract}

Objectives:
${objectives}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;

  // Parse GPT output (Score, Explanation, Recommendation)
  const scoreMatch = content.match(/Score:\s*(\d+)/i);
  const explanationMatch = content.match(/Explanation:\s*(.+)/i);
  const recommendationMatch = content.match(/Recommendation:\s*(.+)/i);

  return {
    score: scoreMatch ? parseInt(scoreMatch[1]) : null,
    explanation: explanationMatch ? explanationMatch[1].trim() : null,
    recommendation: recommendationMatch ? recommendationMatch[1].trim() : null,
    fullResponse: content
  };
}

module.exports = { gptReviewProposal };
