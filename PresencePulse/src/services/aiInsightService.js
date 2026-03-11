import axios from 'axios';
import { CLAUDE_KEY } from '../constants/apiKeys';

// STEP 3: Create AI Insight Service
export function buildBehaviorSummary(metrics, patterns) {
    // NEVER send raw package names to the LLM. Map package names to generic categories.
    const packageCategoryMap = {
        'com.instagram.android': 'Social Media',
        'com.whatsapp': 'Messaging',
        'com.google.android.youtube': 'Video',
        'com.linkedin.android': 'Professional Social',
        'com.snapchat.android': 'Social Media',
        'com.reddit.frontpage': 'Social Media'
    };

    const mapPackageToCategory = (packageName) => {
        return packageCategoryMap[packageName] || "Unknown App Category";
    };

    return {
        micro_checks_today: metrics?.microChecks || 0,
        bursts_today: metrics?.burstEvents || 0,
        presence_score: metrics?.presenceScore || 100,
        worst_hour_today: patterns?.vulnerableHour || -1,
        top_trigger_category: mapPackageToCategory(patterns?.topTrigger),
        phubbing_events_today: metrics?.phubbingEvents || 0,
        days_tracked: patterns?.daysTracked || 1,
        avg_score_this_week: patterns?.avgScoreThisWeek || metrics?.presenceScore || 100,
        best_score_this_week: patterns?.bestScoreThisWeek || metrics?.presenceScore || 100,
        vulnerable_hour: patterns?.vulnerableHour || -1,
        improvement_streak_days: patterns?.improvementStreakDays || 0,
        total_social_context_minutes: metrics?.totalSocialContextMinutes || 0
    };
}

// STEP 6: Implement Fallback Insight
export function getFallbackInsight(metrics) {
    const score = metrics?.presenceScore || 100;
    if (score >= 80) {
        return "Great job staying present today. Your discipline is paying off—keep protecting your focus.";
    }
    if (score >= 60) {
        return "You had some moments of drift today, but you're doing okay. Try to notice what triggers your phone checks tomorrow.";
    }
    return "Today was heavily fragmented by phone use. Tomorrow, try putting your phone in another room during your most vulnerable hours to regain your focus.";
}

// STEP 4 & 5: Implement generateDailyInsight and call API
export async function generateDailyInsight(metrics, patterns) {
    const summary = buildBehaviorSummary(metrics, patterns);

    const prompt = `Act as a warm, non-judgmental digital wellness coach specializing in mindful phone habits.

Here is the user's behavioral summary:
- Micro-checks: ${summary.micro_checks_today}
- Bursts: ${summary.bursts_today}
- Presence Score: ${summary.presence_score}
- Worst Hour: ${summary.worst_hour_today}
- Top Trigger Category: ${summary.top_trigger_category}
- Phubbing Events: ${summary.phubbing_events_today}
- Weekly Average Score: ${summary.avg_score_this_week}
- Improvement Streak: ${summary.improvement_streak_days} days

Provide exactly 4 sentences:
1. One sentence acknowledging today's behavioral pattern.
2. One sentence explaining the likely emotional trigger (based on their top trigger category).
3. One sentence suggesting a concrete action tomorrow.
4. One sentence encouraging the user.

Rules:
- Total response under 80 words.
- No bullet points.
- No numbered lists.
- Just natural sentences.`;

    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: "claude-haiku-4-5-20251001",
                max_tokens: 200,
                messages: [{ role: "user", content: prompt }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': CLAUDE_KEY,
                    'anthropic-version': '2023-06-01'
                },
                timeout: 15000
            }
        );

        console.log('[PresencePulse] AI insight generated');
        return response.data.content[0].text;
    } catch (error) {
        console.log('[PresencePulse] AI fallback triggered');
        return getFallbackInsight(metrics);
    }
}
