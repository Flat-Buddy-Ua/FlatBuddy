import React from "react";
import { Header } from "../components/Header.jsx";
import "./BuddiesPage.css";

export function BuddiesPage() {
    return (
        <div className="landing-page">
            <Header />
            <main className="buddies-coming-soon-main">
                <h1 className="landing-title buddies-coming-soon-title">
                    <span style={{ color: 'black' }}>Т</span>
                    <span style={{ color: '#F58A3D' }}>У</span>
                    <span style={{ color: 'black' }}>Т</span>
                    <span style={{ color: '#FCD531' }}> С</span>
                    <span style={{ color: 'black' }}>К</span>
                    <span style={{ color: '#F58A3D' }}>О</span>
                    <span style={{ color: 'black' }}>Р</span>
                    <span style={{ color: '#FCD531' }}>О</span>
                    <br />
                    <span style={{ color: 'black' }}>Б</span>
                    <span style={{ color: '#F58A3D' }}>У</span>
                    <span style={{ color: 'black' }}>Д</span>
                    <span style={{ color: '#FCD531' }}>Е</span>
                    <span style={{ color: 'black' }}> Т</span>
                    <span style={{ color: '#F58A3D' }}>В</span>
                    <span style={{ color: 'black' }}>І</span>
                    <span style={{ color: '#FCD531' }}>Й</span>
                    <br />
                    <span style={{ color: 'black' }}>B</span>
                    <span style={{ color: '#F58A3D' }}>U</span>
                    <span style={{ color: 'black' }}>D</span>
                    <span style={{ color: '#FCD531' }}>D</span>
                    <span style={{ color: 'black' }}>Y</span>
                </h1>
            </main>
        </div>
    );
}
