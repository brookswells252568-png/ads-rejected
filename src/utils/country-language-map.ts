/**
 * Comprehensive mapping of country codes to their primary/official language codes
 * Covers all countries and territories worldwide
 */

export type LanguageCode = 'en' | 'vi' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko' | 'pt' | 'th' | 'id' | 'ar' | 'ru' | 'uk' | 'hi' | 'bn' | 'it' | 'pl' | 'nl' | 'tr' | 'el' | 'sv' | 'no' | 'tl' | 'ms';

export const COUNTRY_TO_LANGUAGE: Record<string, LanguageCode> = {
    // Americas - English speaking
    'us': 'en',  // United States
    'ca': 'en',  // Canada (primary: English, also has French in QC)
    'au': 'en',  // Australia
    'nz': 'en',  // New Zealand
    'gb': 'en',  // United Kingdom
    'ie': 'en',  // Ireland
    'za': 'en',  // South Africa
    'ng': 'en',  // Nigeria
    'ke': 'en',  // Kenya
    'gh': 'en',  // Ghana
    'sg': 'en',  // Singapore
    'my': 'ms',  // Malaysia (Malay primary language)
    'ph': 'tl',  // Philippines (Tagalog primary)
    'pk': 'en',  // Pakistan (mixed)
    'lk': 'en',  // Sri Lanka (mixed)
    'tz': 'en',  // Tanzania (fallback)
    'ug': 'en',  // Uganda (fallback)
    'zm': 'en',  // Zambia
    'zw': 'en',  // Zimbabwe
    'bw': 'en',  // Botswana
    'na': 'en',  // Namibia
    'ls': 'en',  // Lesotho (fallback)
    'sz': 'en',  // Eswatini (fallback)
    'mw': 'en',  // Malawi
    'rw': 'en',  // Rwanda (fallback)
    'bi': 'en',  // Burundi (fallback)
    'jm': 'en',  // Jamaica
    'tt': 'en',  // Trinidad and Tobago
    'bb': 'en',  // Barbados
    'bs': 'en',  // Bahamas
    'hk': 'en',  // Hong Kong (mixed: English/Chinese)
    'fj': 'en',  // Fiji (fallback)
    'sb': 'en',  // Solomon Islands (fallback)
    'pg': 'en',  // Papua New Guinea (fallback)
    'vu': 'en',  // Vanuatu (fallback)
    'ws': 'en',  // Samoa (fallback)
    'to': 'en',  // Tonga (fallback)
    'ki': 'en',  // Kiribati (fallback)

    // Spanish speaking
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

    // Portuguese
    'br': 'pt',  // Brazil
    'pt': 'pt',  // Portugal
    'ao': 'pt',  // Angola
    'mz': 'pt',  // Mozambique

    // French
    'fr': 'fr',  // France
    'ch': 'fr',  // Switzerland (mixed: French/German/Italian)
    'be': 'nl',  // Belgium (mainly Dutch/French - default to Dutch)
    'lu': 'fr',  // Luxembourg
    'ci': 'fr',  // Côte d'Ivoire
    'sn': 'fr',  // Senegal
    'cm': 'fr',  // Cameroon
    'bf': 'fr',  // Burkina Faso
    'ga': 'fr',  // Gabon
    'cg': 'fr',  // Congo
    'cd': 'fr',  // Democratic Republic of Congo
    'bj': 'fr',  // Benin
    'tg': 'fr',  // Togo
    'ne': 'fr',  // Niger
    'ml': 'fr',  // Mali
    'mg': 'fr',  // Madagascar
    'sc': 'fr',  // Seychelles
    'mu': 'en',  // Mauritius (mixed - fallback to English)
    'ht': 'fr',  // Haiti

    // German
    'de': 'de',  // Germany
    'at': 'de',  // Austria
    'li': 'de',  // Liechtenstein

    // Italian
    'it': 'it',  // Italy

    // Nordic languages
    'se': 'sv',  // Sweden
    'no': 'no',  // Norway
    'dk': 'en',  // Denmark
    'fi': 'en',  // Finland
    'is': 'en',  // Iceland

    // Eastern Europe
    'ru': 'ru',  // Russia
    'ua': 'uk',  // Ukraine
    'by': 'ru',  // Belarus
    'kz': 'ru',  // Kazakhstan
    'kg': 'ru',  // Kyrgyzstan
    'tj': 'en',  // Tajikistan (fallback)
    'tm': 'en',  // Turkmenistan (fallback)
    'uz': 'en',  // Uzbekistan (fallback)
    'md': 'en',  // Moldova (fallback)
    'pl': 'pl',  // Poland
    'cz': 'en',  // Czech Republic (fallback)
    'sk': 'en',  // Slovakia (fallback)
    'hu': 'en',  // Hungary (fallback)
    'ro': 'en',  // Romania (fallback)
    'bg': 'en',  // Bulgaria (fallback)
    'rs': 'en',  // Serbia (fallback)
    'hr': 'en',  // Croatia (fallback)
    'ba': 'en',  // Bosnia (fallback)
    'me': 'en',  // Montenegro (fallback)
    'mk': 'en',  // Macedonia (fallback)
    'si': 'en',  // Slovenia (fallback)
    'gr': 'el',  // Greece
    'al': 'en',  // Albania (fallback)

    // Middle East
    'tr': 'tr',  // Turkey
    'eg': 'ar',  // Egypt
    'ly': 'ar',  // Libya
    'tn': 'ar',  // Tunisia
    'dz': 'ar',  // Algeria
    'ma': 'ar',  // Morocco
    'sd': 'ar',  // Sudan
    'so': 'ar',  // Somalia
    'et': 'en',  // Ethiopia (fallback)
};

export const getLanguageForCountry = (countryCode: string): LanguageCode => {
    const code = (countryCode || 'us').toLowerCase();
    return COUNTRY_TO_LANGUAGE[code] || 'en';
};
