import { getBlogActivity } from './blogService.js';
import { getGitHubActivity } from './githubService.js';
import { getCodeforcesActivity } from './codeforcesService.js';
import { getAtCoderActivity } from './atcoderService.js';
import { getNowcoderActivity } from './nowcoderService.js';

interface HeatmapData {
  date: string;
  value: number;
  blog: number;
  github: number;
  oj: number;
  details: {
    blog: number;
    github: number;
    codeforces: number;
    nowcoder: number;
    atcoder: number;
  };
}

function calculateDateRange(): { startDate: Date; endDate: Date } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const totalDays = 365;
  const pastDays = Math.floor(totalDays * 0.95);
  const futureDays = Math.ceil(totalDays * 0.05);
  
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - pastDays);
  
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + futureDays);
  
  return { startDate, endDate };
}

export async function aggregateHeatmapData(year: number): Promise<HeatmapData[]> {
  const { startDate, endDate } = calculateDateRange();
  
  console.log(`[Heatmap] Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
  
  const [blogData, githubData, cfData, nowcoderData, atcoderData] = await Promise.all([
    getBlogActivity(startDate, endDate),
    getGitHubActivity(startDate, endDate),
    getCodeforcesActivity(startDate, endDate),
    getNowcoderActivity(startDate, endDate),
    getAtCoderActivity(startDate, endDate)
  ]);
  
  const aggregatedMap = new Map<string, {
    weightedTotal: number;
    rawBlog: number;
    rawGithub: number;
    rawCodeforces: number;
    rawNowcoder: number;
    rawAtcoder: number;
  }>();
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    aggregatedMap.set(dateStr, {
      weightedTotal: 0,
      rawBlog: 0,
      rawGithub: 0,
      rawCodeforces: 0,
      rawNowcoder: 0,
      rawAtcoder: 0
    });
  }
  
  const platformMaps = [
    { name: 'blog', data: blogData },
    { name: 'github', data: githubData },
    { name: 'codeforces', data: cfData },
    { name: 'nowcoder', data: nowcoderData },
    { name: 'atcoder', data: atcoderData }
  ];
  
  platformMaps.forEach(({ name, data }) => {
    data.weighted.forEach((value, date) => {
      const dayData = aggregatedMap.get(date);
      if (dayData) {
        dayData.weightedTotal += value;
      }
    });
    
    data.raw.forEach((value, date) => {
      const dayData = aggregatedMap.get(date);
      if (dayData) {
        const key = `raw${name.charAt(0).toUpperCase() + name.slice(1)}` as keyof typeof dayData;
        (dayData[key] as number) = value;
      }
    });
  });
  
  const result = Array.from(aggregatedMap.entries()).map(([date, data]) => ({
    date,
    value: Math.min(data.weightedTotal, 100),
    blog: data.rawBlog,
    github: data.rawGithub,
    oj: data.rawCodeforces + data.rawNowcoder + data.rawAtcoder,
    details: {
      blog: data.rawBlog,
      github: data.rawGithub,
      codeforces: data.rawCodeforces,
      nowcoder: data.rawNowcoder,
      atcoder: data.rawAtcoder
    }
  }));
  
  const activeDays = result.filter(d => d.value > 0).length;
  console.log(`[Heatmap] Complete: ${result.length} days, ${activeDays} active`);
  
  return result;
}

