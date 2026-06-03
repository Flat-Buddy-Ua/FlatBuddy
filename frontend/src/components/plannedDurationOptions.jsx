import i18n from 'i18next';

export const plannedDurationOptions = [
    { value: 1, get label() { return i18n.t('step3.duration_options.1', 'Менше 6 місяців'); } },
    { value: 2, get label() { return i18n.t('step3.duration_options.2', 'Від 6 до 12 місяців'); } },
    { value: 3, get label() { return i18n.t('step3.duration_options.3', 'Більше 1 року'); } },
];
