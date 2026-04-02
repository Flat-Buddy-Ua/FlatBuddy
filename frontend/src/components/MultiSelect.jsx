import React, { PureComponent } from 'react';
import CreatableSelect from 'react-select/creatable';

export function MultiSelect({
    options = [],
    defaultValue = null,
    onChange,
    onFocus,
    onBlur,
    onMenuOpen,
    onMenuClose,
    placeholder,
    isMulti = true
}) {

    const [selectedOptions, setSelectedOptions] = React.useState(
        isMulti 
            ? (Array.isArray(defaultValue) ? defaultValue : []) 
            : defaultValue || null
    );

    return (
        <CreatableSelect
            placeholder={placeholder}
            isMulti={isMulti}
            value={selectedOptions}
            onChange={(selected) => {
                setSelectedOptions(selected);
                onChange?.(selected);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            onMenuOpen={onMenuOpen}
            onMenuClose={onMenuClose}
            options={options}

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
                    fontFamily: "'Inter', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",
                }),
                menuPortal: (base) => ({
                    ...base,
                    width: '30%',
                    minWidth: '300px',
                    zIndex: 9999,
                    fontFamily: "'Inter', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",
                }),
                menu: (base) => ({
                    ...base,
                    background: 'white',
                    border: '1px solid #ccc',
                    minHeight: '100px',
                    maxHeight: '200px',
                    fontFamily: "'Inter', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",
                    // width: '120%'
                }),
                menuList: (base) => ({
                    ...base,
                    maxHeight: '200px',
                    fontFamily: "'Inter', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",
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
                    fontFamily: "'Inter', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",
                    // width: '120%'
                }),
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#F6DDD4',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    margin: '2px',
                    fontFamily: "'Inter', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: 'black',
                    fontWeight: 'normal',
                    fontFamily: "'Inter', 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif",
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