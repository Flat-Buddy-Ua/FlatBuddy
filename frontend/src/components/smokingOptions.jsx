import i18n from 'i18next';

export const smokingOptions = [
    { value: 1, get label() { return i18n.t('step2.smoking_options.1', 'Палю'); } },
    { value: 2, get label() { return i18n.t('step2.smoking_options.2', 'Іноді палю'); } },
    { value: 3, get label() { return i18n.t('step2.smoking_options.3', 'Не палю, але це не проблема для мене'); } },
    { value: 4, get label() { return i18n.t('step2.smoking_options.4', 'Проти паління'); } },
];
