// src/config/configLoader.js
const GIST_ID = '49ae49feb5b086f64cf6f7f7e8752c3e';
const GIST_FILE = 'jeevika-api-config.json';
const CACHE_KEY = 'jeevika_api_config';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Export function to clear cache
export const clearApiConfigCache = () => {
  sessionStorage.removeItem(CACHE_KEY);
  console.log('API config cache cleared');
};

export const fetchApiConfig = async () => {
  try {
    // Check cache first
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    // Fetch from GitHub Gist API
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    if (!response.ok) throw new Error('Failed to fetch config');
    
    const gistData = await response.json();
    const fileContent = gistData.files[GIST_FILE].content;
    const config = JSON.parse(fileContent);

    // Cache the result
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      data: config,
      timestamp: Date.now()
    }));

    return config;
  } catch (error) {
    console.error('Failed to fetch remote config:', error);
    
    // Fallback to cached value if available
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached).data;
    }
    
    // Last resort fallback
    return { 
      apiUrl: 'http://localhost:5000',
      status: 'offline' 
    };
  }
};
