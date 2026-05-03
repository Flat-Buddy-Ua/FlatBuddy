import React, { useEffect, useRef, useState } from "react";
import { listPhotos, uploadPhoto, deletePhoto } from "../utils/photoApi.js";

const MAX_PHOTOS = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const tileBaseStyle = {
    width: '150px',
    height: '150px',
    position: 'relative',
    border: '2px solid rgba(204, 221, 187, 0.5)',
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
};

const removeBtnStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: '#F6DDD4',
    color: 'black',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter',
    fontSize: '12px',
    textAlign: 'center',
    padding: '4px',
};

/**
 * UploadPhoto — synced with backend.
 *
 *  Lifecycle:
 *   - on mount: GET /api/profile/photos/ → render existing photos
 *   - on +: open file dialog → for each file: client-side validate, then POST → append to state
 *   - on ×: DELETE /api/profile/photos/<id>/ → remove from state
 *
 *  Each item in `photos` state has shape: { id, url, status, error?, localPreview? }.
 *  status: 'saved' | 'uploading' | 'failed'.
 *
 *  Parent gets onChange(photos) with the saved-only items, so it can compute "≥1 photo".
 */
export function UploadPhoto({ onChange }) {
    const [photos, setPhotos] = useState([]);
    const [loadError, setLoadError] = useState('');
    const fileInputRef = useRef(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const existing = await listPhotos();
                if (cancelled) return;
                const items = existing.map((p) => ({ ...p, status: 'saved' }));
                setPhotos(items);
            } catch (err) {
                if (!cancelled) setLoadError(err.message || 'Не вдалося завантажити фото');
            }
        })();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        onChangeRef.current?.(photos.filter((p) => p.status === 'saved'));
    }, [photos]);

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Тільки JPG / PNG';
        }
        if (file.size > MAX_SIZE_BYTES) {
            return 'Розмір файлу до 5 МБ';
        }
        return null;
    };

    const handleFileChange = async (e) => {
        const selected = Array.from(e.target.files || []);
        e.target.value = ''; // reset so picking the same file again works

        const slotsLeft = MAX_PHOTOS - photos.length;
        if (slotsLeft <= 0) return;
        const accepted = selected.slice(0, slotsLeft);

        const placeholders = accepted.map((file) => ({
            tempId: `tmp-${Date.now()}-${Math.random()}`,
            url: URL.createObjectURL(file),
            status: 'uploading',
            file,
        }));

        setPhotos((prev) => [...prev, ...placeholders]);

        // Upload sequentially to keep UI feedback predictable; switch to Promise.all if speed becomes an issue
        for (const placeholder of placeholders) {
            const validationError = validateFile(placeholder.file);
            if (validationError) {
                setPhotos((prev) => prev.map((p) =>
                    p.tempId === placeholder.tempId
                        ? { ...p, status: 'failed', error: validationError }
                        : p
                ));
                continue;
            }
            try {
                const saved = await uploadPhoto(placeholder.file);
                setPhotos((prev) => prev.map((p) => {
                    if (p.tempId !== placeholder.tempId) return p;
                    URL.revokeObjectURL(p.url);
                    return { id: saved.id, url: saved.url, status: 'saved' };
                }));
            } catch (err) {
                setPhotos((prev) => prev.map((p) =>
                    p.tempId === placeholder.tempId
                        ? { ...p, status: 'failed', error: err.message || 'Не вдалося завантажити' }
                        : p
                ));
            }
        }
    };

    const handleRemove = async (item) => {
        if (item.status === 'failed' || item.status === 'uploading') {
            // Local-only entries — just drop client-side
            setPhotos((prev) => prev.filter((p) => p.tempId !== item.tempId));
            if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url);
            return;
        }

        // Optimistic remove; restore on failure
        const snapshot = photos;
        setPhotos((prev) => prev.filter((p) => p.id !== item.id));
        try {
            await deletePhoto(item.id);
        } catch (err) {
            setPhotos(snapshot);
            setLoadError(err.message || 'Не вдалося видалити фото');
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex' }}>
            <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                marginBottom: '20px',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {photos.map((item) => {
                    const key = item.id ?? item.tempId;
                    return (
                        <div
                            key={key}
                            style={{
                                ...tileBaseStyle,
                                backgroundImage: `url(${item.url})`,
                                opacity: item.status === 'uploading' ? 0.7 : 1,
                                borderColor: item.status === 'failed' ? '#ff3333' : tileBaseStyle.border,
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => handleRemove(item)}
                                style={removeBtnStyle}
                                aria-label="Видалити фото"
                            >×</button>
                            {item.status === 'uploading' && (
                                <div style={overlayStyle}>Завантаження…</div>
                            )}
                            {item.status === 'failed' && (
                                <div style={{ ...overlayStyle, background: 'rgba(255, 51, 51, 0.6)' }}>
                                    {item.error}
                                </div>
                            )}
                        </div>
                    );
                })}

                {photos.length < MAX_PHOTOS && (
                    <div
                        style={{
                            width: photos.length > 0 ? '150px' : '80%',
                            height: '150px',
                            border: '2px dashed #CCCCCC',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(204, 221, 187, 0.1)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(204, 221, 187, 1)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#CCCCCC'}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '36px', color: 'rgba(204, 221, 187, 1)', marginBottom: '8px' }}>+</div>
                            <span style={{ color: '#666666', fontSize: '14px' }}>Додати фото</span>
                            <div style={{ fontSize: '12px', color: '#999999', marginTop: '4px' }}>
                                ({photos.length}/{MAX_PHOTOS})
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {loadError && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    color: '#ff3333',
                    fontSize: '12px',
                    fontFamily: 'Inter',
                    textAlign: 'center',
                }}>
                    {loadError}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}
