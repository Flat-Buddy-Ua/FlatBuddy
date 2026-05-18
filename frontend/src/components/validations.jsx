// validations.js
// Helper to read scalar id out of either a raw id or a {value,label} option object.
const getId = (v) => (v && typeof v === 'object' && 'value' in v) ? v.value : v;

export const validations = {

  name: (value) => {
    if (typeof value !== 'string' || !value.trim()) return "Ім'я обов'язкове";
    if (!/^[А-Яа-яЄєІіЇїҐґ\s-]{2,50}$/.test(value)) {
      return "Тільки українські літери (2-50 символів)";
    }

    const firstLetter = value.trim()[0];
    if (firstLetter !== firstLetter.toUpperCase()) {
      return "Перша літера має бути великою";
    }
    const restOfName = value.trim().substring(1);
    if (/[А-ЯЄІЇҐ]/.test(restOfName)) {
      return "Решта літер мають бути маленькими";
    }

    return null;
  },
  surname: (value) => {
    if (typeof value !== 'string' || !value.trim()) return "Прізвище обов'язкове";
    if (!/^[А-Яа-яЄєІіЇїҐґ\s-]{2,50}$/.test(value)) {
      return "Тільки українські літери (2-50 символів)";
    }

    const firstLetter = value.trim()[0];
    if (firstLetter !== firstLetter.toUpperCase()) {
      return "Перша літера має бути великою";
    }
    const restOfName = value.trim().substring(1);
    if (/[А-ЯЄІЇҐ]/.test(restOfName)) {
      return "Решта літер мають бути маленькими";
    }

    return null;
  },

  country: (realValue) => {
    const id = getId(realValue);
    if (!id || id === 0) return "Оберіть країну";
    return null;
  },

  city: (realValue) => {
    const id = getId(realValue);
    if (!id || id === 0) return "Оберіть місто";
    return null;
  },

  gender: (realValue) => {
    const id = getId(realValue);
    if (!id || id === 0) return "Оберіть стать";
    return null;
  },

  birthDate: (value) => {
    if (!value) return "Дата обов'язкова";
    const birthDate = new Date(value);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) return "Мінімум 18 років";
    if (age > 120) return "Некоректна дата";
    return null;
  },
  email: (value) => {
    if (typeof value !== 'string' || !value.trim()) return "Email обов'язковий";
    if (!/\S+@\S+\.\S+/.test(value)) {
      return "Введіть коректний email";
    }
    return null;
  },

  phone: (value) => {
    if (typeof value !== 'string' || !value.trim()) return "Телефон обов'зковий";

    const operatorCode = value.trim().substring(4, 7);

    const validCodes = [
      // Київстар
      '067', '068', '096', '097', '098',
      // Vodafone
      '050', '066', '095', '099',
      // lifecell
      '063', '073', '093',
      // Інтертелеком
      '089', '094',
      // ТриМоб
      '091',
      // People.net
      '092',
      // Фінтелеком
      '039'
    ];
    if (!validCodes.includes(operatorCode)) {
      return `Невірний код оператора. Дозволені: ${validCodes.slice(0, 5).join(', ')}...`;
    }

    if (value.includes("_")) return "Телефон має бути у форматі +38(0XX)-XXX-XX-XX";

    return null;
  },

  password: (value) => {
    if (typeof value !== 'string' || !value.trim()) return "Пароль обов'язковий";
    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/.test(value)) {
      return "Пароль має містити лише латинські літери";
    }
    if (value.length < 8) return "Пароль має містити принаймні 8 символів";
    if (value.length > 20) return "Пароль не може перевищувати 20 символів";
    if (!/[A-Z]/.test(value)) return "Пароль має містити хоча б одну велику літеру";
    if (!/[a-z]/.test(value)) return "Пароль має містити хоча б одну малу літеру";
    if (!/[0-9]/.test(value)) return "Пароль має містити хоча б одну цифру";
    if (/\s/.test(value)) return "Пароль не може містити пробілів";
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) return "Пароль має містити хоча б один спеціальний символ";
    return null;
  },

  repeat_password: (value, allValues) => {
    if (!value?.trim()) return "Підтвердження пароля обов'язкове";
    if (!allValues?.password?.realValue) return null;
    if (!allValues.password.isValid) return null;
    if (value !== allValues.password.realValue) return "Паролі не співпадають";
    return null;
  },

  // ---------------- Step 2: Про мене ----------------

  status: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === "") return "Оберіть статус";
    return null;
  },

  orbit: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === "") return "Оберіть сферу";
    return null;
  },

  languages: (value) => {
    if (!value || value.length === 0) return "Оберіть мови";
    return null;
  },

  cleanliness: (value) => {
    const n = Number(value);
    if (!n || n < 1 || n > 5) return "Оберіть рівень охайності";
    return null;
  },

  my_vibe: (value) => {
    if (!value) return "Опишіть себе";
    if (value.length < 200) return `Мінімум 200 символів (зараз ${value.length})`;
    if (value.length > 600) return "Максимум 600 символів";
    return null;
  },

  buddy_vibe: (value) => {
    if (!value) return "Опишіть бажаного співмешканця";
    if (value.length < 200) return `Мінімум 200 символів (зараз ${value.length})`;
    if (value.length > 600) return "Максимум 600 символів";
    return null;
  },

  schedule: (value) => {
    if (!value) return "Опишіть розклад";
    if (value.length < 3) return "Мінімум 3 символи";
    if (value.length > 100) return "Максимум 100 символів";
    return null;
  },

  sleep_schedule: (value) => {
    if (!value) return "Опишіть графік сну";
    if (value.length < 3) return "Мінімум 3 символи";
    if (value.length > 100) return "Максимум 100 символів";
    return null;
  },

  smoking: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === "") return "Оберіть варіант";
    return null;
  },

  partying: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === "") return "Оберіть варіант";
    return null;
  },

  hobbies: (value) => {
    if (!Array.isArray(value) || value.length === 0) return "Оберіть хоча б одне хобі";
    let presetCount = 0;
    let customCount = 0;
    for (const tag of value) {
      const v = tag?.value !== undefined ? tag.value : tag;
      if (typeof v === 'number') {
        presetCount += 1;
      } else if (typeof v === 'string') {
        customCount += 1;
        if (v.length > 50) return "Кастомне хобі: макс. 50 символів";
      }
    }
    if (presetCount > 10) return "Максимум 10 хобі зі списку";
    if (customCount > 5) return "Максимум 5 кастомних хобі";
    return null;
  },

  // ---------------- Step 3: Проживання ----------------

  room_sharing_preference: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return "Оберіть свою преференцію";
    return null;
  },

  preferred_gender: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return "Оберіть із ким ви б хотіли проживати";
    return null;
  },

  housing_status: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return "Оберіть ваш статус";
    return null;
  },

  budget_min: (value) => {
    const n = Number(value);
    if (!n) return "Вкажіть мінімальний бюджет";
    if (n < 500) return "Мінімум 500 грн";
    return null;
  },

  budget_max: (value) => {
    const n = Number(value);
    if (!n) return "Вкажіть максимальний бюджет";
    if (n > 100000) return "Максимум 100000 грн";
    return null;
  },

  destination: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return "Оберіть місто";
    return null;
  },

  preferred_districts: (value) => {
    if (!Array.isArray(value) || value.length === 0) return "Оберіть хоча б один район";
    if (value.length > 10) return "Максимум 10 районів";
    return null;
  },

  planned_duration: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return "Оберіть термін";
    return null;
  },

  move_in_date: (value) => {
    if (!value) return "Вкажіть дату";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "Невірна дата";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return "Дата не може бути в минулому";
    return null;
  },

  has_pet: (value) => {
    if (value === undefined || value === null) return "Оберіть варіант";
    if (typeof value === 'object' && value.value === undefined) return "Оберіть варіант";
    return null;
  },

  pet_description: (value) => {
    if (!value) return "Опишіть улюбленця";
    if (value.length < 3) return "Мінімум 3 символи";
    if (value.length > 100) return "Максимум 100 символів";
    return null;
  },
};
