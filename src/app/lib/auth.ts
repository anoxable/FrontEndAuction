type RequestConfig = {
  url: string;
  method?: string;
  headers?: HeadersInit;
  body?: unknown;
};

// Track refresh state to prevent multiple refreshes
let isRefreshing = false;
let refreshPromise: Promise<Response> | null = null;
let pendingRequests: (() => void)[] = [];

async function refreshToken() {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  
  refreshPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',  // Important for cookies
  }).then(response => {
    if (!response.ok) {
      throw new Error('Refresh token failed');
    }
    return response;
  }).finally(() => {
    isRefreshing = false;
    refreshPromise = null;
    
    // Resolve all pending requests
    pendingRequests.forEach(cb => cb());
    pendingRequests = [];
  });

  return refreshPromise;
}

export async function fetchWithAuth<T>(config: RequestConfig): Promise<T> {
  const headers = new Headers(config.headers);

  if (config.body && typeof config.body === 'object') {
    headers.set('Content-Type', 'application/json');
  }

  async function makeRequest(): Promise<Response> {
    return fetch(config.url, {
      method: config.method || 'GET',
      headers,
      body: config.body ? JSON.stringify(config.body) : undefined,
      credentials: 'include',  // Ensure cookies are sent
    });
  }

  let response = await makeRequest();

  if (response.status === 401) {
    console.log('Token expired, attempting refresh');

    if (!isRefreshing) {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Refresh token failed, redirecting to login');
        throw error; // Handle logout in UI
      }
    } else {
      // Wait for refresh to complete
      await new Promise<void>(resolve => pendingRequests.push(resolve));
    }

    // Retry request after successful refresh
    response = await makeRequest();
  }

  // ✅ FIX: Parse and return the data, not Response
  const data = (await response.json()) as T; 
  return data;
}