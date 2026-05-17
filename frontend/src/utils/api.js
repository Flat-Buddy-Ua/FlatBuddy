const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem('access_token');

    // FormData must be sent without an explicit Content-Type so the browser
    // can set `multipart/form-data; boundary=...` itself.
    const isFormData = options.body instanceof FormData;

    const headers = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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

// ── Matches / Feed ────────────────────────────────────────────────────────

export const getMatches = () =>
    fetchWithAuth(`${BASE_URL}/api/matches/`);

export const getMatch = (matchId) =>
    fetchWithAuth(`${BASE_URL}/api/matches/${matchId}/`);

export const markSeen = (matchId) =>
    fetchWithAuth(`${BASE_URL}/api/matches/${matchId}/seen/`, { method: 'POST' });

export const getFomoData = () =>
    fetchWithAuth(`${BASE_URL}/api/matches/fomo/`);

// ── Likes / Mutual matches ────────────────────────────────────────────────

export const likeUser = (toUserId) =>
    fetchWithAuth(`${BASE_URL}/api/likes/`, {
        method: 'POST',
        body: JSON.stringify({ to_user_id: toUserId }),
    });

export const unlikeUser = (userId) =>
    fetchWithAuth(`${BASE_URL}/api/likes/${userId}/`, { method: 'DELETE' });

export const getIncomingLikes = () =>
    fetchWithAuth(`${BASE_URL}/api/likes/incoming/`);

export const getOutgoingLikes = () =>
    fetchWithAuth(`${BASE_URL}/api/likes/outgoing/`);

export const getUserMatches = () =>
    fetchWithAuth(`${BASE_URL}/api/user-matches/`);