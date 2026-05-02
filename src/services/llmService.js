// src/services/llmService.js
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Initialize the Gemini API using the key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateWithAI = async (contextString) => {
    try {
        // Use the fast, modern model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // The "Few-Shot" High Compulsion Prompt
        const systemPrompt = `
You are an AI growth assistant communicating directly with a merchant.
Your ONLY job is to write a short, highly converting "High Compulsion" message based STRICTLY on the data provided inside the XML tags below.

<MERCHANT_DATA>
${contextString}
</MERCHANT_DATA>

CRITICAL RULES FOR GENERATION:
1. ZERO HALLUCINATION: You are strictly forbidden from inventing prices, discounts, or statistics. Use ONLY the numbers and offers explicitly written in <MERCHANT_DATA>.
2. THE HOOK: Sentence 1 MUST state the exact 'Trigger Event' from the data to grab attention.
3. THE PROOF & CTA: Sentence 2 MUST combine the exact offer with a single, simple yes/no question asking to push that offer.
4. LENGTH: Exactly 2 sentences.
5. FORMAT: Output ONLY the final message text. No greetings (e.g., no "Hi Luxe Hair Studio"), no sign-offs, no quotes around the text.

EXAMPLE OF EXPECTED OUTPUT:
190 people in your locality are searching for "Dental Check Up". Should I send them a discounted check up at ₹299?
        `.trim();

        console.log("🧠 Sending payload to AI...");

        // Lower the safety shields to allow direct marketing language
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            }
        ];
        
        // Generate the response
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            safetySettings,
        });

        const response = await result.response;
        
        // Safety check
        if (!response.candidates || response.candidates.length === 0) {
            throw new Error("AI returned an empty response. Likely blocked by a safety filter.");
        }
        
        return response.text().trim();

    } catch (error) {
        console.error("❌ AI Generation Error Details:", error.message || error);
        throw new Error("Failed to generate message from AI.");
    }
};

module.exports = { generateWithAI };