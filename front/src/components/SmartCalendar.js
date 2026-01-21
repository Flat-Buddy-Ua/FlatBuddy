import React, { useState, useRef, useEffect } from 'react';

const SmartCalendar = ({ onChange, value, placeholder = "Оберіть дату" }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(value || new Date(1972, 0, 1));
  const [view, setView] = useState('month'); // 'month' або 'year'
  const calendarRef = useRef(null);
  const inputRef = useRef(null);
  
  const calculateMaxBirthDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    // Очищаємо години, хвилини, секунди для точної дати
    maxDate.setHours(0, 0, 0, 0);
    return maxDate;
  };

  const maxBirthDate = calculateMaxBirthDate();
  const minBirthDate = new Date(1950, 0, 1);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    if (onChange) onChange(selectedDate);
    setShowCalendar(false);
    setView('month');
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setView('month');
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split("T")[0];
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Поле вводу */}
      <div
        ref={inputRef}
        onClick={toggleCalendar}
        style={{
          padding: '12px 15px',
          background: 'transparent',
          cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          color: date ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,1)',
          transition: 'all 0.3s ease',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onMouseEnter={(e) => e.target.style.borderColor = '#F6DDD4CC'}
        onMouseLeave={(e) => e.target.style.borderColor = '#F6DDD4'}
      >
        <span>{date ? date.toLocaleDateString('uk-UA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : placeholder}</span>
        {/* <span style={{ color: '#F6DDD4' }}>📅</span> */}
      </div>

      {/* Календар */}
      {showCalendar && (
        <div
          ref={calendarRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 5px)',
            left: 0,
            zIndex: 1000,
            background: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            padding: '15px',
            minWidth: '320px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          <FlatBuddyCalendar 
            onChange={handleDateSelect}
            value={date || new Date()}
            currentView={view}
            onViewChange={setView}
            maxDate={maxBirthDate}
            minDate={minBirthDate}
          />
        </div>
      )}
    </div>
  );
};

const FlatBuddyCalendar = ({ onChange, value, currentView = 'month', onViewChange, maxDate, minDate}) => {
  const [date, setDate] = useState(value || new Date());
  const [yearViewStart, setYearViewStart] = useState(new Date().getFullYear() - 6);

  const isDisabled = (day) => {
    if (!day || !maxDate) return false;
    
    const cellDate = new Date(date.getFullYear(), date.getMonth(), day);

    cellDate.setHours(0, 0, 0, 0);
    const maxDateCopy = new Date(maxDate);
    maxDateCopy.setHours(0, 0, 0, 0);
    
    return cellDate > maxDateCopy;
  };

  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      maxWidth: '300px',
      background: 'white',
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      background: '#F6DDD433',
      padding: '8px 12px',
      position: 'relative'
    },
    navButton: {
      background: '#F6DDD44D',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      color: 'rgba(0,0,0,0.7)',
      fontFamily: "'Seenonim', sans-serif",
      padding: '6px 12px',
      minWidth: '40px',
      transition: 'all 0.2s ease'
    },
    viewButton: {
      background: 'none',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      color: 'rgba(0,0,0,1)',
      fontFamily: "'Seenonim', sans-serif",
      fontWeight: '500',
      padding: '4px 12px',
      transition: 'all 0.2s ease'
    },
    monthYear: {
      fontFamily: "'Seenonim', sans-serif",
      fontSize: '16px',
      fontWeight: '500',
      color: 'rgba(0,0,0,1)',
      cursor: 'pointer',
      padding: '4px 10px',
      transition: 'background 0.2s ease'
    },
    weekdays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      marginBottom: '8px',
      textAlign: 'center'
    },
    weekday: {
      padding: '6px 0',
      fontWeight: '500',
      fontSize: '13px',
      color: 'rgba(0,0,0,0.7)'
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      marginBottom: '10px'
    },
    monthsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px'
    },
    yearsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      maxHeight: '250px',
      overflowY: 'auto',
      padding: '5px'
    },
    gridButton: {
      padding: '12px 8px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: "'Inter', sans-serif",
      transition: 'all 0.2s ease',
      textAlign: 'center'
    }
  };

  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  // Перемикання між видами
  const switchToYearView = () => {
    onViewChange('year');
    
    // 👇 Встановлюємо початок так, щоб максимальний рік був у проміжку
    const currentYear = date.getFullYear();
    const maxYear = maxDate ? maxDate.getFullYear() : currentYear;
    
    // Якщо поточний рік більший за максимальний, коригуємо
    if (currentYear > maxYear) {
      setDate(new Date(maxYear, date.getMonth(), 1));
    }
    
    // Встановлюємо початок виду років
    const startYear = maxYear - 11; // Показуємо 12 років назад від максимального
    setYearViewStart(startYear > maxYear - 11 ? maxYear - 11 : startYear);
  };

  const switchToMonthView = () => {
    onViewChange('month');
  };

  const switchToMonthSelection = () => {
    onViewChange('months');
  };

  // Навігація
  const goToPrevious = () => {
    if (currentView === 'month') {
      setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    } else if (currentView === 'year') {
      const newStart = yearViewStart - 12;
      if (minDate && newStart >= minDate.getFullYear()) {
        setYearViewStart(newStart);
      } else if (!minDate) {
        setYearViewStart(newStart);
      }
    }
  };

  const goToNext = () => {
    if (currentView === 'month') {
      setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    } else if (currentView === 'year') {
      const newStart = yearViewStart + 12;
      if (maxDate && newStart <= maxDate.getFullYear()) {
        setYearViewStart(newStart);
      } else if (!maxDate) {
        setYearViewStart(newStart);
      }
    }
  };

  // Обрання місяця
  const selectMonth = (monthIndex) => {
    const newDate = new Date(date.getFullYear(), monthIndex, 1);
    setDate(newDate);
    onViewChange('month');
  };

  // Обрання року
  const selectYear = (year) => {
    const newDate = new Date(year, date.getMonth(), 1);
    setDate(newDate);
    onViewChange('months');
  };

  // Обрання дня
  const selectDay = (day) => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), day);

    if (maxDate && newDate > maxDate) {
      return; // Не викликаємо onChange, не змінюємо дату
    }

    setDate(newDate);
    if (onChange) onChange(newDate);
  };

  const getDayOfWeek = (jsDate) => {
    const day = jsDate.getDay(); // 0=Нд, 1=Пн, 2=Вт...
    return day === 0 ? 6 : day - 1; // Перетворюємо: 0=Пн, 1=Вт...
  };

  // Генерація днів місяця
  const getDaysInMonth = () => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const startingDay = getDayOfWeek(firstDay);

    const days = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const days = getDaysInMonth();

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === date.getDate();
  };

  // Генерація списку років
  const generateYears = () => {
    const years = [];
    for (let i = yearViewStart; i < yearViewStart + 12; i++) {
      if (maxDate && i > maxDate.getFullYear()) {
        continue;
      }
      years.push(i);
    }
    return years;
  };

  const years = generateYears();

  return (
    <div style={styles.container}>
      {/* Навігаційна панель */}
      <div style={styles.navigation}>
        <button
          onClick={goToPrevious} 
          style={{
            ...styles.navButton,
            opacity: (currentView === 'year' && minDate && yearViewStart - 12 + 11 < minDate.getFullYear()) ? 0.3 : 1,
            cursor: (currentView === 'year' && minDate && yearViewStart - 12 + 11 < minDate.getFullYear()) ? 'not-allowed' : 'pointer'
          }}
          disabled={currentView === 'year' && minDate && yearViewStart - 12 + 11 < minDate.getFullYear()}
        >
          ‹
        </button>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {currentView === 'month' && (
            <>
              <div 
                onClick={switchToMonthSelection}
                style={styles.monthYear}
                onMouseEnter={(e) => e.target.style.background = '#F6DDD44D'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                {monthNames[date.getMonth()]}
              </div>
              <div 
                onClick={switchToYearView}
                style={styles.monthYear}
                onMouseEnter={(e) => e.target.style.background = '#F6DDD44D'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                {date.getFullYear()}
              </div>
            </>
          )}
          
          {currentView === 'months' && (
            <div style={styles.monthYear}>
              {date.getFullYear()}
            </div>
          )}
          
          {currentView === 'year' && (
            <div style={styles.monthYear}>
              {yearViewStart} - {yearViewStart + 11}
            </div>
          )}
        </div>
        
        <button
          onClick={goToNext} 
          style={{
            ...styles.navButton,
            opacity: (currentView === 'year' && maxDate && yearViewStart + 12 > maxDate.getFullYear()) ? 0.3 : 1,
            cursor: (currentView === 'year' && maxDate && yearViewStart + 12 > maxDate.getFullYear()) ? 'not-allowed' : 'pointer'
          }}
          disabled={currentView === 'year' && maxDate && yearViewStart + 12 > maxDate.getFullYear()}
        >
          ›
        </button>
      </div>

      {/* Відображення місяця */}
      {currentView === 'month' && (
        <>
          <div style={styles.weekdays}>
            {weekdays.map(day => (
              <div key={day} style={styles.weekday}>{day}</div>
            ))}
          </div>

          <div style={styles.daysGrid}>
            {days.map((day, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                {day && (
                  <button
                    onClick={() => !isDisabled(day) && selectDay(day)}
                    style={{
                      ...styles.gridButton,
                      width: '36px',
                      height: '36px',
                      background: isDisabled(day)
                        ? 'rgba(0,0,0,0.05)'
                        : (isSelected(day) 
                          ? '#F6DDD4' 
                          : isToday(day)
                            ? '#F6DDD466'
                            : 'transparent'),
                      color: isDisabled(day)
                        ? 'rgba(0,0,0,0.3)'
                        : (isSelected(day) || isToday(day))
                          ? 'rgba(0,0,0,1)'
                          : 'rgba(0,0,0,0.7)',
                      fontWeight: isSelected(day) ? '600' : '400',
                      cursor: isDisabled(day) ? 'not-allowed' : 'pointer',
                      opacity: isDisabled(day) ? 0.5 : 1,
                      textDecoration: isDisabled(day) ? 'line-through' : 'none',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected(day) && !isToday(day) && !isDisabled(day)) {
                        e.target.style.background = '#F6DDD44D';
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected(day) && !isToday(day) && !isDisabled(day)) {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                    disabled={isDisabled(day)}
                    title={isDisabled(day) ? "Дата народження не може бути пізнішою" : ""}
                  >
                    {day}
                    {/* {isDisabled(day) && (
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,0,0,0.3)'
                      }} />
                    )} */}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Відображення місяців */}
      {currentView === 'months' && (
        <div style={styles.monthsGrid}>
          {monthNames.map((month, index) => (
            <button
              key={month}
              onClick={() => selectMonth(index)}
              style={{
                ...styles.gridButton,
                background: date.getMonth() === index 
                  ? '#F6DDD4' 
                  : 'transparent',
                color: date.getMonth() === index 
                  ? 'rgba(0,0,0,1)' 
                  : 'rgba(0,0,0,0.7)',
                fontWeight: date.getMonth() === index ? '600' : '400'
              }}
              onMouseEnter={(e) => {
                if (date.getMonth() !== index) {
                  e.target.style.background = '#F6DDD44D';
                }
              }}
              onMouseLeave={(e) => {
                if (date.getMonth() !== index) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {month}
            </button>
          ))}
        </div>
      )}

      {/* Відображення років */}
      {currentView === 'year' && (
        <div style={styles.yearsGrid}>
          {years.map(year => (
            <button
              key={year}
              onClick={() => selectYear(year)}
              style={{
                ...styles.gridButton,
                background: date.getFullYear() === year 
                  ? '#F6DDD4' 
                  : 'transparent',
                color: date.getFullYear() === year 
                  ? 'rgba(0,0,0,1)' 
                  : 'rgba(0,0,0,0.7)',
                fontWeight: date.getFullYear() === year ? '600' : '400'
              }}
              onMouseEnter={(e) => {
                if (date.getFullYear() !== year) {
                  e.target.style.background = '#F6DDD44D';
                }
              }}
              onMouseLeave={(e) => {
                if (date.getFullYear() !== year) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Кнопки перемикання */}
      {currentView !== 'month' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
          {currentView === 'months' && (
            <button 
              onClick={switchToYearView}
              style={{
                ...styles.viewButton,
                background: '#F6DDD466'
              }}
            >
              Обрати рік
            </button>
          )}
          <button 
            onClick={switchToMonthView}
            style={{
              ...styles.viewButton,
              background: '#F6DDD466'
            }}
          >
            Повернутися до днів
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartCalendar;