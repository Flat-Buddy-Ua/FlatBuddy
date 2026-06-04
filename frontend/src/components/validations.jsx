// validations.js
// Helper to read scalar id out of either a raw id or a {value,label} option object.
import i18n from "i18next";
const getId = (v) => (v && typeof v === 'object' && 'value' in v) ? v.value : v;

export const validations = {

  name: (value) => {
    if (typeof value !== 'string' || !value.trim()) return i18n.t("validations.name_required", "Ім'я обов'язкове");
    if (!/^[А-Яа-яЄєІіЇїҐґ\s-]{2,50}$/.test(value)) {
      return i18n.t("validations.name_invalid", "Тільки українські літери (2-50 символів)");
    }

    const firstLetter = value.trim()[0];
    if (firstLetter !== firstLetter.toUpperCase()) {
      return i18n.t("validations.first_letter_upper", "Перша літера має бути великою");
    }
    const restOfName = value.trim().substring(1);
    if (/[А-ЯЄІЇҐ]/.test(restOfName)) {
      return i18n.t("validations.rest_letters_lower", "Решта літер мають бути маленькими");
    }

    return null;
  },
  surname: (value) => {
    if (typeof value !== 'string' || !value.trim()) return i18n.t("validations.surname_required", "Прізвище обов'язкове");
    if (!/^[А-Яа-яЄєІіЇїҐґ\s-]{2,50}$/.test(value)) {
      return i18n.t("validations.name_invalid", "Тільки українські літери (2-50 символів)");
    }

    const firstLetter = value.trim()[0];
    if (firstLetter !== firstLetter.toUpperCase()) {
      return i18n.t("validations.first_letter_upper", "Перша літера має бути великою");
    }
    const restOfName = value.trim().substring(1);
    if (/[А-ЯЄІЇҐ]/.test(restOfName)) {
      return i18n.t("validations.rest_letters_lower", "Решта літер мають бути маленькими");
    }

    return null;
  },

  country: (realValue) => {
    const id = getId(realValue);
    if (!id || id === 0) return i18n.t("validations.country_required", "Оберіть країну");
    return null;
  },

  city: (realValue) => {
    const id = getId(realValue);
    if (!id || id === 0) return i18n.t("validations.city_required", "Оберіть місто");
    return null;
  },

  gender: (realValue) => {
    const id = getId(realValue);
    if (!id || id === 0) return i18n.t("validations.gender_required", "Оберіть стать");
    return null;
  },

  birthDate: (value) => {
    if (!value) return i18n.t("validations.date_required", "Дата обов'язкова");
    const birthDate = new Date(value);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) return i18n.t("validations.age_min", "Мінімум 18 років");
    if (age > 120) return i18n.t("validations.date_invalid", "Некоректна дата");
    return null;
  },
  email: (value) => {
    if (typeof value !== 'string' || !value.trim()) return i18n.t("validations.email_required", "Email обов'язковий");
    if (!/\S+@\S+\.\S+/.test(value)) {
      return i18n.t("validations.email_invalid", "Введіть коректний email");
    }
    return null;
  },

  phone: (value) => {
    if (typeof value !== 'string' || !value.trim()) return i18n.t("validations.phone_required", "Телефон обов'зковий");

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
      return i18n.t("validations.phone_operator", "Невірний код оператора") + `. Дозволені: ${validCodes.slice(0, 5).join(', ')}...`;
    }

    if (value.includes("_")) return i18n.t("validations.phone_format", "Телефон має бути у форматі +38(0XX)-XXX-XX-XX");

    return null;
  },

  password: (value) => {
    if (typeof value !== 'string' || !value.trim()) return i18n.t("validations.password_required", "Пароль обов'язковий");
    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/.test(value)) {
      return i18n.t("validations.password_latin", "Пароль має містити лише латинські літери");
    }
    if (value.length < 8) return i18n.t("validations.password_min", "Пароль має містити принаймні 8 символів");
    if (value.length > 20) return i18n.t("validations.password_max", "Пароль не може перевищувати 20 символів");
    if (!/[A-Z]/.test(value)) return i18n.t("validations.password_upper", "Пароль має містити хоча б одну велику літеру");
    if (!/[a-z]/.test(value)) return i18n.t("validations.password_lower", "Пароль має містити хоча б одну малу літеру");
    if (!/[0-9]/.test(value)) return i18n.t("validations.password_digit", "Пароль має містити хоча б одну цифру");
    if (/\s/.test(value)) return i18n.t("validations.password_nospace", "Пароль не може містити пробілів");
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) return i18n.t("validations.password_special", "Пароль має містити хоча б один спеціальний символ");
    return null;
  },

  repeat_password: (value, allValues) => {
    if (!value?.trim()) return i18n.t("validations.repeat_password_required", "Підтвердження пароля обов'язкове");
    if (!allValues?.password?.realValue) return null;
    if (!allValues.password.isValid) return null;
    if (value !== allValues.password.realValue) return i18n.t("validations.passwords_mismatch", "Паролі не співпадають");
    return null;
  },

  // ---------------- Step 2: Про мене ----------------

  status: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === "") return i18n.t("validations.status_required", "Оберіть статус");
    return null;
  },

  orbit: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === "") return i18n.t("validations.orbit_required", "Оберіть сферу");
    return null;
  },

  languages: (value) => {
    if (!value || value.length === 0) return i18n.t("validations.languages_required", "Оберіть мови");
    return null;
  },

  cleanliness: (value) => {
    const n = Number(value);
    if (!n || n < 1 || n > 5) return i18n.t("validations.cleanliness_required", "Оберіть рівень охайності");
    return null;
  },

  my_vibe: (value) => {
    if (!value) return i18n.t("validations.my_vibe_required", "Опишіть себе");
    if (value.length < 200) return i18n.t("validations.min_200", "Мінімум 200 символів") + ` (${i18n.t("validations.currently", "зараз")} ${value.length})`;
    if (value.length > 600) return i18n.t("validations.max_600", "Максимум 600 символів");
    return null;
  },

  buddy_vibe: (value) => {
    if (!value) return i18n.t("validations.buddy_vibe_required", "Опишіть бажаного співмешканця");
    if (value.length < 200) return i18n.t("validations.min_200", "Мінімум 200 символів") + ` (${i18n.t("validations.currently", "зараз")} ${value.length})`;
    if (value.length > 600) return i18n.t("validations.max_600", "Максимум 600 символів");
    return null;
  },

  schedule: (value) => {
    if (!value) return i18n.t("validations.schedule_required", "Опишіть розклад");
    if (value.length < 3) return i18n.t("validations.min_3", "Мінімум 3 символи");
    if (value.length > 100) return i18n.t("validations.max_100", "Максимум 100 символів");
    return null;
  },

  sleep_schedule: (value) => {
    if (!value) return i18n.t("validations.sleep_schedule_required", "Опишіть графік сну");
    if (value.length < 3) return i18n.t("validations.min_3", "Мінімум 3 символи");
    if (value.length > 100) return i18n.t("validations.max_100", "Максимум 100 символів");
    return null;
  },

  smoking: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === "") return i18n.t("validations.smoking_required", "Оберіть варіант");
    return null;
  },

  partying: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === "") return i18n.t("validations.partying_required", "Оберіть варіант");
    return null;
  },

  hobbies: (value) => {
    if (!Array.isArray(value) || value.length === 0) return i18n.t("validations.hobbies_required", "Оберіть хоча б одне хобі");
    let presetCount = 0;
    let customCount = 0;
    for (const tag of value) {
      const v = tag?.value !== undefined ? tag.value : tag;
      if (typeof v === 'number') {
        presetCount += 1;
      } else if (typeof v === 'string') {
        customCount += 1;
        if (v.length > 50) return i18n.t("validations.hobbies_custom_max", "Кастомне хобі: макс. 50 символів");
      }
    }
    if (presetCount > 10) return i18n.t("validations.hobbies_preset_max_10", "Максимум 10 хобі зі списку");
    if (customCount > 5) return i18n.t("validations.hobbies_custom_max_5", "Максимум 5 кастомних хобі");
    return null;
  },

  // ---------------- Step 3: Проживання ----------------

  room_sharing_preference: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return i18n.t("validations.room_sharing_required", "Оберіть свою преференцію");
    return null;
  },

  preferred_gender: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return i18n.t("validations.preferred_gender_required", "Оберіть із ким ви б хотіли проживати");
    return null;
  },

  housing_status: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return i18n.t("validations.housing_status_required", "Оберіть ваш статус");
    return null;
  },

  budget_min: (value) => {
    const n = Number(value);
    if (!n) return i18n.t("validations.budget_min_required", "Вкажіть мінімальний бюджет");
    if (n < 500) return i18n.t("validations.budget_min_500", "Мінімум 500 грн");
    return null;
  },

  budget_max: (value) => {
    const n = Number(value);
    if (!n) return i18n.t("validations.budget_max_required", "Вкажіть максимальний бюджет");
    if (n > 100000) return i18n.t("validations.budget_max_100000", "Максимум 100000 грн");
    return null;
  },

  destination: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return i18n.t("validations.destination_required", "Оберіть місто");
    return null;
  },

  preferred_districts: (value) => {
    if (!Array.isArray(value) || value.length === 0) return i18n.t("validations.districts_required", "Оберіть хоча б один район");
    if (value.length > 10) return i18n.t("validations.districts_max_10", "Максимум 10 районів");
    return null;
  },

  planned_duration: (value) => {
    const id = getId(value);
    if (id === undefined || id === null || id === 0) return i18n.t("validations.planned_duration_required", "Оберіть термін");
    return null;
  },

  move_in_date: (value) => {
    if (!value) return i18n.t("validations.move_in_date_required", "Вкажіть дату");
    const d = new Date(value);
    if (isNaN(d.getTime())) return i18n.t("validations.date_invalid", "Невірна дата");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return i18n.t("validations.date_past", "Дата не може бути в минулому");
    return null;
  },

  has_pet: (value) => {
    if (value === undefined || value === null) return i18n.t("validations.has_pet_required", "Оберіть варіант");
    if (typeof value === 'object' && value.value === undefined) return i18n.t("validations.has_pet_required", "Оберіть варіант");
    return null;
  },

  pet_description: (value) => {
    if (!value) return i18n.t("validations.pet_description_required", "Опишіть улюбленця");
    if (value.length < 3) return i18n.t("validations.min_3", "Мінімум 3 символи");
    if (value.length > 100) return i18n.t("validations.max_100", "Максимум 100 символів");
    return null;
  },
};
