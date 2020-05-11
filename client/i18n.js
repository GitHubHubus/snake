import i18n from 'i18next';
import langEn from './locales/en/translation';
import langRu from './locales/ru/translation';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import settings from './settings.json';

const resources = {
    en: {
        translation: langEn
    },
    ru: {
        translation: langRu
    }
};

i18n
    // load translation using xhr -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-xhr-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng: 'en',
        debug: settings.env === 'dev',

        interpolation: {
            escapeValue: false,
        },
    });


export default i18n;