import React, { useState, useRef, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import './CitySelector.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function CitySelector({ onCitySelect, onChange, value }) {
    const [selectedValue, setSelectedValue] = useState(null);
    const debounceTimeout = useRef(null);

    useEffect(() => {
        if (value) setSelectedValue(value);
    }, [value]);

    const loadOptions = (inputValue) => {
        return new Promise((resolve) => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }

            debounceTimeout.current = setTimeout(async () => {
                if (!inputValue || inputValue.trim().length < 2) {
                    resolve([]);
                    return;
                }

                try {
                    const response = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(inputValue.trim())}.json?types=place&country=ua&language=uk&access_token=${MAPBOX_TOKEN}`
                    );
                    
                    const data = await response.json();
                    
                    const options = data.features.map(feature => ({
                        label: feature.place_name_uk || feature.place_name || feature.text, 
                        value: feature.text,
                    }));
                    
                    resolve(options);
                } catch (error) {
                    console.error("Mapbox API Error:", error);
                    resolve([]); 
                }
            }, 500);
        });
    };

    const handleChange = (selectedOption) => {
        setSelectedValue(selectedOption);
        const callback = onCitySelect || onChange;
        if (callback) {
            callback(selectedOption || null);
        }
    };

    return (
        <AsyncSelect
            cacheOptions
            value={selectedValue} 
            loadOptions={loadOptions}
            onChange={handleChange}
            placeholder="Звідки ви?"
            
            noOptionsMessage={({ inputValue }) => {
                if (!inputValue) return "Почніть вводити назву...";
                if (inputValue.length < 2) return "Введіть хоча б 2 літери...";
                return "Місто не знайдено";
            }}
            loadingMessage={() => "Шукаємо..."}
            
            menuPortalTarget={document.body}
            menuPosition="fixed"
            
            styles={{
                control: (provided) => ({
                    ...provided,
                    boxSizing: 'border-box',
                    minHeight: '44px',
                    height: '100%',
                    paddingLeft: '10px',
                    border: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    fontSize: '16px',
                    fontFamily: 'Inter',
                    cursor: 'text'
                }),
                singleValue: (provided) => ({
                    ...provided,
                    color: 'black',
                }),
                menuPortal: (base) => ({
                    ...base,
                    zIndex: 99999,
                }),
                menu: (base) => ({
                    ...base,
                    background: 'white',
                    border: '1px solid #ccc',
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#f0f0f0' : (state.isSelected ? '#F6DDD4' : 'white'),
                    color: 'black',
                    ':active': {
                        backgroundColor: '#F6DDD480',
                    },
                    fontSize: '16px',
                    fontFamily: 'Inter',
                    cursor: 'pointer'
                }),
                indicatorSeparator: () => ({ display: 'none' }),
                dropdownIndicator: () => ({ display: 'none' }),
            }}
        />
    );
}