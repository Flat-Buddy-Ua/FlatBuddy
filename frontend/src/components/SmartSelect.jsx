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
    isMulti = false,
    isDisabled = false,
    noOptionsMessage,
}) {

    return (
        <Select
            value={value}
            options={options}
            placeholder={placeholder}
            isMulti={isMulti}
            isDisabled={isDisabled}
            noOptionsMessage={noOptionsMessage}
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
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#F6DDD4',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    margin: '2px',
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: 'black',
                    fontWeight: 'normal',
                    fontFamily: 'Inter',
                }),
                multiValueRemove: (base) => ({
                    ...base,
                    color: '#666',
                    ':hover': {
                        backgroundColor: '#E8C9BC',
                        color: 'black',
                    },
                }),
            }}
        />
    );
}