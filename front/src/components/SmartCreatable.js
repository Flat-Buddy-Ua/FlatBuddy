import { max } from 'moment';
import React, { PureComponent } from 'react';
import CreatableSelect from 'react-select/creatable';

export function SmartCreatable({
    options = [],
    defaultValue = null,
    onChange,
    onFocus,
    onBlur,
    onMenuOpen,
    onMenuClose
}) {
    const [selectedOption, setSelectedOption] = React.useState(defaultValue || options[0] || null);

    return (
        <CreatableSelect
            value={selectedOption}
            onChange={(val) => {
                setSelectedOption(val);
                onChange?.(val);
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
                    minHeight: '100px',
                    maxHeight: '200px',
                }),
                menuList: (base) => ({
                    ...base,
                    maxHeight: '200px',
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