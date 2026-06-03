import i18n from 'i18next';

export const partyingOptions = [
    { value: 1, get label() { return i18n.t('step2.partying_options.1', 'Люблю вечірки/гостей'); } },
    { value: 2, get label() { return i18n.t('step2.partying_options.2', 'Іноді люблю вечірки/гостей'); } },
    { value: 3, get label() { return i18n.t('step2.partying_options.3', 'Це не проблема для мене'); } },
    { value: 4, get label() { return i18n.t('step2.partying_options.4', 'Проти вечірок/гостей'); } },
];
