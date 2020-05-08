import i18next from 'i18next';

const formattedKey = (prefix, key) => {
    return prefix === '' ? key : `${prefix}.${key}`;
};

const translate = (locales, prefix = '') => {
    const keys = Object.keys(locales);
    let result = {};

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i].trim();
        let value = locales[key];

        if (typeof value === 'string') {
            result[key] = i18next.t(formattedKey(prefix, key));
        } else {
            result[key] = translate(value, formattedKey(prefix, key));
        }
    }

    return result;
};

export default translate;
