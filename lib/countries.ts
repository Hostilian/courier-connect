// Comprehensive country and language database based on Steam's country list
// Includes all major countries with their languages, currencies, and cultural settings

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  nativeName: string;
  languages: string[]; // ISO 639-1 codes
  primaryLanguage: string;
  currency: string;
  flag: string;
  region: 'EU' | 'NA' | 'SA' | 'ASIA' | 'AFRICA' | 'OCEANIA' | 'MIDDLE_EAST';
  continent: string;
}

export const countries: Country[] = [
  // Europe
  { code: 'AT', name: 'Austria', nativeName: 'Österreich', languages: ['de', 'en'], primaryLanguage: 'de', currency: 'EUR', flag: '🇦🇹', region: 'EU', continent: 'Europe' },
  { code: 'BE', name: 'Belgium', nativeName: 'België', languages: ['nl', 'fr', 'de', 'en'], primaryLanguage: 'nl', currency: 'EUR', flag: '🇧🇪', region: 'EU', continent: 'Europe' },
  { code: 'BG', name: 'Bulgaria', nativeName: 'България', languages: ['bg', 'en'], primaryLanguage: 'bg', currency: 'BGN', flag: '🇧🇬', region: 'EU', continent: 'Europe' },
  { code: 'HR', name: 'Croatia', nativeName: 'Hrvatska', languages: ['hr', 'en'], primaryLanguage: 'hr', currency: 'EUR', flag: '🇭🇷', region: 'EU', continent: 'Europe' },
  { code: 'CY', name: 'Cyprus', nativeName: 'Κύπρος', languages: ['el', 'tr', 'en'], primaryLanguage: 'el', currency: 'EUR', flag: '🇨🇾', region: 'EU', continent: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', nativeName: 'Česká republika', languages: ['cs', 'en'], primaryLanguage: 'cs', currency: 'CZK', flag: '🇨🇿', region: 'EU', continent: 'Europe' },
  { code: 'DK', name: 'Denmark', nativeName: 'Danmark', languages: ['da', 'en'], primaryLanguage: 'da', currency: 'DKK', flag: '🇩🇰', region: 'EU', continent: 'Europe' },
  { code: 'EE', name: 'Estonia', nativeName: 'Eesti', languages: ['et', 'ru', 'en'], primaryLanguage: 'et', currency: 'EUR', flag: '🇪🇪', region: 'EU', continent: 'Europe' },
  { code: 'FI', name: 'Finland', nativeName: 'Suomi', languages: ['fi', 'sv', 'en'], primaryLanguage: 'fi', currency: 'EUR', flag: '🇫🇮', region: 'EU', continent: 'Europe' },
  { code: 'FR', name: 'France', nativeName: 'France', languages: ['fr', 'en'], primaryLanguage: 'fr', currency: 'EUR', flag: '🇫🇷', region: 'EU', continent: 'Europe' },
  { code: 'DE', name: 'Germany', nativeName: 'Deutschland', languages: ['de', 'en'], primaryLanguage: 'de', currency: 'EUR', flag: '🇩🇪', region: 'EU', continent: 'Europe' },
  { code: 'GR', name: 'Greece', nativeName: 'Ελλάδα', languages: ['el', 'en'], primaryLanguage: 'el', currency: 'EUR', flag: '🇬🇷', region: 'EU', continent: 'Europe' },
  { code: 'HU', name: 'Hungary', nativeName: 'Magyarország', languages: ['hu', 'en'], primaryLanguage: 'hu', currency: 'HUF', flag: '🇭🇺', region: 'EU', continent: 'Europe' },
  { code: 'IE', name: 'Ireland', nativeName: 'Éire', languages: ['en', 'ga'], primaryLanguage: 'en', currency: 'EUR', flag: '🇮🇪', region: 'EU', continent: 'Europe' },
  { code: 'IT', name: 'Italy', nativeName: 'Italia', languages: ['it', 'en'], primaryLanguage: 'it', currency: 'EUR', flag: '🇮🇹', region: 'EU', continent: 'Europe' },
  { code: 'LV', name: 'Latvia', nativeName: 'Latvija', languages: ['lv', 'ru', 'en'], primaryLanguage: 'lv', currency: 'EUR', flag: '🇱🇻', region: 'EU', continent: 'Europe' },
  { code: 'LT', name: 'Lithuania', nativeName: 'Lietuva', languages: ['lt', 'ru', 'en'], primaryLanguage: 'lt', currency: 'EUR', flag: '🇱🇹', region: 'EU', continent: 'Europe' },
  { code: 'LU', name: 'Luxembourg', nativeName: 'Lëtzebuerg', languages: ['lb', 'fr', 'de', 'en'], primaryLanguage: 'lb', currency: 'EUR', flag: '🇱🇺', region: 'EU', continent: 'Europe' },
  { code: 'MT', name: 'Malta', nativeName: 'Malta', languages: ['mt', 'en'], primaryLanguage: 'mt', currency: 'EUR', flag: '🇲🇹', region: 'EU', continent: 'Europe' },
  { code: 'NL', name: 'Netherlands', nativeName: 'Nederland', languages: ['nl', 'en'], primaryLanguage: 'nl', currency: 'EUR', flag: '🇳🇱', region: 'EU', continent: 'Europe' },
  { code: 'PL', name: 'Poland', nativeName: 'Polska', languages: ['pl', 'en'], primaryLanguage: 'pl', currency: 'PLN', flag: '🇵🇱', region: 'EU', continent: 'Europe' },
  { code: 'PT', name: 'Portugal', nativeName: 'Portugal', languages: ['pt', 'en'], primaryLanguage: 'pt', currency: 'EUR', flag: '🇵🇹', region: 'EU', continent: 'Europe' },
  { code: 'RO', name: 'Romania', nativeName: 'România', languages: ['ro', 'en'], primaryLanguage: 'ro', currency: 'RON', flag: '🇷🇴', region: 'EU', continent: 'Europe' },
  { code: 'SK', name: 'Slovakia', nativeName: 'Slovensko', languages: ['sk', 'en'], primaryLanguage: 'sk', currency: 'EUR', flag: '🇸🇰', region: 'EU', continent: 'Europe' },
  { code: 'SI', name: 'Slovenia', nativeName: 'Slovenija', languages: ['sl', 'en'], primaryLanguage: 'sl', currency: 'EUR', flag: '🇸🇮', region: 'EU', continent: 'Europe' },
  { code: 'ES', name: 'Spain', nativeName: 'España', languages: ['es', 'ca', 'eu', 'gl', 'en'], primaryLanguage: 'es', currency: 'EUR', flag: '🇪🇸', region: 'EU', continent: 'Europe' },
  { code: 'SE', name: 'Sweden', nativeName: 'Sverige', languages: ['sv', 'en'], primaryLanguage: 'sv', currency: 'SEK', flag: '🇸🇪', region: 'EU', continent: 'Europe' },
  { code: 'GB', name: 'United Kingdom', nativeName: 'United Kingdom', languages: ['en'], primaryLanguage: 'en', currency: 'GBP', flag: '🇬🇧', region: 'EU', continent: 'Europe' },
  
  // Non-EU Europe
  { code: 'AL', name: 'Albania', nativeName: 'Shqipëria', languages: ['sq', 'en'], primaryLanguage: 'sq', currency: 'ALL', flag: '🇦🇱', region: 'EU', continent: 'Europe' },
  { code: 'BY', name: 'Belarus', nativeName: 'Беларусь', languages: ['be', 'ru', 'en'], primaryLanguage: 'be', currency: 'BYN', flag: '🇧🇾', region: 'EU', continent: 'Europe' },
  { code: 'BA', name: 'Bosnia and Herzegovina', nativeName: 'Bosna i Hercegovina', languages: ['bs', 'hr', 'sr', 'en'], primaryLanguage: 'bs', currency: 'BAM', flag: '🇧🇦', region: 'EU', continent: 'Europe' },
  { code: 'IS', name: 'Iceland', nativeName: 'Ísland', languages: ['is', 'en'], primaryLanguage: 'is', currency: 'ISK', flag: '🇮🇸', region: 'EU', continent: 'Europe' },
  { code: 'MK', name: 'North Macedonia', nativeName: 'Северна Македонија', languages: ['mk', 'sq', 'en'], primaryLanguage: 'mk', currency: 'MKD', flag: '🇲🇰', region: 'EU', continent: 'Europe' },
  { code: 'MD', name: 'Moldova', nativeName: 'Moldova', languages: ['ro', 'ru', 'en'], primaryLanguage: 'ro', currency: 'MDL', flag: '🇲🇩', region: 'EU', continent: 'Europe' },
  { code: 'ME', name: 'Montenegro', nativeName: 'Crna Gora', languages: ['sr', 'en'], primaryLanguage: 'sr', currency: 'EUR', flag: '🇲🇪', region: 'EU', continent: 'Europe' },
  { code: 'NO', name: 'Norway', nativeName: 'Norge', languages: ['no', 'nb', 'nn', 'en'], primaryLanguage: 'no', currency: 'NOK', flag: '🇳🇴', region: 'EU', continent: 'Europe' },
  { code: 'RS', name: 'Serbia', nativeName: 'Србија', languages: ['sr', 'en'], primaryLanguage: 'sr', currency: 'RSD', flag: '🇷🇸', region: 'EU', continent: 'Europe' },
  { code: 'CH', name: 'Switzerland', nativeName: 'Schweiz', languages: ['de', 'fr', 'it', 'rm', 'en'], primaryLanguage: 'de', currency: 'CHF', flag: '🇨🇭', region: 'EU', continent: 'Europe' },
  { code: 'TR', name: 'Turkey', nativeName: 'Türkiye', languages: ['tr', 'en'], primaryLanguage: 'tr', currency: 'TRY', flag: '🇹🇷', region: 'EU', continent: 'Europe' },
  { code: 'UA', name: 'Ukraine', nativeName: 'Україна', languages: ['uk', 'ru', 'en'], primaryLanguage: 'uk', currency: 'UAH', flag: '🇺🇦', region: 'EU', continent: 'Europe' },

  // North America
  { code: 'US', name: 'United States', nativeName: 'United States', languages: ['en', 'es'], primaryLanguage: 'en', currency: 'USD', flag: '🇺🇸', region: 'NA', continent: 'North America' },
  { code: 'CA', name: 'Canada', nativeName: 'Canada', languages: ['en', 'fr'], primaryLanguage: 'en', currency: 'CAD', flag: '🇨🇦', region: 'NA', continent: 'North America' },
  { code: 'MX', name: 'Mexico', nativeName: 'México', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'MXN', flag: '🇲🇽', region: 'NA', continent: 'North America' },
  
  // Central America & Caribbean
  { code: 'BZ', name: 'Belize', nativeName: 'Belize', languages: ['en', 'es'], primaryLanguage: 'en', currency: 'BZD', flag: '🇧🇿', region: 'NA', continent: 'Central America' },
  { code: 'CR', name: 'Costa Rica', nativeName: 'Costa Rica', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'CRC', flag: '🇨🇷', region: 'NA', continent: 'Central America' },
  { code: 'SV', name: 'El Salvador', nativeName: 'El Salvador', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'USD', flag: '🇸🇻', region: 'NA', continent: 'Central America' },
  { code: 'GT', name: 'Guatemala', nativeName: 'Guatemala', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'GTQ', flag: '🇬🇹', region: 'NA', continent: 'Central America' },
  { code: 'HN', name: 'Honduras', nativeName: 'Honduras', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'HNL', flag: '🇭🇳', region: 'NA', continent: 'Central America' },
  { code: 'NI', name: 'Nicaragua', nativeName: 'Nicaragua', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'NIO', flag: '🇳🇮', region: 'NA', continent: 'Central America' },
  { code: 'PA', name: 'Panama', nativeName: 'Panamá', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'PAB', flag: '🇵🇦', region: 'NA', continent: 'Central America' },
  { code: 'CU', name: 'Cuba', nativeName: 'Cuba', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'CUP', flag: '🇨🇺', region: 'NA', continent: 'Caribbean' },
  { code: 'DO', name: 'Dominican Republic', nativeName: 'República Dominicana', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'DOP', flag: '🇩🇴', region: 'NA', continent: 'Caribbean' },
  { code: 'HT', name: 'Haiti', nativeName: 'Haïti', languages: ['fr', 'ht', 'en'], primaryLanguage: 'fr', currency: 'HTG', flag: '🇭🇹', region: 'NA', continent: 'Caribbean' },
  { code: 'JM', name: 'Jamaica', nativeName: 'Jamaica', languages: ['en'], primaryLanguage: 'en', currency: 'JMD', flag: '🇯🇲', region: 'NA', continent: 'Caribbean' },
  { code: 'PR', name: 'Puerto Rico', nativeName: 'Puerto Rico', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'USD', flag: '🇵🇷', region: 'NA', continent: 'Caribbean' },
  { code: 'TT', name: 'Trinidad and Tobago', nativeName: 'Trinidad and Tobago', languages: ['en'], primaryLanguage: 'en', currency: 'TTD', flag: '🇹🇹', region: 'NA', continent: 'Caribbean' },

  // South America
  { code: 'AR', name: 'Argentina', nativeName: 'Argentina', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'ARS', flag: '🇦🇷', region: 'SA', continent: 'South America' },
  { code: 'BO', name: 'Bolivia', nativeName: 'Bolivia', languages: ['es', 'qu', 'ay', 'en'], primaryLanguage: 'es', currency: 'BOB', flag: '🇧🇴', region: 'SA', continent: 'South America' },
  { code: 'BR', name: 'Brazil', nativeName: 'Brasil', languages: ['pt', 'en'], primaryLanguage: 'pt', currency: 'BRL', flag: '🇧🇷', region: 'SA', continent: 'South America' },
  { code: 'CL', name: 'Chile', nativeName: 'Chile', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'CLP', flag: '🇨🇱', region: 'SA', continent: 'South America' },
  { code: 'CO', name: 'Colombia', nativeName: 'Colombia', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'COP', flag: '🇨🇴', region: 'SA', continent: 'South America' },
  { code: 'EC', name: 'Ecuador', nativeName: 'Ecuador', languages: ['es', 'qu', 'en'], primaryLanguage: 'es', currency: 'USD', flag: '🇪🇨', region: 'SA', continent: 'South America' },
  { code: 'GY', name: 'Guyana', nativeName: 'Guyana', languages: ['en'], primaryLanguage: 'en', currency: 'GYD', flag: '🇬🇾', region: 'SA', continent: 'South America' },
  { code: 'PY', name: 'Paraguay', nativeName: 'Paraguay', languages: ['es', 'gn', 'en'], primaryLanguage: 'es', currency: 'PYG', flag: '🇵🇾', region: 'SA', continent: 'South America' },
  { code: 'PE', name: 'Peru', nativeName: 'Perú', languages: ['es', 'qu', 'ay', 'en'], primaryLanguage: 'es', currency: 'PEN', flag: '🇵🇪', region: 'SA', continent: 'South America' },
  { code: 'SR', name: 'Suriname', nativeName: 'Suriname', languages: ['nl', 'en'], primaryLanguage: 'nl', currency: 'SRD', flag: '🇸🇷', region: 'SA', continent: 'South America' },
  { code: 'UY', name: 'Uruguay', nativeName: 'Uruguay', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'UYU', flag: '🇺🇾', region: 'SA', continent: 'South America' },
  { code: 'VE', name: 'Venezuela', nativeName: 'Venezuela', languages: ['es', 'en'], primaryLanguage: 'es', currency: 'VES', flag: '🇻🇪', region: 'SA', continent: 'South America' },

  // Asia
  { code: 'AF', name: 'Afghanistan', nativeName: 'افغانستان', languages: ['fa', 'ps', 'en'], primaryLanguage: 'fa', currency: 'AFN', flag: '🇦🇫', region: 'ASIA', continent: 'Asia' },
  { code: 'BD', name: 'Bangladesh', nativeName: 'বাংলাদেশ', languages: ['bn', 'en'], primaryLanguage: 'bn', currency: 'BDT', flag: '🇧🇩', region: 'ASIA', continent: 'Asia' },
  { code: 'BT', name: 'Bhutan', nativeName: 'འབྲུག', languages: ['dz', 'ne', 'en'], primaryLanguage: 'dz', currency: 'BTN', flag: '🇧🇹', region: 'ASIA', continent: 'Asia' },
  { code: 'BN', name: 'Brunei', nativeName: 'Brunei', languages: ['ms', 'en'], primaryLanguage: 'ms', currency: 'BND', flag: '🇧🇳', region: 'ASIA', continent: 'Asia' },
  { code: 'KH', name: 'Cambodia', nativeName: 'កម្ពុជា', languages: ['km', 'en'], primaryLanguage: 'km', currency: 'KHR', flag: '🇰🇭', region: 'ASIA', continent: 'Asia' },
  { code: 'CN', name: 'China', nativeName: '中国', languages: ['zh', 'en'], primaryLanguage: 'zh', currency: 'CNY', flag: '🇨🇳', region: 'ASIA', continent: 'Asia' },
  { code: 'HK', name: 'Hong Kong', nativeName: '香港', languages: ['zh', 'en'], primaryLanguage: 'zh', currency: 'HKD', flag: '🇭🇰', region: 'ASIA', continent: 'Asia' },
  { code: 'IN', name: 'India', nativeName: 'भारत', languages: ['hi', 'en', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'ml', 'or', 'pa'], primaryLanguage: 'hi', currency: 'INR', flag: '🇮🇳', region: 'ASIA', continent: 'Asia' },
  { code: 'ID', name: 'Indonesia', nativeName: 'Indonesia', languages: ['id', 'en'], primaryLanguage: 'id', currency: 'IDR', flag: '🇮🇩', region: 'ASIA', continent: 'Asia' },
  { code: 'JP', name: 'Japan', nativeName: '日本', languages: ['ja', 'en'], primaryLanguage: 'ja', currency: 'JPY', flag: '🇯🇵', region: 'ASIA', continent: 'Asia' },
  { code: 'KZ', name: 'Kazakhstan', nativeName: 'Қазақстан', languages: ['kk', 'ru', 'en'], primaryLanguage: 'kk', currency: 'KZT', flag: '🇰🇿', region: 'ASIA', continent: 'Asia' },
  { code: 'KG', name: 'Kyrgyzstan', nativeName: 'Кыргызстан', languages: ['ky', 'ru', 'en'], primaryLanguage: 'ky', currency: 'KGS', flag: '🇰🇬', region: 'ASIA', continent: 'Asia' },
  { code: 'LA', name: 'Laos', nativeName: 'ລາວ', languages: ['lo', 'en'], primaryLanguage: 'lo', currency: 'LAK', flag: '🇱🇦', region: 'ASIA', continent: 'Asia' },
  { code: 'MY', name: 'Malaysia', nativeName: 'Malaysia', languages: ['ms', 'en', 'zh', 'ta'], primaryLanguage: 'ms', currency: 'MYR', flag: '🇲🇾', region: 'ASIA', continent: 'Asia' },
  { code: 'MV', name: 'Maldives', nativeName: 'ދިވެހިރާއްޖެ', languages: ['dv', 'en'], primaryLanguage: 'dv', currency: 'MVR', flag: '🇲🇻', region: 'ASIA', continent: 'Asia' },
  { code: 'MN', name: 'Mongolia', nativeName: 'Монгол', languages: ['mn', 'en'], primaryLanguage: 'mn', currency: 'MNT', flag: '🇲🇳', region: 'ASIA', continent: 'Asia' },
  { code: 'MM', name: 'Myanmar', nativeName: 'မြန်မာ', languages: ['my', 'en'], primaryLanguage: 'my', currency: 'MMK', flag: '🇲🇲', region: 'ASIA', continent: 'Asia' },
  { code: 'NP', name: 'Nepal', nativeName: 'नेपाल', languages: ['ne', 'en'], primaryLanguage: 'ne', currency: 'NPR', flag: '🇳🇵', region: 'ASIA', continent: 'Asia' },
  { code: 'KP', name: 'North Korea', nativeName: '조선', languages: ['ko', 'en'], primaryLanguage: 'ko', currency: 'KPW', flag: '🇰🇵', region: 'ASIA', continent: 'Asia' },
  { code: 'PK', name: 'Pakistan', nativeName: 'پاکستان', languages: ['ur', 'en', 'pa', 'sd'], primaryLanguage: 'ur', currency: 'PKR', flag: '🇵🇰', region: 'ASIA', continent: 'Asia' },
  { code: 'PH', name: 'Philippines', nativeName: 'Pilipinas', languages: ['tl', 'en', 'es'], primaryLanguage: 'tl', currency: 'PHP', flag: '🇵🇭', region: 'ASIA', continent: 'Asia' },
  { code: 'SG', name: 'Singapore', nativeName: 'Singapore', languages: ['en', 'zh', 'ms', 'ta'], primaryLanguage: 'en', currency: 'SGD', flag: '🇸🇬', region: 'ASIA', continent: 'Asia' },
  { code: 'KR', name: 'South Korea', nativeName: '대한민국', languages: ['ko', 'en'], primaryLanguage: 'ko', currency: 'KRW', flag: '🇰🇷', region: 'ASIA', continent: 'Asia' },
  { code: 'LK', name: 'Sri Lanka', nativeName: 'ශ්‍රී ලංකාව', languages: ['si', 'ta', 'en'], primaryLanguage: 'si', currency: 'LKR', flag: '🇱🇰', region: 'ASIA', continent: 'Asia' },
  { code: 'TW', name: 'Taiwan', nativeName: '台灣', languages: ['zh', 'en'], primaryLanguage: 'zh', currency: 'TWD', flag: '🇹🇼', region: 'ASIA', continent: 'Asia' },
  { code: 'TJ', name: 'Tajikistan', nativeName: 'Тоҷикистон', languages: ['tg', 'ru', 'en'], primaryLanguage: 'tg', currency: 'TJS', flag: '🇹🇯', region: 'ASIA', continent: 'Asia' },
  { code: 'TH', name: 'Thailand', nativeName: 'ไทย', languages: ['th', 'en'], primaryLanguage: 'th', currency: 'THB', flag: '🇹🇭', region: 'ASIA', continent: 'Asia' },
  { code: 'TL', name: 'Timor-Leste', nativeName: 'Timor-Leste', languages: ['pt', 'tet', 'en'], primaryLanguage: 'pt', currency: 'USD', flag: '🇹🇱', region: 'ASIA', continent: 'Asia' },
  { code: 'TM', name: 'Turkmenistan', nativeName: 'Türkmenistan', languages: ['tk', 'ru', 'en'], primaryLanguage: 'tk', currency: 'TMT', flag: '🇹🇲', region: 'ASIA', continent: 'Asia' },
  { code: 'UZ', name: 'Uzbekistan', nativeName: 'Oʻzbekiston', languages: ['uz', 'ru', 'en'], primaryLanguage: 'uz', currency: 'UZS', flag: '🇺🇿', region: 'ASIA', continent: 'Asia' },
  { code: 'VN', name: 'Vietnam', nativeName: 'Việt Nam', languages: ['vi', 'en'], primaryLanguage: 'vi', currency: 'VND', flag: '🇻🇳', region: 'ASIA', continent: 'Asia' },

  // Middle East
  { code: 'BH', name: 'Bahrain', nativeName: 'البحرين', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'BHD', flag: '🇧🇭', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'IQ', name: 'Iraq', nativeName: 'العراق', languages: ['ar', 'ku', 'en'], primaryLanguage: 'ar', currency: 'IQD', flag: '🇮🇶', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'IL', name: 'Israel', nativeName: 'ישראל', languages: ['he', 'ar', 'en'], primaryLanguage: 'he', currency: 'ILS', flag: '🇮🇱', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'JO', name: 'Jordan', nativeName: 'الأردن', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'JOD', flag: '🇯🇴', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'KW', name: 'Kuwait', nativeName: 'الكويت', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'KWD', flag: '🇰🇼', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'LB', name: 'Lebanon', nativeName: 'لبنان', languages: ['ar', 'fr', 'en'], primaryLanguage: 'ar', currency: 'LBP', flag: '🇱🇧', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'OM', name: 'Oman', nativeName: 'عمان', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'OMR', flag: '🇴🇲', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'PS', name: 'Palestine', nativeName: 'فلسطين', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'ILS', flag: '🇵🇸', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'QA', name: 'Qatar', nativeName: 'قطر', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'QAR', flag: '🇶🇦', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'SA', name: 'Saudi Arabia', nativeName: 'السعودية', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'SAR', flag: '🇸🇦', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'SY', name: 'Syria', nativeName: 'سوريا', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'SYP', flag: '🇸🇾', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'AE', name: 'United Arab Emirates', nativeName: 'الإمارات', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'AED', flag: '🇦🇪', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'YE', name: 'Yemen', nativeName: 'اليمن', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'YER', flag: '🇾🇪', region: 'MIDDLE_EAST', continent: 'Asia' },
  { code: 'IR', name: 'Iran', nativeName: 'ایران', languages: ['fa', 'en'], primaryLanguage: 'fa', currency: 'IRR', flag: '🇮🇷', region: 'MIDDLE_EAST', continent: 'Asia' },

  // Africa
  { code: 'DZ', name: 'Algeria', nativeName: 'الجزائر', languages: ['ar', 'fr', 'en'], primaryLanguage: 'ar', currency: 'DZD', flag: '🇩🇿', region: 'AFRICA', continent: 'Africa' },
  { code: 'AO', name: 'Angola', nativeName: 'Angola', languages: ['pt', 'en'], primaryLanguage: 'pt', currency: 'AOA', flag: '🇦🇴', region: 'AFRICA', continent: 'Africa' },
  { code: 'BJ', name: 'Benin', nativeName: 'Bénin', languages: ['fr', 'en'], primaryLanguage: 'fr', currency: 'XOF', flag: '🇧🇯', region: 'AFRICA', continent: 'Africa' },
  { code: 'BW', name: 'Botswana', nativeName: 'Botswana', languages: ['en', 'tn'], primaryLanguage: 'en', currency: 'BWP', flag: '🇧🇼', region: 'AFRICA', continent: 'Africa' },
  { code: 'BF', name: 'Burkina Faso', nativeName: 'Burkina Faso', languages: ['fr', 'en'], primaryLanguage: 'fr', currency: 'XOF', flag: '🇧🇫', region: 'AFRICA', continent: 'Africa' },
  { code: 'BI', name: 'Burundi', nativeName: 'Burundi', languages: ['rn', 'fr', 'en'], primaryLanguage: 'rn', currency: 'BIF', flag: '🇧🇮', region: 'AFRICA', continent: 'Africa' },
  { code: 'CM', name: 'Cameroon', nativeName: 'Cameroun', languages: ['fr', 'en'], primaryLanguage: 'fr', currency: 'XAF', flag: '🇨🇲', region: 'AFRICA', continent: 'Africa' },
  { code: 'CV', name: 'Cape Verde', nativeName: 'Cabo Verde', languages: ['pt', 'en'], primaryLanguage: 'pt', currency: 'CVE', flag: '🇨🇻', region: 'AFRICA', continent: 'Africa' },
  { code: 'CF', name: 'Central African Republic', nativeName: 'République centrafricaine', languages: ['fr', 'sg', 'en'], primaryLanguage: 'fr', currency: 'XAF', flag: '🇨🇫', region: 'AFRICA', continent: 'Africa' },
  { code: 'TD', name: 'Chad', nativeName: 'Tchad', languages: ['fr', 'ar', 'en'], primaryLanguage: 'fr', currency: 'XAF', flag: '🇹🇩', region: 'AFRICA', continent: 'Africa' },
  { code: 'KM', name: 'Comoros', nativeName: 'Comores', languages: ['ar', 'fr', 'en'], primaryLanguage: 'ar', currency: 'KMF', flag: '🇰🇲', region: 'AFRICA', continent: 'Africa' },
  { code: 'CG', name: 'Congo', nativeName: 'Congo', languages: ['fr', 'ln', 'en'], primaryLanguage: 'fr', currency: 'XAF', flag: '🇨🇬', region: 'AFRICA', continent: 'Africa' },
  { code: 'CD', name: 'Democratic Republic of the Congo', nativeName: 'République démocratique du Congo', languages: ['fr', 'ln', 'sw', 'en'], primaryLanguage: 'fr', currency: 'CDF', flag: '🇨🇩', region: 'AFRICA', continent: 'Africa' },
  { code: 'DJ', name: 'Djibouti', nativeName: 'Djibouti', languages: ['fr', 'ar', 'en'], primaryLanguage: 'fr', currency: 'DJF', flag: '🇩🇯', region: 'AFRICA', continent: 'Africa' },
  { code: 'EG', name: 'Egypt', nativeName: 'مصر', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'EGP', flag: '🇪🇬', region: 'AFRICA', continent: 'Africa' },
  { code: 'GQ', name: 'Equatorial Guinea', nativeName: 'Guinea Ecuatorial', languages: ['es', 'fr', 'pt', 'en'], primaryLanguage: 'es', currency: 'XAF', flag: '🇬🇶', region: 'AFRICA', continent: 'Africa' },
  { code: 'ER', name: 'Eritrea', nativeName: 'ኤርትራ', languages: ['ti', 'ar', 'en'], primaryLanguage: 'ti', currency: 'ERN', flag: '🇪🇷', region: 'AFRICA', continent: 'Africa' },
  { code: 'ET', name: 'Ethiopia', nativeName: 'ኢትዮጵያ', languages: ['am', 'om', 'ti', 'en'], primaryLanguage: 'am', currency: 'ETB', flag: '🇪🇹', region: 'AFRICA', continent: 'Africa' },
  { code: 'GA', name: 'Gabon', nativeName: 'Gabon', languages: ['fr', 'en'], primaryLanguage: 'fr', currency: 'XAF', flag: '🇬🇦', region: 'AFRICA', continent: 'Africa' },
  { code: 'GM', name: 'Gambia', nativeName: 'Gambia', languages: ['en'], primaryLanguage: 'en', currency: 'GMD', flag: '🇬🇲', region: 'AFRICA', continent: 'Africa' },
  { code: 'GH', name: 'Ghana', nativeName: 'Ghana', languages: ['en', 'ak', 'ee'], primaryLanguage: 'en', currency: 'GHS', flag: '🇬🇭', region: 'AFRICA', continent: 'Africa' },
  { code: 'GN', name: 'Guinea', nativeName: 'Guinée', languages: ['fr', 'en'], primaryLanguage: 'fr', currency: 'GNF', flag: '🇬🇳', region: 'AFRICA', continent: 'Africa' },
  { code: 'GW', name: 'Guinea-Bissau', nativeName: 'Guiné-Bissau', languages: ['pt', 'en'], primaryLanguage: 'pt', currency: 'XOF', flag: '🇬🇼', region: 'AFRICA', continent: 'Africa' },
  { code: 'CI', name: 'Ivory Coast', nativeName: 'Côte d\'Ivoire', languages: ['fr', 'en'], primaryLanguage: 'fr', currency: 'XOF', flag: '🇨🇮', region: 'AFRICA', continent: 'Africa' },
  { code: 'KE', name: 'Kenya', nativeName: 'Kenya', languages: ['sw', 'en'], primaryLanguage: 'sw', currency: 'KES', flag: '🇰🇪', region: 'AFRICA', continent: 'Africa' },
  { code: 'LS', name: 'Lesotho', nativeName: 'Lesotho', languages: ['st', 'en'], primaryLanguage: 'st', currency: 'LSL', flag: '🇱🇸', region: 'AFRICA', continent: 'Africa' },
  { code: 'LR', name: 'Liberia', nativeName: 'Liberia', languages: ['en'], primaryLanguage: 'en', currency: 'LRD', flag: '🇱🇷', region: 'AFRICA', continent: 'Africa' },
  { code: 'LY', name: 'Libya', nativeName: 'ليبيا', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'LYD', flag: '🇱🇾', region: 'AFRICA', continent: 'Africa' },
  { code: 'MG', name: 'Madagascar', nativeName: 'Madagasikara', languages: ['mg', 'fr', 'en'], primaryLanguage: 'mg', currency: 'MGA', flag: '🇲🇬', region: 'AFRICA', continent: 'Africa' },
  { code: 'MW', name: 'Malawi', nativeName: 'Malawi', languages: ['en', 'ny'], primaryLanguage: 'en', currency: 'MWK', flag: '🇲🇼', region: 'AFRICA', continent: 'Africa' },
  { code: 'ML', name: 'Mali', nativeName: 'Mali', languages: ['fr', 'bm', 'en'], primaryLanguage: 'fr', currency: 'XOF', flag: '🇲🇱', region: 'AFRICA', continent: 'Africa' },
  { code: 'MR', name: 'Mauritania', nativeName: 'موريتانيا', languages: ['ar', 'fr', 'en'], primaryLanguage: 'ar', currency: 'MRU', flag: '🇲🇷', region: 'AFRICA', continent: 'Africa' },
  { code: 'MU', name: 'Mauritius', nativeName: 'Maurice', languages: ['en', 'fr'], primaryLanguage: 'en', currency: 'MUR', flag: '🇲🇺', region: 'AFRICA', continent: 'Africa' },
  { code: 'MA', name: 'Morocco', nativeName: 'المغرب', languages: ['ar', 'fr', 'en'], primaryLanguage: 'ar', currency: 'MAD', flag: '🇲🇦', region: 'AFRICA', continent: 'Africa' },
  { code: 'MZ', name: 'Mozambique', nativeName: 'Moçambique', languages: ['pt', 'en'], primaryLanguage: 'pt', currency: 'MZN', flag: '🇲🇿', region: 'AFRICA', continent: 'Africa' },
  { code: 'NA', name: 'Namibia', nativeName: 'Namibia', languages: ['en', 'af'], primaryLanguage: 'en', currency: 'NAD', flag: '🇳🇦', region: 'AFRICA', continent: 'Africa' },
  { code: 'NE', name: 'Niger', nativeName: 'Niger', languages: ['fr', 'ha', 'en'], primaryLanguage: 'fr', currency: 'XOF', flag: '🇳🇪', region: 'AFRICA', continent: 'Africa' },
  { code: 'NG', name: 'Nigeria', nativeName: 'Nigeria', languages: ['en', 'ha', 'yo', 'ig'], primaryLanguage: 'en', currency: 'NGN', flag: '🇳🇬', region: 'AFRICA', continent: 'Africa' },
  { code: 'RW', name: 'Rwanda', nativeName: 'Rwanda', languages: ['rw', 'fr', 'en'], primaryLanguage: 'rw', currency: 'RWF', flag: '🇷🇼', region: 'AFRICA', continent: 'Africa' },
  { code: 'ST', name: 'Sao Tome and Principe', nativeName: 'São Tomé e Príncipe', languages: ['pt', 'en'], primaryLanguage: 'pt', currency: 'STN', flag: '🇸🇹', region: 'AFRICA', continent: 'Africa' },
  { code: 'SN', name: 'Senegal', nativeName: 'Sénégal', languages: ['fr', 'wo', 'en'], primaryLanguage: 'fr', currency: 'XOF', flag: '🇸🇳', region: 'AFRICA', continent: 'Africa' },
  { code: 'SC', name: 'Seychelles', nativeName: 'Seychelles', languages: ['en', 'fr'], primaryLanguage: 'en', currency: 'SCR', flag: '🇸🇨', region: 'AFRICA', continent: 'Africa' },
  { code: 'SL', name: 'Sierra Leone', nativeName: 'Sierra Leone', languages: ['en'], primaryLanguage: 'en', currency: 'SLL', flag: '🇸🇱', region: 'AFRICA', continent: 'Africa' },
  { code: 'SO', name: 'Somalia', nativeName: 'Soomaaliya', languages: ['so', 'ar', 'en'], primaryLanguage: 'so', currency: 'SOS', flag: '🇸🇴', region: 'AFRICA', continent: 'Africa' },
  { code: 'ZA', name: 'South Africa', nativeName: 'South Africa', languages: ['en', 'af', 'zu', 'xh', 'st', 'tn'], primaryLanguage: 'en', currency: 'ZAR', flag: '🇿🇦', region: 'AFRICA', continent: 'Africa' },
  { code: 'SS', name: 'South Sudan', nativeName: 'South Sudan', languages: ['en', 'ar'], primaryLanguage: 'en', currency: 'SSP', flag: '🇸🇸', region: 'AFRICA', continent: 'Africa' },
  { code: 'SD', name: 'Sudan', nativeName: 'السودان', languages: ['ar', 'en'], primaryLanguage: 'ar', currency: 'SDG', flag: '🇸🇩', region: 'AFRICA', continent: 'Africa' },
  { code: 'SZ', name: 'Eswatini', nativeName: 'eSwatini', languages: ['en', 'ss'], primaryLanguage: 'en', currency: 'SZL', flag: '🇸🇿', region: 'AFRICA', continent: 'Africa' },
  { code: 'TZ', name: 'Tanzania', nativeName: 'Tanzania', languages: ['sw', 'en'], primaryLanguage: 'sw', currency: 'TZS', flag: '🇹🇿', region: 'AFRICA', continent: 'Africa' },
  { code: 'TG', name: 'Togo', nativeName: 'Togo', languages: ['fr', 'en'], primaryLanguage: 'fr', currency: 'XOF', flag: '🇹🇬', region: 'AFRICA', continent: 'Africa' },
  { code: 'TN', name: 'Tunisia', nativeName: 'تونس', languages: ['ar', 'fr', 'en'], primaryLanguage: 'ar', currency: 'TND', flag: '🇹🇳', region: 'AFRICA', continent: 'Africa' },
  { code: 'UG', name: 'Uganda', nativeName: 'Uganda', languages: ['en', 'sw'], primaryLanguage: 'en', currency: 'UGX', flag: '🇺🇬', region: 'AFRICA', continent: 'Africa' },
  { code: 'ZM', name: 'Zambia', nativeName: 'Zambia', languages: ['en'], primaryLanguage: 'en', currency: 'ZMW', flag: '🇿🇲', region: 'AFRICA', continent: 'Africa' },
  { code: 'ZW', name: 'Zimbabwe', nativeName: 'Zimbabwe', languages: ['en', 'sn', 'nd'], primaryLanguage: 'en', currency: 'ZWL', flag: '🇿🇼', region: 'AFRICA', continent: 'Africa' },

  // Oceania
  { code: 'AU', name: 'Australia', nativeName: 'Australia', languages: ['en'], primaryLanguage: 'en', currency: 'AUD', flag: '🇦🇺', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'FJ', name: 'Fiji', nativeName: 'Fiji', languages: ['en', 'fj', 'hi'], primaryLanguage: 'en', currency: 'FJD', flag: '🇫🇯', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'KI', name: 'Kiribati', nativeName: 'Kiribati', languages: ['en', 'gil'], primaryLanguage: 'en', currency: 'AUD', flag: '🇰🇮', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'MH', name: 'Marshall Islands', nativeName: 'Marshall Islands', languages: ['en', 'mh'], primaryLanguage: 'en', currency: 'USD', flag: '🇲🇭', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'FM', name: 'Micronesia', nativeName: 'Micronesia', languages: ['en'], primaryLanguage: 'en', currency: 'USD', flag: '🇫🇲', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'NR', name: 'Nauru', nativeName: 'Nauru', languages: ['en', 'na'], primaryLanguage: 'en', currency: 'AUD', flag: '🇳🇷', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', nativeName: 'New Zealand', languages: ['en', 'mi'], primaryLanguage: 'en', currency: 'NZD', flag: '🇳🇿', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'PW', name: 'Palau', nativeName: 'Palau', languages: ['en', 'pau'], primaryLanguage: 'en', currency: 'USD', flag: '🇵🇼', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'PG', name: 'Papua New Guinea', nativeName: 'Papua New Guinea', languages: ['en', 'ho', 'tpi'], primaryLanguage: 'en', currency: 'PGK', flag: '🇵🇬', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'WS', name: 'Samoa', nativeName: 'Samoa', languages: ['sm', 'en'], primaryLanguage: 'sm', currency: 'WST', flag: '🇼🇸', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'SB', name: 'Solomon Islands', nativeName: 'Solomon Islands', languages: ['en'], primaryLanguage: 'en', currency: 'SBD', flag: '🇸🇧', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'TO', name: 'Tonga', nativeName: 'Tonga', languages: ['to', 'en'], primaryLanguage: 'to', currency: 'TOP', flag: '🇹🇴', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'TV', name: 'Tuvalu', nativeName: 'Tuvalu', languages: ['en', 'tvl'], primaryLanguage: 'en', currency: 'AUD', flag: '🇹🇻', region: 'OCEANIA', continent: 'Oceania' },
  { code: 'VU', name: 'Vanuatu', nativeName: 'Vanuatu', languages: ['bi', 'en', 'fr'], primaryLanguage: 'bi', currency: 'VUV', flag: '🇻🇺', region: 'OCEANIA', continent: 'Oceania' },
];

// Helper functions
export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(c => c.code === code);
};

export const getCountriesByRegion = (region: Country['region']): Country[] => {
  return countries.filter(c => c.region === region);
};

export const getCountriesByLanguage = (languageCode: string): Country[] => {
  return countries.filter(c => c.languages.includes(languageCode));
};

export const searchCountries = (query: string): Country[] => {
  const lowerQuery = query.toLowerCase();
  return countries.filter(
    c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.nativeName.toLowerCase().includes(lowerQuery) ||
      c.code.toLowerCase().includes(lowerQuery)
  );
};

export const getAllLanguages = (): string[] => {
  const languages = new Set<string>();
  countries.forEach(c => c.languages.forEach(l => languages.add(l)));
  return Array.from(languages).sort();
};

export const regions = [
  { code: 'EU', name: 'Europe', icon: '🇪🇺' },
  { code: 'NA', name: 'North America', icon: '🌎' },
  { code: 'SA', name: 'South America', icon: '🌎' },
  { code: 'ASIA', name: 'Asia', icon: '🌏' },
  { code: 'AFRICA', name: 'Africa', icon: '🌍' },
  { code: 'OCEANIA', name: 'Oceania', icon: '🌏' },
  { code: 'MIDDLE_EAST', name: 'Middle East', icon: '🕌' },
] as const;
