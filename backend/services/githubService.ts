import axios from 'axios';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

interface ActivityData {
  weighted: Map<string, number>;
  raw: Map<string, number>;
}

export async function getGitHubActivity(startDate: Date, endDate: Date): Promise<ActivityData> {
  if (!GITHUB_TOKEN) {
    console.warn('[GitHub] Token not configured');
    return { weighted: new Map(), raw: new Map() };
  }
  
  try {
    const query = `
      query($userName: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $userName) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;
    
    const variables = {
      userName: GITHUB_USERNAME,
      from: startDate.toISOString(),
      to: endDate.toISOString()
    };
    
    const response = await axios.post('https://api.github.com/graphql', {
      query,
      variables
    }, { 
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 15000
    });
    
    if (response.data.errors) {
      throw new Error('GitHub GraphQL API error');
    }
    
    const weightedMap = new Map<string, number>();
    const rawMap = new Map<string, number>();
    const weeks = response.data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    
    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        if (day.contributionCount > 0) {
          weightedMap.set(day.date, day.contributionCount);
          rawMap.set(day.date, day.contributionCount);
        }
      });
    });
    
    console.log(`[GitHub] ${rawMap.size} active days`);
    return { weighted: weightedMap, raw: rawMap };
  } catch (error: any) {
    console.warn(`[GitHub] Fetch failed: ${error.message}`);
    return { weighted: new Map(), raw: new Map() };
  }
}

