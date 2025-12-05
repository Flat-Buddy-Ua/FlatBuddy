import React from 'react';

export function Header() {
  return (
    <div
        style={{
            width: "100%",
            backgroundColor: "#F6DDD4",
            padding: "20px 40px",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
        }}
    >
        {/* LEFT SIDE */}
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
            <span style={{fontFamily: "Seenonim, sans-serif", fontSize: 18}}>Home</span>
            <span style={{fontFamily: "Seenonim, sans-serif", fontSize: 18}}>Find a roommate</span>
        </div>

        {/* CENTER (LOGO FB) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{fontFamily: "Seenonim, sans-serif", fontSize: 32}}>FB</span>
        </div>

        {/* RIGHT SIDE */}
        <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "24px",
                alignItems: "center",
            }}
        >
            <span style={{ fontFamily: 'Seenonim', fontSize: 18}}>Rent an appartment</span>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0px",
                }}
            >    
                <div
                    className="vector1"
                    style={
                        {marginBottom: '-4px'}
                    }
                    dangerouslySetInnerHTML={{__html: `<svg preserveAspectRatio="none" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.17909 0.0232763C7.12562 0.0366448 6.85155 0.0834365 6.57749 0.123543C4.24462 0.504556 2.05881 2.08877 0.922453 4.22779C0.24064 5.50452 0 6.51387 0 8.01118C0 8.76653 0.0267378 9.20101 0.12032 9.61545C0.815502 12.8307 3.29543 15.2638 6.54407 15.9055C7.23257 16.0459 8.87694 16.0258 9.58549 15.8721C12.8007 15.1769 15.2338 12.697 15.8755 9.44834C15.929 9.18096 15.9691 8.56599 15.9691 8.01118C15.9691 7.45637 15.929 6.84141 15.8755 6.57403C15.2405 3.37218 12.8609 0.898938 9.71918 0.183703C9.19779 0.0633828 7.45984 -0.0502524 7.17909 0.0232763ZM9.01731 2.22914C10.1871 2.43636 11.2633 2.99785 12.1256 3.86683C14.4317 6.17296 14.4317 9.84941 12.1256 12.1555C9.81944 14.4617 6.16306 14.4684 3.84355 12.1622C1.53074 9.86946 1.52405 6.17296 3.83687 3.86683C5.21386 2.48983 7.09219 1.89492 9.01731 2.22914Z" fill="black"/>
                    </svg>`
                }}/>
                <div
                    className="vector2"
                    style={{margin: 0}}
                    dangerouslySetInnerHTML={{__html: `<svg preserveAspectRatio="none" width="28" height="12" viewBox="0 0 28 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.3274 0.103511C4.35513 0.41988 2.45018 1.63151 1.29914 3.3076C0.74044 4.12208 0.269251 5.32025 0.100969 6.3636C-0.0336564 7.18481 -0.0336564 8.87436 0.100969 9.39267C0.403876 10.5504 1.30587 11.4457 2.47038 11.7486C2.80694 11.8361 4.32821 11.8496 13.9405 11.8496C21.0285 11.8496 25.1548 11.8227 25.3836 11.7823C26.6155 11.5534 27.6992 10.4697 27.9348 9.23112C28.0358 8.70608 28.0156 7.13769 27.9011 6.39725C27.4165 3.16624 24.8451 0.588162 21.6276 0.103511C20.6987 -0.037847 7.2092 -0.0311149 6.3274 0.103511ZM21.742 2.30464C23.2229 2.7489 24.2191 3.46915 24.973 4.62693C25.626 5.61642 25.8144 6.3434 25.8144 7.85794C25.8144 9.12342 25.7942 9.19073 25.35 9.52056L25.1682 9.66192H14.0011H2.83387L2.65212 9.52056C2.23478 9.21092 2.18766 9.08976 2.16747 8.12719C2.15401 7.63581 2.18093 7.01653 2.22132 6.73382C2.58481 4.45864 4.2609 2.72198 6.52934 2.25752C6.87936 2.18347 8.41409 2.17001 14.1693 2.17674C20.665 2.1902 21.4055 2.20367 21.742 2.30464Z" fill="black"/>
                    </svg>`
                }} />
            </div>
        </div>
    </div>
  );
}