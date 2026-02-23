import axios from 'axios';

const ATCODER_USERNAME = process.env.ATCODER_USERNAME || '';

interface ActivityData {
  weighted: Map<string, number>;
  raw: Map<string, number>;
}

export async function getAtCoderActivity(startDate: Date, endDate: Date): Promise<ActivityData> {
  if (!ATCODER_USERNAME) {
    return { weighted: new Map(), raw: new Map() };
  }
  
  try {
    const response = await axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions`, {
      params: {
        user: ATCODER_USERNAME,
        from_second: 0
      },
      timeout: 10000
    });
    
    const submissions = response.data;
    const weightedMap = new Map<string, number>();
    const rawMap = new Map<string, number>();
    const startTime = startDate.getTime() / 1000;
    const endTime = endDate.getTime() / 1000;
    
    submissions.forEach((submission: any) => {
      if (submission.epoch_second >= startTime && submission.epoch_second <= endTime) {
        const date = new Date(submission.epoch_second * 1000).toISOString().split('T')[0];
        weightedMap.set(date, (weightedMap.get(date) || 0) + 2);
        rawMap.set(date, (rawMap.get(date) || 0) + 1);
      }
    });
    
    console.log(`[AtCoder] ${rawMap.size} active days`);
    return { weighted: weightedMap, raw: rawMap };
  } catch (error: any) {
    console.warn(`[AtCoder] Fetch failed: ${error.message}`);
    return { weighted: new Map(), raw: new Map() };
  }
}

