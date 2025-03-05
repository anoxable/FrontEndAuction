export async function refreshAccessToken() {
    try {
      const response = await fetch('http://localhost:3001/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',  
      });
  
      if (response.ok) {
        // Refresh successful, do nothing as new tokens are already in cookies
        console.log('good')
        return;
      } else {
        // Refresh failed, handle error (e.g., redirect to login)
        console.error('Token refresh failed');
        // ... your error handling logic ...
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      // ... your error handling logic ...
    }
  }