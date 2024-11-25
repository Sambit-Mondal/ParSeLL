import { NextRequest, NextResponse } from 'next/server';

const countryLanguageMap = {
    'AF': 'fa',   // Afghanistan -> Dari Persian
    'AL': 'sq',   // Albania -> Albanian
    'DZ': 'ar',   // Algeria -> Arabic
    'AD': 'ca',   // Andorra -> Catalan
    'AO': 'pt',   // Angola -> Portuguese
    'AR': 'es',   // Argentina -> Spanish
    'AM': 'hy',   // Armenia -> Armenian
    'AU': 'en',   // Australia -> English
    'AT': 'de',   // Austria -> German
    'AZ': 'az',   // Azerbaijan -> Azerbaijani
    'BS': 'en',   // Bahamas -> English
    'BH': 'ar',   // Bahrain -> Arabic
    'BD': 'bn',   // Bangladesh -> Bengali
    'BY': 'be',   // Belarus -> Belarusian
    'BE': 'nl',   // Belgium -> Dutch
    'BZ': 'en',   // Belize -> English
    'BJ': 'fr',   // Benin -> French
    'BT': 'dz',   // Bhutan -> Dzongkha
    'BO': 'es',   // Bolivia -> Spanish
    'BA': 'bs',   // Bosnia and Herzegovina -> Bosnian
    'BW': 'en',   // Botswana -> English
    'BR': 'pt',   // Brazil -> Portuguese
    'BN': 'ms',   // Brunei -> Malay
    'BG': 'bg',   // Bulgaria -> Bulgarian
    'BF': 'fr',   // Burkina Faso -> French
    'BI': 'fr',   // Burundi -> French
    'KH': 'km',   // Cambodia -> Khmer
    'CM': 'fr',   // Cameroon -> French
    'CA': 'en',   // Canada -> English
    'CV': 'pt',   // Cape Verde -> Portuguese
    'CF': 'fr',   // Central African Republic -> French
    'TD': 'fr',   // Chad -> French
    'CL': 'es',   // Chile -> Spanish
    'CN': 'zh',   // China -> Chinese
    'CO': 'es',   // Colombia -> Spanish
    'KM': 'fr',   // Comoros -> French
    'CD': 'fr',   // Congo, Democratic Republic -> French
    'CG': 'fr',   // Congo, Republic -> French
    'CR': 'es',   // Costa Rica -> Spanish
    'CI': 'fr',   // Côte d'Ivoire -> French
    'HR': 'hr',   // Croatia -> Croatian
    'CU': 'es',   // Cuba -> Spanish
    'CY': 'el',   // Cyprus -> Greek
    'CZ': 'cs',   // Czech Republic -> Czech
    'DK': 'da',   // Denmark -> Danish
    'DJ': 'fr',   // Djibouti -> French
    'DM': 'en',   // Dominica -> English
    'DO': 'es',   // Dominican Republic -> Spanish
    'EC': 'es',   // Ecuador -> Spanish
    'EG': 'ar',   // Egypt -> Arabic
    'SV': 'es',   // El Salvador -> Spanish
    'GQ': 'es',   // Equatorial Guinea -> Spanish
    'ER': 'ti',   // Eritrea -> Tigrinya
    'EE': 'et',   // Estonia -> Estonian
    'SZ': 'en',   // Eswatini -> English
    'ET': 'am',   // Ethiopia -> Amharic
    'FJ': 'en',   // Fiji -> English
    'FI': 'fi',   // Finland -> Finnish
    'FR': 'fr',   // France -> French
    'GA': 'fr',   // Gabon -> French
    'GM': 'en',   // Gambia -> English
    'GE': 'ka',   // Georgia -> Georgian
    'DE': 'de',   // Germany -> German
    'GH': 'en',   // Ghana -> English
    'GR': 'el',   // Greece -> Greek
    'GT': 'es',   // Guatemala -> Spanish
    'GN': 'fr',   // Guinea -> French
    'GW': 'pt',   // Guinea-Bissau -> Portuguese
    'GY': 'en',   // Guyana -> English
    'HT': 'fr',   // Haiti -> French
    'HN': 'es',   // Honduras -> Spanish
    'HU': 'hu',   // Hungary -> Hungarian
    'IS': 'is',   // Iceland -> Icelandic
    'IN': 'hi',   // India -> Hindi
    'ID': 'id',   // Indonesia -> Indonesian
    'IR': 'fa',   // Iran -> Persian
    'IQ': 'ar',   // Iraq -> Arabic
    'IE': 'en',   // Ireland -> English
    'IL': 'he',   // Israel -> Hebrew
    'IT': 'it',   // Italy -> Italian
    'JM': 'en',   // Jamaica -> English
    'JP': 'ja',   // Japan -> Japanese
    'JO': 'ar',   // Jordan -> Arabic
    'KZ': 'kk',   // Kazakhstan -> Kazakh
    'KE': 'sw',   // Kenya -> Swahili
    'KI': 'en',   // Kiribati -> English
    'KW': 'ar',   // Kuwait -> Arabic
    'KG': 'ky',   // Kyrgyzstan -> Kyrgyz
    'LA': 'lo',   // Laos -> Lao
    'LV': 'lv',   // Latvia -> Latvian
    'LB': 'ar',   // Lebanon -> Arabic
    'LS': 'en',   // Lesotho -> English
    'LR': 'en',   // Liberia -> English
    'LY': 'ar',   // Libya -> Arabic
    'LI': 'de',   // Liechtenstein -> German
    'LT': 'lt',   // Lithuania -> Lithuanian
    'LU': 'fr',   // Luxembourg -> French
    'MG': 'mg',   // Madagascar -> Malagasy
    'MW': 'en',   // Malawi -> English
    'MY': 'ms',   // Malaysia -> Malay
    'MV': 'dv',   // Maldives -> Dhivehi
    'ML': 'fr',   // Mali -> French
    'MT': 'mt',   // Malta -> Maltese
    'MH': 'en',   // Marshall Islands -> English
    'MR': 'ar',   // Mauritania -> Arabic
    'MU': 'mfe',  // Mauritius -> Mauritian Creole
    'MX': 'es',   // Mexico -> Spanish
    'FM': 'en',   // Micronesia -> English
    'MD': 'ro',   // Moldova -> Romanian
    'MC': 'fr',   // Monaco -> French
    'MN': 'mn',   // Mongolia -> Mongolian
    'ME': 'sr',   // Montenegro -> Serbian
    'MA': 'ar',   // Morocco -> Arabic
    'MZ': 'pt',   // Mozambique -> Portuguese
    'MM': 'my',   // Myanmar -> Burmese
    'NA': 'en',   // Namibia -> English
    'NR': 'en',   // Nauru -> English
    'NP': 'ne',   // Nepal -> Nepali
    'NL': 'nl',   // Netherlands -> Dutch
    'NZ': 'en',   // New Zealand -> English
    'NI': 'es',   // Nicaragua -> Spanish
    'NE': 'fr',   // Niger -> French
    'NG': 'en',   // Nigeria -> English
    'KP': 'ko',   // North Korea -> Korean
    'MK': 'mk',   // North Macedonia -> Macedonian
    'NO': 'no',   // Norway -> Norwegian
    'OM': 'ar',   // Oman -> Arabic
    'PK': 'ur',   // Pakistan -> Urdu
    'PW': 'en',   // Palau -> English
    'PS': 'ar',   // Palestine -> Arabic
    'PA': 'es',   // Panama -> Spanish
    'PG': 'en',   // Papua New Guinea -> English
    'PY': 'es',   // Paraguay -> Spanish
    'PE': 'es',   // Peru -> Spanish
    'PH': 'tl',   // Philippines -> Filipino
    'PL': 'pl',   // Poland -> Polish
    'PT': 'pt',   // Portugal -> Portuguese
    'QA': 'ar',   // Qatar -> Arabic
    'RO': 'ro',   // Romania -> Romanian
    'RU': 'ru',   // Russia -> Russian
    'RW': 'rw',   // Rwanda -> Kinyarwanda
    'KN': 'en',   // Saint Kitts and Nevis -> English
    'LC': 'en',   // Saint Lucia -> English
    'VC': 'en',   // Saint Vincent and the Grenadines -> English
    'WS': 'sm',   // Samoa -> Samoan
    'SM': 'it',   // San Marino -> Italian
    'ST': 'pt',   // São Tomé and Príncipe -> Portuguese
    'SA': 'ar',   // Saudi Arabia -> Arabic
    'SN': 'fr',   // Senegal -> French
    'RS': 'sr',   // Serbia -> Serbian
    'SC': 'en',   // Seychelles -> English
    'SL': 'en',   // Sierra Leone -> English
    'SG': 'en',   // Singapore -> English
    'SK': 'sk',   // Slovakia -> Slovak
    'SI': 'sl',   // Slovenia -> Slovenian
    'SB': 'en',   // Solomon Islands -> English
    'SO': 'so',   // Somalia -> Somali
    'ZA': 'af',   // South Africa -> Afrikaans
    'KR': 'ko',   // South Korea -> Korean
    'SS': 'en',   // South Sudan -> English
    'ES': 'es',   // Spain -> Spanish
    'LK': 'si',   // Sri Lanka -> Sinhala
    'SD': 'ar',   // Sudan -> Arabic
    'SR': 'nl',   // Suriname -> Dutch
    'SE': 'sv',   // Sweden -> Swedish
    'CH': 'de',   // Switzerland -> German
    'SY': 'ar',   // Syria -> Arabic
    'TW': 'zh',   // Taiwan -> Chinese
    'TJ': 'tg',   // Tajikistan -> Tajik
    'TZ': 'sw',   // Tanzania -> Swahili
    'TH': 'th',   // Thailand -> Thai
    'TL': 'pt',   // Timor-Leste -> Portuguese
    'TG': 'fr',   // Togo -> French
    'TO': 'en',   // Tonga -> English
    'TT': 'en',   // Trinidad and Tobago -> English
    'TN': 'ar',   // Tunisia -> Arabic
    'TR': 'tr',   // Turkey -> Turkish
    'TM': 'tk',   // Turkmenistan -> Turkmen
    'TV': 'en',   // Tuvalu -> English
    'UG': 'en',   // Uganda -> English
    'UA': 'uk',   // Ukraine -> Ukrainian
    'AE': 'ar',   // United Arab Emirates -> Arabic
    'GB': 'en',   // United Kingdom -> English
    'US': 'en',   // United States -> English
    'UY': 'es',   // Uruguay -> Spanish
    'UZ': 'uz',   // Uzbekistan -> Uzbek
    'VU': 'bi',   // Vanuatu -> Bislama
    'VA': 'it',   // Vatican City -> Italian
    'VE': 'es',   // Venezuela -> Spanish
    'VN': 'vi',   // Vietnam -> Vietnamese
    'YE': 'ar',   // Yemen -> Arabic
    'ZM': 'en',   // Zambia -> English
    'ZW': 'en',   // Zimbabwe -> English
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country') as keyof typeof countryLanguageMap;

    if (!country || !countryLanguageMap[country]) {
        return NextResponse.json({ success: false, message: 'Invalid or missing country parameter' }, { status: 400 });
    }

    const language = countryLanguageMap[country];

    return NextResponse.json({ success: true, language });
}