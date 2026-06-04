import i18n from 'i18next';

export const statusOptions = [
    { value: 1, get label() { return i18n.t('step2.status_options.1', 'Студент'); } },
    { value: 2, get label() { return i18n.t('step2.status_options.2', 'Працюю'); } },
    { value: 3, get label() { return i18n.t('step2.status_options.3', 'Студент і працюю'); } },
];
