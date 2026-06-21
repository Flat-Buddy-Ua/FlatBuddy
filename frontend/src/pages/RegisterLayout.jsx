import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MAIN from './MAIN.jsx';
import Step1 from './Step1.jsx';
import Step2 from './Step2.jsx';
import Step3 from './Step3.jsx';
import VerifyEmail from './VerifyEmail.jsx';
import ResetPassword from './ResetPassword.jsx';
import React, { useState } from 'react';
import { Card } from './Card.jsx';
import { Likes } from './Likes.jsx';
import { PaymentStatus } from './PaymentStatus.jsx';

function AppRoutes() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});

    const updateForm = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    return (
        <Routes>
            <Route path="/" element={<MAIN />} />

            {/* 🔴 РЕЖИМ РЕЄСТРАЦІЇ */}
            <Route
                path="/register"
                element={
                    <Step1
                        data={formData}
                        onChange={updateForm}
                        isEditing={false}
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
                        isEditing={true}
                    />
                }
            />

            <Route
                path="/buddies"
                element={<Card />}
            />

            <Route
                path="/buddies/:id"
                element={<Card />}
            />

            <Route
                path="/likes"
                element={<Likes />}
            />

            {/* Інші кроки редагування доступні тільки для профілю */}
            <Route path="/profile/personal" element={<Step2 />} />
            <Route path="/profile/housing" element={<Step3 />} />

            {/* Magic-link email verification landing page */}
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/payment/status/:commentId" element={<PaymentStatus />} />
        </Routes>
    );
}

export function RegisterLayout() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}