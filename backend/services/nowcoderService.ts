import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '../cache');
const CACHE_FILE = path.join(CACHE_DIR, 'nowcoder_submissions.json');
const NOWCODER_USER_ID = process.env.NOWCODER_USER_ID || '';
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

interface Submission {
  date: string;
  time: string;
  timestamp: number;
}

interface Cache {
  lastUpdate: number;
  solvedCount: number;
  totalPages: number;
  submissions: Submission[];
}

interface ActivityData {
  weighted: Map<string, number>;
  raw: Map<string, number>;
}

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function readCache(): Cache | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error: any) {
    console.warn(`[Nowcoder] Cache read failed: ${error.message}`);
  }
  return null;
}

function writeCache(data: Cache): void {
  try {
    ensureCacheDir();
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error: any) {
    console.warn(`[Nowcoder] Cache write failed: ${error.message}`);
  }
}

function isCacheValid(cache: Cache): boolean {
  if (!cache || !cache.lastUpdate || !cache.submissions) {
    return false;
  }
  return Date.now() - cache.lastUpdate < CACHE_DURATION;
}

async function getNowcoderStats(): Promise<{ solvedCount: number; totalPages: number } | null> {
  try {
    const url = `https://ac.nowcoder.com/acm/contest/profile/${NOWCODER_USER_ID}/practice-coding`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      },
      timeout: 10000
    });
    
    const solvedMatch = response.data.match(/<div class="state-num">(\d+)<\/div>[\s\S]*?<span>题已通过<\/span>/);
    const totalPagesMatch = response.data.match(/data-total="(\d+)"/);
    
    return {
      solvedCount: solvedMatch ? parseInt(solvedMatch[1]) : 0,
      totalPages: totalPagesMatch ? parseInt(totalPagesMatch[1]) : 0
    };
  } catch (error: any) {
    console.warn(`[Nowcoder] Stats fetch failed: ${error.message}`);
    return null;
  }
}

async function fetchPage(page: number): Promise<Submission[]> {
  const url = `https://ac.nowcoder.com/acm/contest/profile/${NOWCODER_USER_ID}/practice-coding?pageSize=10&page=${page}`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
        'Referer': 'https://ac.nowcoder.com/'
      },
      timeout: 15000
    });
    
    const submissions: Submission[] = [];
    const regex = /class="[^"]*font-green[^"]*"[^>]*>答案正确<\/a><\/td>[\s\S]*?<td>(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})<\/td>/g;
    let match;
    
    while ((match = regex.exec(response.data)) !== null) {
      submissions.push({
        date: match[1],
        time: match[2],
        timestamp: new Date(`${match[1]} ${match[2]}`).getTime()
      });
    }
    
    return submissions;
  } catch (error: any) {
    console.warn(`[Nowcoder] Page ${page} fetch failed: ${error.message}`);
    return [];
  }
}

async function fetchAllPages(totalPages: number): Promise<Submission[]> {
  console.log(`[Nowcoder] Fetching ${totalPages} pages...`);
  
  const allSubmissions: Submission[] = [];
  const batchSize = 5;
  
  for (let i = 1; i <= totalPages; i += batchSize) {
    const batch = [];
    const endPage = Math.min(i + batchSize - 1, totalPages);
    
    for (let page = i; page <= endPage; page++) {
      batch.push(fetchPage(page));
    }
    
    const results = await Promise.all(batch);
    results.forEach(submissions => allSubmissions.push(...submissions));
    
    if (endPage < totalPages) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`[Nowcoder] Fetched ${allSubmissions.length} submissions`);
  return allSubmissions;
}

async function fetchRecentPages(lastSolvedCount: number, currentSolvedCount: number): Promise<Submission[]> {
  const newSubmissions = currentSolvedCount - lastSolvedCount;
  
  if (newSubmissions <= 0) {
    return [];
  }
  
  const pagesToFetch = Math.ceil(newSubmissions / 10) + 1;
  const allSubmissions: Submission[] = [];
  
  for (let page = 1; page <= pagesToFetch; page++) {
    const submissions = await fetchPage(page);
    allSubmissions.push(...submissions);
    
    if (page < pagesToFetch) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return allSubmissions;
}

export async function getNowcoderActivity(startDate: Date, endDate: Date): Promise<ActivityData> {
  if (!NOWCODER_USER_ID) {
    return { weighted: new Map(), raw: new Map() };
  }
  
  const cache = readCache();
  const stats = await getNowcoderStats();
  
  if (!stats) {
    return { weighted: new Map(), raw: new Map() };
  }
  
  let submissions: Submission[] = [];
  
  if (cache && isCacheValid(cache)) {
    if (cache.solvedCount !== stats.solvedCount) {
      const newSubmissions = await fetchRecentPages(cache.solvedCount, stats.solvedCount);
      const allSubmissions = [...newSubmissions, ...cache.submissions];
      const uniqueSubmissions = Array.from(
        new Map(allSubmissions.map(s => [s.timestamp, s])).values()
      );
      
      submissions = uniqueSubmissions;
      writeCache({
        lastUpdate: Date.now(),
        solvedCount: stats.solvedCount,
        totalPages: stats.totalPages,
        submissions
      });
    } else {
      submissions = cache.submissions;
    }
  } else {
    submissions = await fetchAllPages(stats.totalPages);
    writeCache({
      lastUpdate: Date.now(),
      solvedCount: stats.solvedCount,
      totalPages: stats.totalPages,
      submissions
    });
  }
  
  const weightedMap = new Map<string, number>();
  const rawMap = new Map<string, number>();
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  
  submissions.forEach(sub => {
    if (sub.timestamp >= startTime && sub.timestamp <= endTime) {
      weightedMap.set(sub.date, (weightedMap.get(sub.date) || 0) + 2);
      rawMap.set(sub.date, (rawMap.get(sub.date) || 0) + 1);
    }
  });
  
  console.log(`[Nowcoder] ${rawMap.size} active days`);
  return { weighted: weightedMap, raw: rawMap };
}

