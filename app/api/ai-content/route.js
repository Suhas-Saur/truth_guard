import { NextResponse } from "next/server";
import { getGeminiResponse, getGeminiImageResponse } from "../../../lib/gemini";
import { HistoryModel } from "../../../models/History";

// ── Helpers ────────────────────────────────────────────────────────────────

function fallback(reason = "Could not reliably analyze the content.") {
  return NextResponse.json({
    result: "Uncertain",
    confidence: 50,
    reason,
  });
}

function parseAIResponse(rawText) {
  let text = rawText.trim();
  if (text.startsWith("```json")) text = text.replace(/^```json/, "");
  else if (text.startsWith("```")) text = text.replace(/^```/, "");
  if (text.endsWith("```")) text = text.replace(/```$/, "");
  return JSON.parse(text.trim());
}

function formatResult(parsed, queryText = "AI Content Check") {
  const result =
    parsed.result === "Likely AI-generated" ? "Likely AI-generated" : "Likely Human";
  const confidence =
    typeof parsed.confidence === "number"
      ? Math.min(100, Math.max(0, parsed.confidence))
      : 50;

  const data = {
    result,
    confidence,
    reason: parsed.reason || "No explanation provided.",
  };

  HistoryModel.add({
    type: "ai-content",
    query: queryText,
    result: data.result,
    score: data.confidence,
    reason: data.reason,
  }).catch((e) => console.warn("History save error:", e.message));

  return NextResponse.json(data);
}

const JSON_SCHEMA = `
You must respond ONLY with a raw JSON object and no other text, markdown, or code blocks.
The JSON must match exactly:
{
  "result": "Likely AI-generated" | "Likely Human",
  "confidence": <integer 0-100, where 100 = definitely the labeled result>,
  "reason": "<concise one or two sentence explanation>"
}`;

function buildPrompt(contentDescription) {
  return `
You are an expert AI content analyst trained to distinguish between AI-generated and human-written content.

Analyze the following ${contentDescription} and determine whether it was written/created by an AI system or a human.

Look for these AI indicators:
1. Overly uniform tone, rhythm, and sentence structure throughout
2. Generic, hedging language (e.g., "It is important to note", "In conclusion", "Furthermore")
3. Absence of personal anecdotes, emotional depth, or quirky personal style
4. Repetitive phrases or near-identical sentence openings
5. Perfect grammar with no natural conversational errors
6. Unnaturally comprehensive coverage of a topic without deep specialization
7. Lack of perspective, opinion, or cultural specificity

Human writing indicators:
1. Natural variation in sentence length, style, and rhythm
2. Personal opinions, lived experiences, or cultural references
3. Minor grammatical quirks or unconventional stylistic choices
4. Focused depth rather than broad surface-level coverage
5. Emotional resonance and authentic voice
${JSON_SCHEMA}`;
}

// ── Route ──────────────────────────────────────────────────────────────────

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, file, fileName, mimeType } = body;

    const hasText = typeof text === "string" && text.trim().length > 0;
    const hasFile = typeof file === "string" && file.length > 0;

    if (!hasText && !hasFile) {
      return fallback("No content was provided. Please paste text or upload a file.");
    }

    const isImage = hasFile && mimeType && mimeType.startsWith("image/");
    const isDocument = hasFile && !isImage; // PDF, DOC, TXT etc.

    // ── TEXT ONLY ──────────────────────────────────────────────────────────
    if (hasText && !hasFile) {
      if (text.trim().length < 20) {
        return fallback("Text is too short for meaningful AI detection analysis.");
      }

      const prompt = `
${buildPrompt("text")}

Text to analyze:
"""
${text.trim()}
"""
`;
      const aiResponse = await getGeminiResponse(prompt);
      return formatResult(parseAIResponse(aiResponse), text.trim());
    }

    // ── IMAGE FILE ─────────────────────────────────────────────────────────
    if (hasFile && isImage && !hasText) {
      const prompt = `
${buildPrompt("image")}

Analyze the image for signs of AI generation:
- If it contains text, analyze the writing style for AI patterns
- If it is a photograph or artwork, look for AI image generation artifacts (perfect symmetry, unnatural textures, dreamlike quality, watermarks from AI tools)
- Consider whether a human or AI system likely created this image
`;
      const aiResponse = await getGeminiImageResponse(prompt, file, mimeType);
      return formatResult(parseAIResponse(aiResponse), `Image: ${fileName || "Uploaded image"}`);
    }

    // ── DOCUMENT FILE (PDF, DOC, TXT) ──────────────────────────────────────
    if (hasFile && isDocument && !hasText) {
      const effectiveMimeType =
        mimeType === "application/msword" ||
        mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ? "application/pdf"
          : mimeType || "text/plain";

      const prompt = `
${buildPrompt(`document file named "${fileName || "document"}"`)}.

Read all the text content in this document and analyze the writing style to determine if it was AI-generated or human-written.
`;

      try {
        const aiResponse = await getGeminiImageResponse(prompt, file, effectiveMimeType);
        return formatResult(parseAIResponse(aiResponse), `Document: ${fileName || "document"}`);
      } catch {
        return fallback(
          `Could not extract content from "${fileName || "the file"}". Try pasting the text directly for best results.`
        );
      }
    }

    // ── TEXT + FILE COMBINED ───────────────────────────────────────────────
    if (hasText && hasFile) {
      const prompt = `
${buildPrompt("content that includes both text and an attached file")}

User-provided text:
"""
${text.trim()}
"""

Also consider the attached file. If it contains text, cross-reference both for consistency of style. If it is an image, analyze it separately for AI generation signs.
`;

      if (isImage) {
        const aiResponse = await getGeminiImageResponse(prompt, file, mimeType);
        return formatResult(parseAIResponse(aiResponse), text.trim());
      } else {
        const textOnlyPrompt = `
${buildPrompt("text")}

Text to analyze:
"""
${text.trim()}
"""

Note: The user also attached a document file named "${fileName || "document"}". Give weight to the pasted text above.
`;
        const aiResponse = await getGeminiResponse(textOnlyPrompt);
        return formatResult(parseAIResponse(aiResponse), text.trim());
      }
    }

    return fallback("Unrecognized input combination.");

  } catch (error) {
    console.error("API Error - AI Content Route:", error);

    if (error?.status === 429) {
      return fallback("Rate limit reached. Please try again shortly.");
    }
    if (error instanceof SyntaxError) {
      return fallback("Could not parse AI response.");
    }

    return fallback("Could not analyze the content due to a server error.");
  }
}
