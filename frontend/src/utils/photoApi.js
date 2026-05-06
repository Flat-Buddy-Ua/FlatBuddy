import { fetchWithAuth } from './api.js';

const BASE_URL = import.meta.env.VITE_API_URL;

const PHOTOS_ENDPOINT = `${BASE_URL}/api/profile/photos/`;

const buildAbsoluteUrl = (path) => {
    if (!path) return path;
    if (/^https?:\/\//i.test(path)) return path;
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const normalize = (raw) => ({
    id: raw.id,
    url: buildAbsoluteUrl(raw.image),
});

export async function listPhotos() {
    const res = await fetchWithAuth(PHOTOS_ENDPOINT);
    if (!res.ok) {
        throw new Error(`Failed to load photos (${res.status})`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalize) : [];
}

export async function uploadPhoto(file) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetchWithAuth(PHOTOS_ENDPOINT, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const msg = errorBody.image
            ? (Array.isArray(errorBody.image) ? errorBody.image[0] : errorBody.image)
            : `Upload failed (${res.status})`;
        throw new Error(msg);
    }

    return normalize(await res.json());
}

export async function deletePhoto(id) {
    const res = await fetchWithAuth(`${PHOTOS_ENDPOINT}${id}/`, { method: 'DELETE' });
    if (!res.ok && res.status !== 404) {
        throw new Error(`Delete failed (${res.status})`);
    }
}
