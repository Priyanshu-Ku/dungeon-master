import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/leetcode
// TODO: Replace with real LeetCode API call
// Returns mocked stats used by lib/leetcode.ts → mapStatsToPlayer()
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    easySolved: 42,
    mediumSolved: 18,
    hardSolved: 5,
    totalSolved: 65,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/leetcode
// Proxies real LeetCode GraphQL for username-based lookups.
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          activeBadge {
            displayName
            icon
          }
          badges {
            id
            displayName
            icon
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://leetcode.com/',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({ error: data.errors[0].message }, { status: 400 });
    }

    const matchedUser = data.data.matchedUser;
    if (!matchedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Process data for the game
    const totalSolved = matchedUser.submitStatsGlobal.acSubmissionNum.find(
      (s: any) => s.difficulty === 'All'
    )?.count || 0;

    return NextResponse.json({
      totalSolved,
      badges: matchedUser.badges || [],
      activeBadge: matchedUser.activeBadge || null,
    });
  } catch (error) {
    console.error('LeetCode Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
