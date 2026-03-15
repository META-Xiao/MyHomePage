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
    const weightedMap = new Map<string, number>();
    const rawMap = new Map<string, number>();
    const startTime = startDate.getTime() / 1000;
    const endTime = endDate.getTime() / 1000;

    // Paginate through all submissions (API returns max 500 per request)
    let fromSecond = 0;
    let totalFetched = 0;

    while (true) {
      const response = await axios.get(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions`, {
        params: {
          user: ATCODER_USERNAME,
          from_second: fromSecond
        },
        timeout: 15000
      });

      const batch: any[] = response.data;
      if (!batch || batch.length === 0) break;

      totalFetched += batch.length;
      console.log(`[AtCoder] Fetched ${totalFetched} submissions (batch: ${batch.length}, from_second: ${fromSecond})`);

      for (const submission of batch) {
        if (submission.result === 'AC' && submission.epoch_second >= startTime && submission.epoch_second <= endTime) {
          const date = new Date(submission.epoch_second * 1000).toISOString().split('T')[0];
          weightedMap.set(date, (weightedMap.get(date) || 0) + 2);
          rawMap.set(date, (rawMap.get(date) || 0) + 1);
        }
      }

      // If less than 500 returned, we've reached the end
      if (batch.length < 500) break;

      // Next page: use the epoch_second of the last submission + 1
      const lastEpoch = batch[batch.length - 1].epoch_second;
      fromSecond = lastEpoch + 1;
    }

    console.log(`[AtCoder] Total fetched: ${totalFetched}, active days: ${rawMap.size}`);
    return { weighted: weightedMap, raw: rawMap };
  } catch (error: any) {
    console.warn(`[AtCoder] Fetch failed: ${error.message}`);
    return { weighted: new Map(), raw: new Map() };
  }
}

