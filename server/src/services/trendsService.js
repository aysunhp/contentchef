const config = require('../config');

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

const isAnthropicConfigured = () =>
  Boolean(config.anthropic.apiKey && config.anthropic.apiKey.trim());

const extractText = (content) => {
  if (!Array.isArray(content)) return '';
  return content
    .filter((block) => block?.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('\n')
    .trim();
};

const parseJsonFromText = (text) => {
  if (!text) return null;
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
};

const callAnthropic = async ({ prompt, useWebSearch, maxTokens = 2048 }) => {
  const body = {
    model: config.anthropic.model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  };

  if (useWebSearch) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }

  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': config.anthropic.apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${text.slice(0, 200)}`);
  }

  const json = await response.json();
  return json;
};

const buildTrendDiscoveryPrompt = (niche, platform) =>
  `Search the web for trending topics, sounds, hashtags, and content formats on ${platform} right now in ${niche}. Find 5 specific trends that are currently gaining traction. Return ONLY JSON:
{
  "trends": [
    { "name": "<trend name>", "why_trending": "<one sentence>", "window": "<how long it will stay hot>" }
  ]
}`;

const buildIdeasPrompt = (trends, niche, platform) =>
  `Given these trending topics: ${JSON.stringify(trends)}, generate 5 content ideas that hijack each trend for a ${niche} creator on ${platform}. Return ONLY JSON:
{
  "ideas": [
    {
      "trend": "<trend name>",
      "hook": "<first line of caption>",
      "angle": "<unique take that makes it feel original not bandwagon>",
      "caption": "<full caption with hashtags>",
      "urgency": "<post within X days>"
    }
  ]
}`;

const findTrends = async ({ niche, platform }) => {
  if (!isAnthropicConfigured()) {
    return mockTrends(niche, platform);
  }

  const prompt = buildTrendDiscoveryPrompt(niche, platform);
  const response = await callAnthropic({ prompt, useWebSearch: true, maxTokens: 2048 });
  const text = extractText(response?.content);
  const parsed = parseJsonFromText(text);

  if (!parsed?.trends || !Array.isArray(parsed.trends) || parsed.trends.length === 0) {
    return mockTrends(niche, platform);
  }
  return { trends: parsed.trends.slice(0, 5) };
};

const generateIdeas = async ({ trends, niche, platform }) => {
  if (!isAnthropicConfigured()) {
    return mockIdeas(trends, niche, platform);
  }

  const prompt = buildIdeasPrompt(trends, niche, platform);
  const response = await callAnthropic({ prompt, useWebSearch: false, maxTokens: 2048 });
  const text = extractText(response?.content);
  const parsed = parseJsonFromText(text);

  if (!parsed?.ideas || !Array.isArray(parsed.ideas) || parsed.ideas.length === 0) {
    return mockIdeas(trends, niche, platform);
  }
  return { ideas: parsed.ideas.slice(0, 5) };
};

const mockTrends = (niche, platform) => ({
  trends: [
    {
      name: `${niche} micro-tutorials (15-sec edits)`,
      why_trending: `Short ${niche} explainers are dominating ${platform} feeds this week.`,
      window: '5-7 days',
    },
    {
      name: 'Day-in-the-life voiceover trend',
      why_trending: `Authentic voiceover content is outperforming polished posts in ${niche}.`,
      window: '7-10 days',
    },
    {
      name: 'Before & after split-screen',
      why_trending: `Split-screen transformation reels for ${niche} are getting strong shares.`,
      window: '3-4 days',
    },
    {
      name: 'POV expert reaction',
      why_trending: `POV reactions to common ${niche} mistakes are sparking comments.`,
      window: '6-8 days',
    },
    {
      name: 'Listicle carousels',
      why_trending: `5-point ${niche} carousels are seeing high save rates on ${platform}.`,
      window: '10-14 days',
    },
  ],
});

const mockIdeas = (trends, niche, platform) => {
  const trendList = Array.isArray(trends) && trends.length > 0
    ? trends
    : mockTrends(niche, platform).trends;

  return {
    ideas: trendList.slice(0, 5).map((trend, i) => {
      const name = trend?.name || `Trend ${i + 1}`;
      return {
        trend: name,
        hook: `The ${niche} angle on "${name}" nobody is talking about.`,
        angle: `Apply the trend specifically to a ${niche} pain point your audience faces this week.`,
        caption: `Here's how ${niche} creators on ${platform} can ride "${name}" without sounding like everyone else. Quick breakdown in caption. #${niche.replace(/\s+/g, '')} #${platform} #ContentChef #Trending`,
        urgency: `post within ${2 + i} days`,
      };
    }),
  };
};

module.exports = { findTrends, generateIdeas };
