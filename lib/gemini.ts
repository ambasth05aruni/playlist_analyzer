import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds between retries

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateWithGemini(prompt: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            // Strip markdown code fences if present
            return text
                .replace(/^```(?:json)?\n?/gm, "")
                .replace(/\n?```$/gm, "")
                .trim();
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            const isRateLimit =
                message.includes("429") ||
                message.includes("RESOURCE_EXHAUSTED") ||
                message.includes("quota");

            console.warn(
                `Gemini attempt ${attempt}/${MAX_RETRIES} failed:`,
                message.slice(0, 150)
            );

            if (isRateLimit && attempt < MAX_RETRIES) {
                const delay = RETRY_DELAY_MS * attempt;
                console.log(`Retrying in ${delay / 1000}s...`);
                await sleep(delay);
                continue;
            }

            if (isRateLimit) {
                throw new Error(
                    "AI service is temporarily rate-limited. Your Gemini API free tier quota may need a few minutes to activate. Please try again in 1-2 minutes."
                );
            }
            throw error;
        }
    }

    throw new Error("Failed to generate AI response after retries");
}
