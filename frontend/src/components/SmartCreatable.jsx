import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const CYRILLIC_REGEX = /^[\u0400-\u04FF\s-]*$/;

export function SmartCreatable({
    options = [],
    value,
    placeholder,
    defaultValue = null,
    onChange,
    onFocus,
    onBlur,
    onMenuOpen,
    onMenuClose
})

{
    const [inputValue, setInputValue] = useState("");

    return (
        <CreatableSelect
            value={value}
            options={options}
            placeholder={options.length > 0 ? options[0].label : "Виберіть опцію"}
            inputValue={inputValue}
            onChange={(val) => {
                setInputValue("");
                onChange?.(val);
            }}
            onInputChange={(inputValue, { action }) => {
                if (action !== "input-change") {
                    return;
                }

                if (CYRILLIC_REGEX.test(inputValue)) {
                    setInputValue(inputValue);
                }
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onMenuOpen={onMenuOpen}
            onMenuClose={onMenuClose}

            menuPortalTarget={document.body}
            menuPosition="fixed"

            styles={{
                control: (provided) => ({
                    ...provided,
                    width: '100%',
                    height: '100%',
                    minHeight: '44px',
                    paddingLeft: '10px',
                    border: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    fontSize: '16px',
                    fontFamily: 'Inter',
                }),
                menuPortal: (base) => ({
                    ...base,
                    width: '30%',
                    minWidth: '300px',
                    zIndex: 9999,
                }),
                menu: (base) => ({
                    ...base,
                    background: 'white',
                    border: '1px solid #ccc',
                    minHeight: '100px',
                    maxHeight: '200px',
                    // width: '120%'
                }),
                menuList: (base) => ({
                    ...base,
                    maxHeight: '200px',
                    // width: '120%'
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
                    backgroundColor: state.isSelected ? '#F6DDD4' : 'inherit',
                    color: 'black',
                    ':active': {
                        backgroundColor: '#F6DDD480',
                    },
                    fontSize: '16px',
                    fontFamily: 'Inter',
                    // width: '120%'
                }),
            }}
        />
    );
}