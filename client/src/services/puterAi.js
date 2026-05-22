/**
 * Puter.js AI with server fallback when Puter is unavailable.
 * https://docs.puter.com/AI/
 */

import { aiService } from "./api";

const PLAN_SYSTEM_PROMPT = `You are ContentChef, an expert social media strategist and short-form content producer.

Your job: turn a creator's brief into a focused 7-day content calendar.

Rules:
- Match the creator's niche, audience, tone, and platform (Instagram, TikTok, LinkedIn, etc.) from their brief.
- Write scroll-stopping hooks and concise, platform-ready captions.
- Alternate "video" and "image" formatType across the week when it makes sense.
- Categories must fit the niche (not generic labels unless the brief is generic).
- visualInstructions: one sentence describing the visual (pastel, clean, on-brand).
- hashtags: 3–5 strings, each starting with #, niche-relevant (never reuse the same list for every post).
- Output ONLY valid JSON. No markdown, no code fences, no commentary.`;

function buildPlanUserPrompt(userPrompt) {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  const startDate = start.toISOString().split("T")[0];

  return `Creator brief:
"""
${userPrompt.trim()}
"""

Generate exactly 7 posts starting ${startDate} (one per day for 7 consecutive days).

Return JSON in this exact shape:
{
  "posts": [
    {
      "topic": "Short catchy title",
      "category": "Niche-specific category",
      "formatType": "video",
      "visualInstructions": "Visual direction for designer or AI image",
      "scriptOrCaption": {
        "hook": "Opening line under 120 characters",
        "body": "Main caption 2-4 sentences",
        "hashtags": ["#Example", "#NicheTag"]
      }
    }
  ]
}

Use dates ${startDate} through day 7 in order. Include a "date" field on each post (YYYY-MM-DD).`;
}

const MOODBOARD_IMAGE_PROMPT = (topic, visualInstructions) =>
  `Social media moodboard hero image for content topic: "${topic}". ${
    visualInstructions ? `Visual direction: ${visualInstructions}.` : ""
  } Style: soft pastel colors, clean minimal layout, professional creator aesthetic, no text overlay, high quality.`;

let scriptLoadPromise = null;

function loadPuterScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Puter AI only runs in the browser"));
  }
  if (window.puter?.ai?.chat) return Promise.resolve();

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector("script[data-puter-sdk]");
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Failed to load Puter SDK")),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.dataset.puterSdk = "true";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptLoadPromise = null;
        reject(new Error("Failed to load Puter SDK"));
      };
      document.head.appendChild(script);
    });
  }

  return scriptLoadPromise;
}

function waitForPuter(maxMs = 15000) {
  return new Promise((resolve, reject) => {
    if (window.puter?.ai?.chat) {
      resolve(window.puter);
      return;
    }
    const started = Date.now();
    const interval = setInterval(() => {
      if (window.puter?.ai?.chat) {
        clearInterval(interval);
        resolve(window.puter);
      } else if (Date.now() - started > maxMs) {
        clearInterval(interval);
        reject(new Error("Puter AI did not initialize"));
      }
    }, 150);
  });
}

async function ensurePuter() {
  await loadPuterScript();
  return waitForPuter();
}

async function ensurePuterSignedIn(puter) {
  if (!puter.auth?.signIn) return;

  let signedIn = false;
  try {
    signedIn = Boolean(
      typeof puter.auth.isSignedIn === "function"
        ? await puter.auth.isSignedIn()
        : puter.auth.isSignedIn?.(),
    );
  } catch {
    signedIn = false;
  }

  if (!signedIn) {
    await puter.auth.signIn({ attempt_temp_user_creation: true });
  }
}

function puterErrorMessage(err) {
  if (err?.message) return err.message;
  if (typeof err === "string") return err;
  if (err?.error?.message) return err.error.message;
  return "Puter AI request failed";
}

function extractMessageText(response) {
  const content = response?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : (part?.text ?? "")))
      .join("");
  }
  if (content && typeof content === "object" && content.text) {
    return content.text;
  }
  if (typeof response?.text === "string") return response.text;
  return String(response ?? "");
}

function parsePlanJson(rawText) {
  let text = rawText.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    text = text.slice(jsonStart, jsonEnd + 1);
  }

  const parsed = JSON.parse(text);
  const posts = Array.isArray(parsed?.posts) ? parsed.posts : parsed;
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("AI returned an empty or invalid plan");
  }
  return posts;
}

function assignDates(posts) {
  const start = new Date();
  start.setDate(start.getDate() + 1);

  return posts.slice(0, 7).map((post, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      date: post.date || date.toISOString().split("T")[0],
      topic: String(post.topic || `Post ${i + 1}`).trim(),
      category: String(post.category || "General").trim(),
      formatType: post.formatType === "video" ? "video" : "image",
      status: "draft",
      visualInstructions: String(post.visualInstructions || "").trim(),
      scriptOrCaption: {
        hook: String(post.scriptOrCaption?.hook || "").trim(),
        body: String(post.scriptOrCaption?.body || "").trim(),
        hashtags: Array.isArray(post.scriptOrCaption?.hashtags)
          ? post.scriptOrCaption.hashtags.map((t) =>
              t.startsWith("#") ? t : `#${t}`,
            )
          : [],
      },
    };
  });
}

async function generateViaPuter(userPrompt) {
  const puter = await ensurePuter();
  await ensurePuterSignedIn(puter);

  const response = await puter.ai.chat(
    [
      { role: "system", content: PLAN_SYSTEM_PROMPT },
      { role: "user", content: buildPlanUserPrompt(userPrompt) },
    ],
    { model: "gpt-5-nano" },
  );

  const text = extractMessageText(response);
  if (!text.trim()) {
    throw new Error("Puter returned an empty response");
  }

  return assignDates(parsePlanJson(text));
}

/** Server plan — posts already persisted; returns { posts, source } */
async function generateViaServer(userPrompt) {
  const result = await aiService.generatePlan(userPrompt);
  const posts = result?.data;
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("Server returned no posts");
  }
  return { posts, source: "server" };
}

/**
 * Try Puter first (real AI). On failure, use server smart generator.
 * Returns { posts, source: 'puter' | 'server' }
 */
export async function generateContentPlan(userPrompt) {
  try {
    const posts = await generateViaPuter(userPrompt);
    return { posts, source: "puter" };
  } catch (putterErr) {
    try {
      return await generateViaServer(userPrompt);
    } catch (serverErr) {
      throw new Error(
        `${puterErrorMessage(putterErr)}. Fallback also failed: ${serverErr.message}`,
      );
    }
  }
}

export async function generateMoodboardImage(topic, visualInstructions = "") {
  try {
    const puter = await ensurePuter();
    await ensurePuterSignedIn(puter);
    const prompt = MOODBOARD_IMAGE_PROMPT(topic, visualInstructions);

    const imageEl = await puter.ai.txt2img(prompt, {
      model: "gpt-image-1-mini",
      quality: "low",
    });

    const imageUrl = imageEl?.src;
    if (!imageUrl) throw new Error("No image returned");

    return {
      topic,
      imageUrl,
      style: "minimalist pastel",
      generatedAt: new Date().toISOString(),
    };
  } catch {
    const result = await aiService.generateMoodboard(topic);
    if (result?.data) return result.data;
    throw new Error("Moodboard generation failed");
  }
}
