import axios from 'axios';

const CODEFORCES_HANDLE = process.env.CODEFORCES_HANDLE || '';

interface ActivityData {
  weighted: Map<string, number>;
  raw: Map<string, number>;
}

export async function getCodeforcesActivity(startDate: Date, endDate: Date): Promise<ActivityData> {
  if (!CODEFORCES_HANDLE) {
    return { weighted: new Map(), raw: new Map() };
  }
  
  try {
    const response = await axios.get(`https://codeforces.com/api/user.status`, {
      params: {
        handle: CODEFORCES_HANDLE,
        from: 1,
        count: 10000
      },
      timeout: 10000
    });
    
    if (response.data.status !== 'OK') {
      throw new Error('Codeforces API error');
    }
    
    const submissions = response.data.result;
    const weightedMap = new Map<string, number>();
    const rawMap = new Map<string, number>();
    const startTime = startDate.getTime() / 1000;
    const endTime = endDate.getTime() / 1000;
    
    submissions.forEach((submission: any) => {
      if (submission.creationTimeSeconds >= startTime && submission.creationTimeSeconds <= endTime) {
        const date = new Date(submission.creationTimeSeconds * 1000).toISOString().split('T')[0];
        weightedMap.set(date, (weightedMap.get(date) || 0) + 2);
        rawMap.set(date, (rawMap.get(date) || 0) + 1);
      }
    });
    
    console.log(`[Codeforces] ${rawMap.size} active days`);
    return { weighted: weightedMap, raw: rawMap };
  } catch (error: any) {
    console.warn(`[Codeforces] Fetch failed: ${error.message}`);
    return { weighted: new Map(), raw: new Map() };
  }
}

