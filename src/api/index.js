export async function fetchDestinations(page = 1, size = 10) {
  try {
    const response = await fetch(`/api/destinations?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch destinations: ' + response.status);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchDestinationById(id) {
  try {
    const response = await fetch(`/api/destinations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch destination: ' + response.status);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('token');
  let refreshToken = localStorage.getItem('refreshToken');
  
  const baseUrl = 'http://localhost:8080';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  let response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  if (response.status === 401 && refreshToken) {
    const refreshResp = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (refreshResp.ok) {
      const { accessToken } = await refreshResp.json();
      localStorage.setItem('token', accessToken);
      response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      window.location.href = '/login';
      return;
    }
  }
  return response;
}
