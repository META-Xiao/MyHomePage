import axios from 'axios';

const MX_SPACE_API = process.env.MX_SPACE_API || '';
const MX_SPACE_TOKEN = process.env.MX_SPACE_TOKEN || '';

interface ActivityData {
  weighted: Map<string, number>;
  raw: Map<string, number>;
}

export async function getBlogActivity(startDate: Date, endDate: Date): Promise<ActivityData> {
  try {
    const allPosts: any[] = [];
    let page = 1;
    const pageSize = 50;
    
    // Fetch all posts with pagination
    while (true) {
      const response = await axios.get(`${MX_SPACE_API}/posts`, {
        headers: {
          'Authorization': `Bearer ${MX_SPACE_TOKEN}`,
          'User-Agent': 'Mozilla/5.0'
        },
        params: {
          page,
          size: pageSize
        },
        timeout: 15000
      });
      
      const posts = response.data.data || [];
      if (posts.length === 0) break;
      
      allPosts.push(...posts);
      
      // Check if we have more pages
      const total = response.data.pagination?.total || 0;
      if (page * pageSize >= total) break;
      
      page++;
    }
    
    const weightedMap = new Map<string, number>();
    const rawMap = new Map<string, number>();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    
    allPosts.forEach((post: any) => {
      const createdDate = new Date(post.created).toISOString().split('T')[0];
      const createdTime = new Date(post.created).getTime();
      
      if (createdTime >= startTime && createdTime <= endTime) {
        weightedMap.set(createdDate, (weightedMap.get(createdDate) || 0) + 5);
        rawMap.set(createdDate, (rawMap.get(createdDate) || 0) + 1);
      }
      
      if (post.modified) {
        const modifiedDate = new Date(post.modified).toISOString().split('T')[0];
        const modifiedTime = new Date(post.modified).getTime();
        
        if (modifiedTime >= startTime && modifiedTime <= endTime && modifiedDate !== createdDate) {
          weightedMap.set(modifiedDate, (weightedMap.get(modifiedDate) || 0) + 2);
          rawMap.set(modifiedDate, (rawMap.get(modifiedDate) || 0) + 1);
        }
      }
    });
    
    console.log(`[Blog] ${rawMap.size} active days (${allPosts.length} posts)`);
    return { weighted: weightedMap, raw: rawMap };
  } catch (error: any) {
    console.warn(`[Blog] Fetch failed: ${error.message}`);
    return { weighted: new Map(), raw: new Map() };
  }
}

