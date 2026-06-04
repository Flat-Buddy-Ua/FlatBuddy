import i18n from 'i18next';

export const orbitOptions = [
    { value: 1, get label() { return i18n.t('step2.orbit_options.1', 'STEM та IT'); } },
    { value: 2, get label() { return i18n.t('step2.orbit_options.2', 'Бізнес та Управління'); } },
    { value: 3, get label() { return i18n.t('step2.orbit_options.3', 'Соціальні науки та гуманітарні дисципліни'); } },
    { value: 4, get label() { return i18n.t('step2.orbit_options.4', 'Здоров’я та спорт'); } },
    { value: 5, get label() { return i18n.t('step2.orbit_options.5', 'Творча індустрія та дизайн'); } },
    { value: 6, get label() { return i18n.t('step2.orbit_options.6', 'Освіта та педагогіка'); } },
    { value: 7, get label() { return i18n.t('step2.orbit_options.7', 'Сфера послуг'); } },
    { value: 8, get label() { return i18n.t('step2.orbit_options.8', 'Військова справа, безпека та правоохоронні органи'); } },
    { value: 9, get label() { return i18n.t('step2.orbit_options.9', 'Медицина та охорона здоров’я'); } },
];
