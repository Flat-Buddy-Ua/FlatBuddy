import { lang } from "moment";

// validations.js
export const validations = {

  name: (value) => {
    if (!value.trim()) return "Ім'я обов'язкове";
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
    if (!value.trim()) return "Прізвище обов'язкове";
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
  
  country: (value) => {
    if (!value || value === 0) return "Оберіть країну";
    return null;
  },

  city: (value) => {
    if (!value || value === 0) return "Оберіть місто";
    return null;
  },

  gender: (value) => {
    if (!value || value === 0) return "Оберіть стать";
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
    if (!value.trim()) return "Email обов'язковий";
    if (!/\S+@\S+\.\S+/.test(value)) {
      return "Введіть коректний email";
    }
    return null;
  },

  phone: (value) => {
    if (!value.trim()) return "Телефон обов'зковий";
    
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
  },

  password: (value) => {
    if (!value.trim()) return "Пароль обов'язковий";
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
    console.log("Validating passwordConfirm with value:", value, "and allValues:", allValues);

    if (!value?.trim()) return "Підтвердження пароля обов'язкове";

    // 🔑 якщо password ще нема — не валідимо confirm
    if (!allValues?.password?.realValue) return null;

    // 🔑 якщо password невалідний — confirm мовчить
    if (!allValues.password.isValid) return null;

    if (value !== allValues.password.realValue) return "Паролі не співпадають";

    return null;
  },

  university: (value) => {
    if (!value || value === 0) return "Вкажіть університет";
    return null;
  },
  
  faculty: (value) => {
    if (!value) return "Вкажіть факультет";
    if (value.length < 2) return "Як мінімум 2 символи";
    if (value.length > 50) return "Максимум 50 символів";
    return null;
  },

  course: (value) => {
    if (!value) return "Вкажіть курс";
    if (value.length < 2) return "Як мінімум 2 символи";
    if (value.length > 50) return "Максимум 50 символів";
    return null;
  },

  languages: (value) => {
    if (!value || value.length === 0) return "Оберіть мови";
    return null;
  },

  cleanliness: (value) => {
    if (!value) return "Оберіть рівень охайності";
    return null;
  },

  bad_habits: (value) => {
    if (!value) return "Опишіть ваші шкідливі звички";
    if (value.length < 2) return "Як мінімум 2 символи";
    if (value.length > 100) return "Максимум 100 символів";
    return null;
  },

  mbti: (value) => {
    if (!value) return "Оберіть ваш MBTI тип";
    if (value === 0) return "Вкажіть ваш MBTI тип";
    return null;
  },

  hobby: (value) => {
    if (!value) return "Вкажіть захоплення/хобі";
    if (value.length < 2) return "Як мінімум 2 символи";
    if (value.length > 200) return "Максимум 200 символів";
    return null;
  },

  biography: (value) => {
    if (!value) return "Вкажіть біографію";
    if (value.length < 2) return "Як мінімум 2 символи";
    if (value.length > 300) return "Максимум 300 символів";
    return null;
  },

  looking_for: (value) => {
    if (!value) return "Вкажіть, кого шукаєте";
    if (value.length < 2) return "Як мінімум 2 символи";
    if (value.length > 200) return "Максимум 200 символів";
    return null;
  },

  room_sharing_preference: (value) => {
    if (value === undefined || value === null || value === 0) return "Оберіть свою преференцію";
    return null;
  },

  preferred_gender: (value) => {
    if (value === undefined || value === null || value === 0) return "Оберіть із ким ви б хотіли проживати";
    return null;
  },

  housing_status: (value) => {
    if (value === undefined || value === null || value === 0) return "Оберіть ваш статус";
    return null;
  },

  budget: (value) => {
    if (!value) return "Вкажіть ваш бюджет";
    // if (value < 1000) return "Мінімальний бюджет 1000 грн";
    return null;
  },

  // Тут будуть валідації для districts

  planned_duration: (value) => {
    if (!value) return "Вкажіть відповідь";
    if (value.length < 2) return "Як мінімум 2 символи";
    if (value.length > 50) return "Максимум 50 символів";
    return null;
  },

  move_in_date: (value) => {
    if (!value) return "Вкажіть відповідь";
    if (value.length < 2) return "Як мінімум 2 символи";
    if (value.length > 50) return "Максимум 50 символів";
    return null;
  },

  pet: (value) => {
    if (value === undefined || value === null || value === 0) return "Оберіть відповідь";
    return null;
  },

  pets_description: (value) => {
    if (!value) return "Опишіть ваших улюбленців";
    if (value.length < 2) return "Як мінімум 2 символи";
    if (value.length > 100) return "Максимум 100 символів";
    return null;
  }
};