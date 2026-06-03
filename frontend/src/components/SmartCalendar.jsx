import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './SmartCalendar.css';

const parseSafeDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return val;

  if (typeof val === 'string') {
    const euMatch = val.match(/^(\d{2})[./-](\d{2})[./-](\d{4})$/);
    if (euMatch) {
      return new Date(euMatch[3], euMatch[2] - 1, euMatch[1]);
    }
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

const SmartCalendar = ({
  onChange,
  value,
  placeholder,
  minDate: minDateProp,
  maxDate: maxDateProp,
  onFocus,
  onBlur,
}) => {
  const { t, i18n } = useTranslation();
  const displayPlaceholder = placeholder || t("smart_calendar.placeholder", "Оберіть дату");
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(() => parseSafeDate(value));
  const [view, setView] = useState('month');
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  const calculateMaxBirthDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    maxDate.setHours(0, 0, 0, 0);
    return maxDate;
  };

  const maxDate = maxDateProp ?? calculateMaxBirthDate();
  const minDate = minDateProp ?? new Date(1950, 0, 1);

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

  useEffect(() => {
    setDate(parseSafeDate(value));
  }, [value]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (showCalendar && !wasOpenRef.current) onFocus?.();
    if (!showCalendar && wasOpenRef.current) onBlur?.();
    wasOpenRef.current = showCalendar;
  }, [showCalendar, onFocus, onBlur]);

  return (
    <div className="smart-calendar-root">
      <div ref={inputRef} onClick={toggleCalendar} className="smart-calendar-input">
        <span>{date ? date.toLocaleDateString('uk-UA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : displayPlaceholder}</span>
      </div>

      {showCalendar && (
        <div ref={calendarRef} className="smart-calendar-popover">
          <FlatBuddyCalendar
            onChange={handleDateSelect}
            value={date || new Date()}
            currentView={view}
            onViewChange={setView}
            maxDate={maxDate}
            minDate={minDate}
          />
        </div>
      )}
    </div>
  );
};

const FlatBuddyCalendar = ({ onChange, value, currentView = 'month', onViewChange, maxDate, minDate }) => {
  const { t } = useTranslation();
  const [date, setDate] = useState(value || new Date());
  const [yearViewStart, setYearViewStart] = useState(new Date().getFullYear() - 6);

  const stripTime = (d) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };

  const isDisabled = (day) => {
    if (!day) return false;
    const cellDate = stripTime(new Date(date.getFullYear(), date.getMonth(), day));
    if (maxDate && cellDate > stripTime(maxDate)) return true;
    if (minDate && cellDate < stripTime(minDate)) return true;
    return false;
  };

  const isMonthDisabled = (year, monthIndex) => {
    const firstOfMonth = stripTime(new Date(year, monthIndex, 1));
    const lastOfMonth = stripTime(new Date(year, monthIndex + 1, 0));
    if (maxDate && firstOfMonth > stripTime(maxDate)) return true;
    if (minDate && lastOfMonth < stripTime(minDate)) return true;
    return false;
  };

  const isYearDisabled = (year) => {
    if (maxDate && year > maxDate.getFullYear()) return true;
    if (minDate && year < minDate.getFullYear()) return true;
    return false;
  };

  const isPrevDisabled = () => {
    if (currentView === 'month') {
      if (!minDate) return false;
      const lastOfPrev = stripTime(new Date(date.getFullYear(), date.getMonth(), 0));
      return lastOfPrev < stripTime(minDate);
    }
    if (currentView === 'year') {
      if (!minDate) return false;
      return yearViewStart - 1 < minDate.getFullYear();
    }
    return false;
  };

  const isNextDisabled = () => {
    if (currentView === 'month') {
      if (!maxDate) return false;
      const firstOfNext = stripTime(new Date(date.getFullYear(), date.getMonth() + 1, 1));
      return firstOfNext > stripTime(maxDate);
    }
    if (currentView === 'year') {
      if (!maxDate) return false;
      return yearViewStart + 12 > maxDate.getFullYear();
    }
    return false;
  };

  const monthNames = [
    t('smart_calendar.months.0'),
    t('smart_calendar.months.1'),
    t('smart_calendar.months.2'),
    t('smart_calendar.months.3'),
    t('smart_calendar.months.4'),
    t('smart_calendar.months.5'),
    t('smart_calendar.months.6'),
    t('smart_calendar.months.7'),
    t('smart_calendar.months.8'),
    t('smart_calendar.months.9'),
    t('smart_calendar.months.10'),
    t('smart_calendar.months.11')
  ];

  const weekdays = [
    t('smart_calendar.weekdays.0'),
    t('smart_calendar.weekdays.1'),
    t('smart_calendar.weekdays.2'),
    t('smart_calendar.weekdays.3'),
    t('smart_calendar.weekdays.4'),
    t('smart_calendar.weekdays.5'),
    t('smart_calendar.weekdays.6')
  ];

  const switchToYearView = () => {
    onViewChange('year');
    const currentYear = date.getFullYear();
    const maxYear = maxDate ? maxDate.getFullYear() : currentYear;
    if (currentYear > maxYear) {
      setDate(new Date(maxYear, date.getMonth(), 1));
    }
    const startYear = maxYear - 11;
    setYearViewStart(startYear > maxYear - 11 ? maxYear - 11 : startYear);
  };

  const switchToMonthView = () => onViewChange('month');
  const switchToMonthSelection = () => onViewChange('months');

  const goToPrevious = () => {
    if (isPrevDisabled()) return;
    if (currentView === 'month') {
      setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    } else if (currentView === 'year') {
      setYearViewStart(yearViewStart - 12);
    }
  };

  const goToNext = () => {
    if (isNextDisabled()) return;
    if (currentView === 'month') {
      setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    } else if (currentView === 'year') {
      setYearViewStart(yearViewStart + 12);
    }
  };

  const selectMonth = (monthIndex) => {
    if (isMonthDisabled(date.getFullYear(), monthIndex)) return;
    setDate(new Date(date.getFullYear(), monthIndex, 1));
    onViewChange('month');
  };

  const selectYear = (year) => {
    if (isYearDisabled(year)) return;
    setDate(new Date(year, date.getMonth(), 1));
    onViewChange('months');
  };

  const selectDay = (day) => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), day);
    if (maxDate && newDate > maxDate) return;
    if (minDate && newDate < minDate) return;
    setDate(newDate);
    if (onChange) onChange(newDate);
  };

  const getDayOfWeek = (jsDate) => {
    const day = jsDate.getDay();
    return day === 0 ? 6 : day - 1;
  };

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

  const isSelected = (day) => day === date.getDate();

  const generateYears = () => {
    const years = [];
    for (let i = yearViewStart; i < yearViewStart + 12; i++) {
      years.push(i);
    }
    return years;
  };

  const years = generateYears();

  const dayBtnClass = (day) => {
    if (!day) return '';
    return [
      'fb-cal-grid-btn',
      'fb-cal-day-btn',
      isDisabled(day) && 'fb-cal-grid-btn--disabled',
      !isDisabled(day) && isSelected(day) && 'fb-cal-grid-btn--selected',
      !isDisabled(day) && !isSelected(day) && isToday(day) && 'fb-cal-grid-btn--today',
    ].filter(Boolean).join(' ');
  };

  const monthBtnClass = (idx) => {
    const disabled = isMonthDisabled(date.getFullYear(), idx);
    const current = date.getMonth() === idx;
    return [
      'fb-cal-grid-btn',
      disabled && 'fb-cal-grid-btn--disabled',
      !disabled && current && 'fb-cal-grid-btn--current',
    ].filter(Boolean).join(' ');
  };

  const yearBtnClass = (year) => {
    const disabled = isYearDisabled(year);
    const current = date.getFullYear() === year;
    return [
      'fb-cal-grid-btn',
      disabled && 'fb-cal-grid-btn--disabled',
      !disabled && current && 'fb-cal-grid-btn--current',
    ].filter(Boolean).join(' ');
  };

  return (
    <div className="fb-cal">
      <div className="fb-cal-nav">
        <button
          onClick={goToPrevious}
          className="fb-cal-nav-btn"
          disabled={isPrevDisabled()}
        >‹</button>

        <div className="fb-cal-month-year-row">
          {currentView === 'month' && (
            <>
              <div onClick={switchToMonthSelection} className="fb-cal-month-year">
                {monthNames[date.getMonth()]}
              </div>
              <div onClick={switchToYearView} className="fb-cal-month-year">
                {date.getFullYear()}
              </div>
            </>
          )}

          {currentView === 'months' && (
            <div className="fb-cal-month-year">{date.getFullYear()}</div>
          )}

          {currentView === 'year' && (
            <div className="fb-cal-month-year">
              {yearViewStart} - {yearViewStart + 11}
            </div>
          )}
        </div>

        <button
          onClick={goToNext}
          className="fb-cal-nav-btn"
          disabled={isNextDisabled()}
        >›</button>
      </div>

      {currentView === 'month' && (
        <>
          <div className="fb-cal-weekdays">
            {weekdays.map(d => <div key={d} className="fb-cal-weekday">{d}</div>)}
          </div>

          <div className="fb-cal-days-grid">
            {days.map((day, index) => (
              <div key={index} className="fb-cal-day-cell">
                {day && (
                  <button
                    onClick={() => !isDisabled(day) && selectDay(day)}
                    className={dayBtnClass(day)}
                    disabled={isDisabled(day)}
                    title={isDisabled(day) ? t("smart_calendar.disabled_date", "Недоступна дата") : ""}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {currentView === 'months' && (
        <div className="fb-cal-months-grid">
          {monthNames.map((month, index) => {
            const disabled = isMonthDisabled(date.getFullYear(), index);
            return (
              <button
                key={month}
                onClick={() => !disabled && selectMonth(index)}
                disabled={disabled}
                title={disabled ? t("smart_calendar.disabled_month", "Недоступний місяць") : ""}
                className={monthBtnClass(index)}
              >
                {month}
              </button>
            );
          })}
        </div>
      )}

      {currentView === 'year' && (
        <div className="fb-cal-years-grid">
          {years.map(year => {
            const disabled = isYearDisabled(year);
            return (
              <button
                key={year}
                onClick={() => !disabled && selectYear(year)}
                disabled={disabled}
                title={disabled ? t("smart_calendar.disabled_year", "Недоступний рік") : ""}
                className={yearBtnClass(year)}
              >
                {year}
              </button>
            );
          })}
        </div>
      )}

      {currentView !== 'month' && (
        <div className="fb-cal-view-buttons">
          {currentView === 'months' && (
            <button onClick={switchToYearView} className="fb-cal-view-btn">
              {t("smart_calendar.select_year", "Обрати рік")}
            </button>
          )}
          <button onClick={switchToMonthView} className="fb-cal-view-btn">
            {t("smart_calendar.back_to_days", "Повернутися до днів")}
          </button>
        </div>
      )}
    </div>
  );
};

export { SmartCalendar };
