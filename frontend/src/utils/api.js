const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const config = {
        ...options,
        headers,
    };

    let response = await fetch(url, config);

    // Якщо токен прострочився (401)
    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${BASE_URL}/api/token/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken })
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    localStorage.setItem('access_token', data.access);
                    if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

                    config.headers['Authorization'] = `Bearer ${data.access}`;
                    response = await fetch(url, config);
                } else {
                    logoutUser();
                }
            } catch (error) {
                logoutUser();
            }
        } else {
            logoutUser();
        }
    }

    return response;
}

function logoutUser() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/'; // Викидаємо на головну
}