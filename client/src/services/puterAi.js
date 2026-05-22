/**
 * Puter.js AI with server fallback when Puter is unavailable.
 * https://docs.puter.com/AI/
 */

import { aiService } from "./api";

const PLAN_SYSTEM_PROMPT = `You are ContentChef, an expert social media strategist and short-form content producer.

Your job: turn a creator's brief into a rich, detailed 7-day content calendar that gives the creator everything they need to film and publish.

Rules:
- Match the creator's niche, audience, tone, and platform (Instagram, TikTok, LinkedIn, etc.) from their brief.
- Hooks must be scroll-stopping — concrete numbers, curiosity gaps, or pattern interrupts. Up to 180 characters.
- Captions/bodies must be SUBSTANTIVE: 5-8 sentences (or short paragraphs) that deliver real value — context, a teachable insight, an example, a concrete takeaway, and a clear CTA. Do not write filler.
- For videos, structure the body as a mini-script with beats (intro → main point → example → CTA) the creator can read aloud.
- Alternate "video" and "image" formatType across the week when it makes sense.
- Categories must fit the niche (not generic labels unless the brief is generic).
- visualInstructions: 2-3 sentences describing the visual direction, composition, color palette, and any on-screen text.
- hashtags: 5-8 strings, each starting with #, niche-relevant and varied per post (never reuse the same list for every post).
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
      "visualInstructions": "2-3 sentences: composition, palette, on-screen text, and overall mood",
      "scriptOrCaption": {
        "hook": "Opening line up to 180 characters — punchy, specific, scroll-stopping",
        "body": "5-8 sentences (or short paragraphs). For videos write a mini-script with clear beats: open, main point, example, takeaway, CTA. For images write a value-packed caption that teaches, tells a story, or sparks discussion — ending with a clear call to action.",
        "hashtags": ["#Example", "#NicheTag", "#Five", "#ToEight", "#Total"]
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

async function shrinkImage(srcUrl, maxDimension = 768, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const longest = Math.max(img.width, img.height) || 1;
      const scale = Math.min(1, maxDimension / longest);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      try {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image for resize"));
    img.src = srcUrl;
  });
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

    const shrunk = await shrinkImage(imageUrl).catch(() => imageUrl);

    return {
      topic,
      imageUrl: shrunk,
      style: "minimalist pastel",
      generatedAt: new Date().toISOString(),
    };
  } catch {
    const result = await aiService.generateMoodboard(topic);
    const data = result?.data;
    if (data) {
      if (data.imageUrl) {
        const shrunk = await shrinkImage(data.imageUrl).catch(() => data.imageUrl);
        return { ...data, imageUrl: shrunk };
      }
      return data;
    }
    throw new Error("Moodboard generation failed");
  }
}
