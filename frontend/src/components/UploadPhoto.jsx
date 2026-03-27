import React, { useState } from "react";

export function UploadPhoto({ onChange, maxPhotos = 5 }) {
    const [previews, setPreviews] = useState([]);
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        // Обмежуємо кількість фото
        if (files.length + selectedFiles.length > maxPhotos) {
            alert(`Максимум ${maxPhotos} фото`);
            return;
        }

        const newFiles = [...files, ...selectedFiles];
        setFiles(newFiles);

        // Створюємо preview для нових файлів
        const newPreviews = [];
        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                
                // Коли всі preview створені
                if (newPreviews.length === selectedFiles.length) {
                    setPreviews([...previews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        if (onChange) {
            onChange(newFiles);
        }
    };

    const removePhoto = (index) => {
        const newFiles = [...files];
        const newPreviews = [...previews];
        
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        
        setFiles(newFiles);
        setPreviews(newPreviews);
        
        if (onChange) {
            onChange(newFiles);
        }
    };

    return (
        <div style={{
            position: "relative",
            width: "100%",
            display: "flex",
            // justifyContent: "center",
            // alignItems: "center"
        }}>
            {/* Контейнер для фото */}
            <div style={{
                position: "relative",
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginBottom: "20px",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {/* Показуємо завантажені фото */}
                {previews.map((preview, index) => (
                    <div
                        key={index}
                        style={{
                            width: "150px",
                            height: "150px",
                            position: "relative",
                            border: "2px solid rgba(204, 221, 187, 0.5)",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${preview})`
                        }}
                    >
                        {/* Кнопка видалення */}
                        <button
                            onClick={() => removePhoto(index)}
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                background: "#F6DDD4",
                                color: "black",
                                border: "none",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* Кнопка завантаження (показуємо тільки якщо є місце) */}
                {files.length < maxPhotos && (
                    <div
                        style={{
                            width: (files.length > 0) ? "150px" : "80%",
                            height: "150px",
                            border: "2px dashed #CCCCCC",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            backgroundColor: "rgba(204, 221, 187, 0.1)",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => e.target.style.borderColor = "rgba(204, 221, 187, 1)"}
                        onMouseLeave={(e) => e.target.style.borderColor = "#CCCCCC"}
                        onClick={() => document.getElementById("multiPhotoInput").click()}
                    >
                        <div style={{ textAlign: "center" }}>
                            <div style={{ 
                                fontSize: "36px", 
                                color: "rgba(204, 221, 187, 1)",
                                marginBottom: "8px"
                            }}>
                                +
                            </div>
                            <span style={{ 
                                color: "#666666",
                                fontSize: "14px"
                            }}>
                                Додати фото
                            </span>
                            <div style={{ 
                                fontSize: "12px", 
                                color: "#999999",
                                marginTop: "4px"
                            }}>
                                ({files.length}/{maxPhotos})
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <input
                type="file"
                id="multiPhotoInput"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
    );
}