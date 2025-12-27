// validations.js
export const validations = {
  // Для поля "Ім'я"
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

    return null; // null означає "помилки немає"
  },
  
  // Для поля "Прізвище"
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
  
  // Для поля "Гендер" (селект)
  gender: (value) => {
    const validGenders = ['Чоловік', 'Жінка', 'Інше'];
    if (!validGenders.includes(value)) {
      return "Оберіть один з варіантів";
    }
    return null;
  },
  
  // Для дати народження
  birthDate: (value) => {
    if (!value) return "Дата обов'язкова";
    const birthDate = new Date(value);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) return "Мінімум 18 років";
    if (age > 120) return "Некоректна дата";
    return null;
  },
  
  // Для email
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

  passwordConfirm: (value, allValues) => {
    console.log("Validating passwordConfirm with value:", value, "and allValues:", allValues);

    if (!value?.trim()) return "Підтвердження пароля обов'язкове";

    // 🔑 якщо password ще нема — не валідимо confirm
    if (!allValues?.password?.value) return null;

    // 🔑 якщо password невалідний — confirm мовчить
    if (!allValues.password.isValid) return null;

    if (value !== allValues.password.value) return "Паролі не співпадають";

    return null;
  }

};