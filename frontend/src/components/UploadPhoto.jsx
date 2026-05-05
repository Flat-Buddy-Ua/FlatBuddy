import React, { useEffect, useRef, useState } from "react";
import { listPhotos, uploadPhoto, deletePhoto } from "../utils/photoApi.js";
import "./UploadPhoto.css";

const MAX_PHOTOS = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/**
 * UploadPhoto — synced with backend.
 *
 *  Lifecycle:
 *   - on mount: GET /api/profile/photos/ → render existing photos
 *   - on +: open file dialog → for each file: client-side validate, then POST → append to state
 *   - on ×: DELETE /api/profile/photos/<id>/ → remove from state
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
        e.target.value = '';

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
            setPhotos((prev) => prev.filter((p) => p.tempId !== item.tempId));
            if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url);
            return;
        }

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
        <div className="upload-photo-root">
            <div className="upload-photo-grid">
                {photos.map((item) => {
                    const key = item.id ?? item.tempId;
                    const tileClass = [
                        'upload-photo-tile',
                        item.status === 'uploading' && 'upload-photo-tile--uploading',
                        item.status === 'failed' && 'upload-photo-tile--failed',
                    ].filter(Boolean).join(' ');
                    return (
                        <div
                            key={key}
                            className={tileClass}
                            style={{ backgroundImage: `url(${item.url})` }}
                        >
                            <button
                                type="button"
                                onClick={() => handleRemove(item)}
                                className="upload-photo-remove"
                                aria-label="Видалити фото"
                            >×</button>
                            {item.status === 'uploading' && (
                                <div className="upload-photo-overlay">Завантаження…</div>
                            )}
                            {item.status === 'failed' && (
                                <div className="upload-photo-overlay upload-photo-overlay--error">
                                    {item.error}
                                </div>
                            )}
                        </div>
                    );
                })}

                {photos.length < MAX_PHOTOS && (
                    <div
                        className={`upload-photo-add${photos.length === 0 ? ' upload-photo-add--first' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="upload-photo-add-inner">
                            <div className="upload-photo-add-plus">+</div>
                            <span className="upload-photo-add-label">Додати фото</span>
                            <div className="upload-photo-add-counter">
                                ({photos.length}/{MAX_PHOTOS})
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {loadError && (
                <div className="upload-photo-error">{loadError}</div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                className="upload-photo-input"
                onChange={handleFileChange}
            />
        </div>
    );
}
