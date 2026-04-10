import React from 'react';
import Select from 'react-select';

export function SmartSelect({
    options = [],
    value,
    defaultValue = null,
    placeholder,
    onChange,
    onFocus,
    onBlur,
    onMenuOpen,
    onMenuClose,
    mywidth = "100%",
}) {

    return (
        <Select
            value={value}
            options={options}
            placeholder={options.length > 0 ? options[0].label : "Виберіть опцію"}
            onChange={(val) => {
                onChange?.(val);
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
                    boxSizing: 'border-box',
                    resize: 'none',
                    overflow: 'hidden',
                    width: mywidth,
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
                    zIndex: 9999,
                }),
                menu: (base) => ({
                    ...base,
                    background: 'white',
                    border: '1px solid #ccc',
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
                }),
            }}
        />
    );
}