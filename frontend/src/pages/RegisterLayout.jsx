import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MAIN from './MAIN.jsx';
import Step1 from './Step1.jsx';
// import Step2 from './Step2.jsx';
// import Step3 from './Step3.jsx';
import React, { useState } from 'react';
import { Card } from './Card.jsx';

export function RegisterLayout() {
    const [formData, setFormData] = useState({});

    const updateForm = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    return (
        <BrowserRouter>
            <Routes>
				<Route path="/" element={<MAIN />} />

                {/* 🔴 РЕЖИМ РЕЄСТРАЦІЇ */}
                <Route 
                    path="/register" 
                    element={
                        <Step1 
                            data={formData} 
                            onChange={updateForm} 
                            isEditing={false} /* Прапорець: це перша реєстрація */
                        />
                    } 
                />

                {/* 🟢 РЕЖИМ РЕДАГУВАННЯ ПРОФІЛЮ (для залогінених) */}
                <Route 
                    path="/profile/details" 
                    element={
                        <Step1 
                            data={formData} 
                            onChange={updateForm} 
                            isEditing={true} /* Прапорець: це режим редагування */
                        />
                    } 
                />

                <Route
                    path="/buddies"
                    element={<Card />}
                />

                {/* Інші кроки редагування доступні тільки для профілю */}

                {/* <Route path="/profile/step-2" element={<Step2 data={formData} />} />
                <Route path="/profile/step-3" element={<Step3 data={formData} />} /> */}

				{/* Решта сторінок */}
            </Routes>
        </BrowserRouter>
    );
}