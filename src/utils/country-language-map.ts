/**
 * Comprehensive mapping of country codes (ISO 3166-1 alpha-2, lowercase)
 * to our supported LanguageCode values. Countries whose native language is
 * not in our supported set fall back to 'en'.
 */

export type LanguageCode = 'en' | 'vi' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko' | 'pt' | 'th' | 'id' | 'ar' | 'ru' | 'uk' | 'hi' | 'bn' | 'it' | 'pl' | 'nl' | 'tr' | 'el' | 'sv' | 'no' | 'tl' | 'ms';

export const COUNTRY_TO_LANGUAGE: Record<string, LanguageCode> = {
    // Southeast Asia
    'vn': 'vi',  // Vietnam
    'th': 'th',  // Thailand
    'id': 'id',  // Indonesia
    'my': 'ms',  // Malaysia
    'ph': 'tl',  // Philippines
    'sg': 'zh',  // Singapore
    'bn': 'ms',  // Brunei
    'mm': 'en',  // Myanmar
    'kh': 'en',  // Cambodia
    'la': 'en',  // Laos
    'tl': 'en',  // Timor-Leste
    // East Asia
    'cn': 'zh',  // China
    'tw': 'zh',  // Taiwan
    'hk': 'zh',  // Hong Kong
    'mo': 'zh',  // Macau
    'jp': 'ja',  // Japan
    'kr': 'ko',  // South Korea
    'kp': 'ko',  // North Korea
    'mn': 'en',  // Mongolia
    // South Asia
    'in': 'hi',  // India
    'bd': 'bn',  // Bangladesh
    'pk': 'en',  // Pakistan
    'lk': 'en',  // Sri Lanka
    'np': 'en',  // Nepal
    'bt': 'en',  // Bhutan
    'mv': 'en',  // Maldives
    // Middle East and Arabic
    'sa': 'ar',  // Saudi Arabia
    'ae': 'ar',  // UAE
    'kw': 'ar',  // Kuwait
    'bh': 'ar',  // Bahrain
    'qa': 'ar',  // Qatar
    'om': 'ar',  // Oman
    'ye': 'ar',  // Yemen
    'jo': 'ar',  // Jordan
    'lb': 'ar',  // Lebanon
    'sy': 'ar',  // Syria
    'iq': 'ar',  // Iraq
    'ps': 'ar',  // Palestine
    'eg': 'ar',  // Egypt
    'ly': 'ar',  // Libya
    'tn': 'ar',  // Tunisia
    'dz': 'ar',  // Algeria
    'ma': 'ar',  // Morocco
    'sd': 'ar',  // Sudan
    'so': 'ar',  // Somalia
    'eh': 'ar',  // Western Sahara
    'mr': 'ar',  // Mauritania
    'km': 'ar',  // Comoros
    'dj': 'ar',  // Djibouti
    'il': 'en',  // Israel
    'ir': 'en',  // Iran
    'af': 'en',  // Afghanistan
    // Turkey
    'tr': 'tr',  // Turkey
    // English-speaking
    'us': 'en',  // United States
    'gb': 'en',  // United Kingdom
    'ca': 'en',  // Canada
    'au': 'en',  // Australia
    'nz': 'en',  // New Zealand
    'ie': 'en',  // Ireland
    'za': 'en',  // South Africa
    'ng': 'en',  // Nigeria
    'ke': 'en',  // Kenya
    'gh': 'en',  // Ghana
    'tz': 'en',  // Tanzania
    'ug': 'en',  // Uganda
    'zm': 'en',  // Zambia
    'zw': 'en',  // Zimbabwe
    'bw': 'en',  // Botswana
    'na': 'en',  // Namibia
    'ls': 'en',  // Lesotho
    'sz': 'en',  // Eswatini
    'mw': 'en',  // Malawi
    'rw': 'en',  // Rwanda
    'bi': 'en',  // Burundi
    'jm': 'en',  // Jamaica
    'tt': 'en',  // Trinidad and Tobago
    'bb': 'en',  // Barbados
    'bs': 'en',  // Bahamas
    'fj': 'en',  // Fiji
    'sb': 'en',  // Solomon Islands
    'pg': 'en',  // Papua New Guinea
    'vu': 'en',  // Vanuatu
    'ws': 'en',  // Samoa
    'to': 'en',  // Tonga
    'ki': 'en',  // Kiribati
    'mu': 'en',  // Mauritius
    'pw': 'en',  // Palau
    'fm': 'en',  // Micronesia
    'mh': 'en',  // Marshall Islands
    'mp': 'en',  // N. Mariana Islands
    'gu': 'en',  // Guam
    'as': 'en',  // American Samoa
    'ck': 'en',  // Cook Islands
    'nu': 'en',  // Niue
    'nf': 'en',  // Norfolk Island
    'tv': 'en',  // Tuvalu
    'nr': 'en',  // Nauru
    'ky': 'en',  // Cayman Islands
    'vg': 'en',  // British Virgin Islands
    'vi': 'en',  // US Virgin Islands
    'ag': 'en',  // Antigua and Barbuda
    'lc': 'en',  // Saint Lucia
    'vc': 'en',  // Saint Vincent
    'gd': 'en',  // Grenada
    'kn': 'en',  // Saint Kitts and Nevis
    'dm': 'en',  // Dominica
    'sl': 'en',  // Sierra Leone
    'lr': 'en',  // Liberia
    'gm': 'en',  // Gambia
    'er': 'en',  // Eritrea
    'ss': 'en',  // South Sudan
    'et': 'en',  // Ethiopia
    // Spanish
    'es': 'es',  // Spain
    'mx': 'es',  // Mexico
    'ar': 'es',  // Argentina
    'cl': 'es',  // Chile
    'co': 'es',  // Colombia
    'pe': 'es',  // Peru
    've': 'es',  // Venezuela
    'ec': 'es',  // Ecuador
    'bo': 'es',  // Bolivia
    'py': 'es',  // Paraguay
    'uy': 'es',  // Uruguay
    'cr': 'es',  // Costa Rica
    'pa': 'es',  // Panama
    'ni': 'es',  // Nicaragua
    'sv': 'es',  // El Salvador
    'gt': 'es',  // Guatemala
    'hn': 'es',  // Honduras
    'do': 'es',  // Dominican Republic
    'cu': 'es',  // Cuba
    'pr': 'es',  // Puerto Rico
    'gq': 'es',  // Equatorial Guinea
    // Portuguese
    'br': 'pt',  // Brazil
    'pt': 'pt',  // Portugal
    'ao': 'pt',  // Angola
    'mz': 'pt',  // Mozambique
    'cv': 'pt',  // Cape Verde
    'gw': 'pt',  // Guinea-Bissau
    'st': 'pt',  // Sao Tome
    // French
    'fr': 'fr',  // France
    'lu': 'fr',  // Luxembourg
    'be': 'fr',  // Belgium
    'ch': 'fr',  // Switzerland
    'mc': 'fr',  // Monaco
    'ci': 'fr',  // Cote d Ivoire
    'sn': 'fr',  // Senegal
    'cm': 'fr',  // Cameroon
    'bf': 'fr',  // Burkina Faso
    'ga': 'fr',  // Gabon
    'cg': 'fr',  // Republic of Congo
    'cd': 'fr',  // DR Congo
    'bj': 'fr',  // Benin
    'tg': 'fr',  // Togo
    'ne': 'fr',  // Niger
    'ml': 'fr',  // Mali
    'mg': 'fr',  // Madagascar
    'ht': 'fr',  // Haiti
    'gn': 'fr',  // Guinea
    'td': 'fr',  // Chad
    'cf': 'fr',  // Central African Republic
    'sc': 'fr',  // Seychelles
    'mf': 'fr',  // Saint Martin
    'gp': 'fr',  // Guadeloupe
    'mq': 'fr',  // Martinique
    'gf': 'fr',  // French Guiana
    'pf': 'fr',  // French Polynesia
    'nc': 'fr',  // New Caledonia
    'pm': 'fr',  // Saint Pierre
    'wf': 'fr',  // Wallis and Futuna
    're': 'fr',  // Reunion
    'yt': 'fr',  // Mayotte
    // German
    'de': 'de',  // Germany
    'at': 'de',  // Austria
    'li': 'de',  // Liechtenstein
    // Italian
    'it': 'it',  // Italy
    'sm': 'it',  // San Marino
    'va': 'it',  // Vatican
    // Dutch
    'nl': 'nl',  // Netherlands
    'sr': 'nl',  // Suriname
    'aw': 'nl',  // Aruba
    'cw': 'nl',  // Curacao
    // Nordic
    'se': 'sv',  // Sweden
    'no': 'no',  // Norway
    'dk': 'en',  // Denmark
    'fi': 'en',  // Finland
    'is': 'en',  // Iceland
    'fo': 'en',  // Faroe Islands
    // Eastern Europe and CIS
    'ru': 'ru',  // Russia
    'ua': 'uk',  // Ukraine
    'by': 'ru',  // Belarus
    'kz': 'ru',  // Kazakhstan
    'kg': 'ru',  // Kyrgyzstan
    'pl': 'pl',  // Poland
    'gr': 'el',  // Greece
    'cy': 'el',  // Cyprus
    'tj': 'en',  // Tajikistan
    'tm': 'en',  // Turkmenistan
    'uz': 'en',  // Uzbekistan
    'md': 'en',  // Moldova
    'am': 'en',  // Armenia
    'az': 'en',  // Azerbaijan
    'ge': 'en',  // Georgia (country)
    'cz': 'en',  // Czech Republic
    'sk': 'en',  // Slovakia
    'hu': 'en',  // Hungary
    'ro': 'en',  // Romania
    'bg': 'en',  // Bulgaria
    'rs': 'en',  // Serbia
    'hr': 'en',  // Croatia
    'ba': 'en',  // Bosnia
    'me': 'en',  // Montenegro
    'mk': 'en',  // North Macedonia
    'si': 'en',  // Slovenia
    'al': 'en',  // Albania
    'xk': 'en',  // Kosovo
    'ee': 'en',  // Estonia
    'lv': 'en',  // Latvia
    'lt': 'en',  // Lithuania
};

/**
 * Get language code for a given country code.
 * Accepts both uppercase (US, VN) and lowercase (us, vn).
 */
export const getLanguageForCountry = (countryCode: string): LanguageCode => {
    const code = (countryCode || '').toLowerCase().trim();
    return COUNTRY_TO_LANGUAGE[code] || 'en';
};

/**
 * Map a browser navigator.language string to our LanguageCode.
 * e.g. "vi-VN" -> "vi", "zh-CN" -> "zh", "ko-KR" -> "ko"
 */
export const getLanguageFromBrowserLocale = (locale: string): LanguageCode => {
    const lang = (locale || 'en').split('-')[0].toLowerCase();
    const valid: LanguageCode[] = ['en','vi','es','fr','de','ja','zh','ko','pt','th','id','ar','ru','uk','hi','bn','it','pl','nl','tr','el','sv','no','tl','ms'];
    return valid.includes(lang as LanguageCode) ? (lang as LanguageCode) : 'en';
};
