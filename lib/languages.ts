// Comprehensive language configuration
// Based on Steam's supported languages and major world languages

export interface Language {
  code: string; // ISO 639-1 or ISO 639-2 code
  name: string; // English name
  nativeName: string; // Native name
  flag: string; // Representative flag (usually most populous country)
  rtl: boolean; // Right-to-left script
  culturalTheme: CulturalTheme;
}

export interface CulturalTheme {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  pattern: string;
  description: string;
}

export const languages: Language[] = [
  // European Languages
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    rtl: false,
    culturalTheme: {
      primary: '#FBBF24',
      secondary: '#FF6B6B',
      accent: '#3B82F6',
      gradient: 'from-yellow-400 via-orange-300 to-red-400',
      pattern: 'geometric',
      description: 'Warm and professional with geometric patterns'
    }
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    culturalTheme: {
      primary: '#C60B1E',
      secondary: '#FFC400',
      accent: '#AA151B',
      gradient: 'from-red-600 via-yellow-400 to-red-600',
      pattern: 'flamenco',
      description: 'Vibrant Spanish colors with flamenco-inspired patterns'
    }
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    culturalTheme: {
      primary: '#002395',
      secondary: '#ED2939',
      accent: '#FFFFFF',
      gradient: 'from-blue-700 via-white to-red-600',
      pattern: 'art-nouveau',
      description: 'Elegant tricolor with Art Nouveau influences'
    }
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    culturalTheme: {
      primary: '#000000',
      secondary: '#DD0000',
      accent: '#FFCE00',
      gradient: 'from-gray-900 via-red-600 to-yellow-400',
      pattern: 'bauhaus',
      description: 'Modern and efficient Bauhaus-inspired design'
    }
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    rtl: false,
    culturalTheme: {
      primary: '#009246',
      secondary: '#CE2B37',
      accent: '#F1F2F1',
      gradient: 'from-green-600 via-white to-red-600',
      pattern: 'renaissance',
      description: 'Classic Italian tricolor with Renaissance elegance'
    }
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    rtl: false,
    culturalTheme: {
      primary: '#006600',
      secondary: '#FF0000',
      accent: '#FFD700',
      gradient: 'from-green-700 via-red-600 to-yellow-500',
      pattern: 'azulejo',
      description: 'Portuguese tile patterns with nautical colors'
    }
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    rtl: false,
    culturalTheme: {
      primary: '#0039A6',
      secondary: '#D52B1E',
      accent: '#FFFFFF',
      gradient: 'from-white via-blue-700 to-red-600',
      pattern: 'russian-folk',
      description: 'Traditional Russian folk patterns with bold colors'
    }
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    rtl: false,
    culturalTheme: {
      primary: '#FFFFFF',
      secondary: '#DC143C',
      accent: '#DC143C',
      gradient: 'from-white via-red-100 to-red-600',
      pattern: 'folk-geometric',
      description: 'Polish folk art with clean geometric forms'
    }
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    rtl: false,
    culturalTheme: {
      primary: '#21468B',
      secondary: '#AE1C28',
      accent: '#FFFFFF',
      gradient: 'from-red-600 via-white to-blue-800',
      pattern: 'delft-blue',
      description: 'Delft blue pottery inspired patterns'
    }
  },
  {
    code: 'cs',
    name: 'Czech',
    nativeName: 'Čeština',
    flag: '🇨🇿',
    rtl: false,
    culturalTheme: {
      primary: '#DC2626',
      secondary: '#1E40AF',
      accent: '#FFFFFF',
      gradient: 'from-red-600 via-blue-600 to-white',
      pattern: 'bohemian',
      description: 'Bohemian crystal patterns with national colors'
    }
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
    rtl: false,
    culturalTheme: {
      primary: '#FFD500',
      secondary: '#0057B7',
      accent: '#FFD500',
      gradient: 'from-blue-600 via-blue-500 to-yellow-400',
      pattern: 'embroidery',
      description: 'Traditional Ukrainian embroidery patterns'
    }
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    rtl: false,
    culturalTheme: {
      primary: '#E30A17',
      secondary: '#FFFFFF',
      accent: '#FDB913',
      gradient: 'from-red-600 via-white to-red-600',
      pattern: 'tulip',
      description: 'Ottoman tulip motifs with crescent accents'
    }
  },
  {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    flag: '🇸🇪',
    rtl: false,
    culturalTheme: {
      primary: '#006AA7',
      secondary: '#FECC00',
      accent: '#006AA7',
      gradient: 'from-blue-600 via-yellow-400 to-blue-600',
      pattern: 'minimalist',
      description: 'Scandinavian minimalism with bright accents'
    }
  },
  {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    flag: '🇳🇴',
    rtl: false,
    culturalTheme: {
      primary: '#BA0C2F',
      secondary: '#00205B',
      accent: '#FFFFFF',
      gradient: 'from-red-700 via-white to-blue-900',
      pattern: 'norse',
      description: 'Viking-inspired patterns with Nordic colors'
    }
  },
  {
    code: 'da',
    name: 'Danish',
    nativeName: 'Dansk',
    flag: '🇩🇰',
    rtl: false,
    culturalTheme: {
      primary: '#C60C30',
      secondary: '#FFFFFF',
      accent: '#C60C30',
      gradient: 'from-red-700 via-white to-red-700',
      pattern: 'hygge',
      description: 'Cozy Danish hygge aesthetic'
    }
  },
  {
    code: 'fi',
    name: 'Finnish',
    nativeName: 'Suomi',
    flag: '🇫🇮',
    rtl: false,
    culturalTheme: {
      primary: '#003580',
      secondary: '#FFFFFF',
      accent: '#003580',
      gradient: 'from-blue-900 via-white to-blue-900',
      pattern: 'marimekko',
      description: 'Bold Marimekko-inspired prints'
    }
  },
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    rtl: false,
    culturalTheme: {
      primary: '#0D5EAF',
      secondary: '#FFFFFF',
      accent: '#0D5EAF',
      gradient: 'from-blue-700 via-white to-blue-700',
      pattern: 'meander',
      description: 'Classical Greek meander patterns'
    }
  },
  {
    code: 'hu',
    name: 'Hungarian',
    nativeName: 'Magyar',
    flag: '🇭🇺',
    rtl: false,
    culturalTheme: {
      primary: '#CD2A3E',
      secondary: '#FFFFFF',
      accent: '#436F4D',
      gradient: 'from-red-600 via-white to-green-700',
      pattern: 'folk-floral',
      description: 'Hungarian folk floral patterns'
    }
  },
  {
    code: 'ro',
    name: 'Romanian',
    nativeName: 'Română',
    flag: '🇷🇴',
    rtl: false,
    culturalTheme: {
      primary: '#002B7F',
      secondary: '#FCD116',
      accent: '#CE1126',
      gradient: 'from-blue-800 via-yellow-400 to-red-600',
      pattern: 'traditional',
      description: 'Traditional Romanian textile patterns'
    }
  },
  {
    code: 'bg',
    name: 'Bulgarian',
    nativeName: 'Български',
    flag: '🇧🇬',
    rtl: false,
    culturalTheme: {
      primary: '#FFFFFF',
      secondary: '#00966E',
      accent: '#D62612',
      gradient: 'from-white via-green-600 to-red-600',
      pattern: 'rose',
      description: 'Rose valley inspired with traditional motifs'
    }
  },

  // Asian Languages
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false,
    culturalTheme: {
      primary: '#DE2910',
      secondary: '#FFDE00',
      accent: '#DE2910',
      gradient: 'from-red-600 via-yellow-400 to-red-600',
      pattern: 'cloud-dragon',
      description: 'Traditional Chinese cloud and dragon motifs'
    }
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    culturalTheme: {
      primary: '#BC002D',
      secondary: '#FFFFFF',
      accent: '#BC002D',
      gradient: 'from-white via-red-50 to-red-700',
      pattern: 'sakura',
      description: 'Cherry blossom and wave patterns'
    }
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    rtl: false,
    culturalTheme: {
      primary: '#003478',
      secondary: '#CD2E3A',
      accent: '#FFFFFF',
      gradient: 'from-blue-800 via-white to-red-600',
      pattern: 'taegeuk',
      description: 'Taegeuk symbol with traditional Korean colors'
    }
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    rtl: false,
    culturalTheme: {
      primary: '#DA251D',
      secondary: '#FFCD00',
      accent: '#DA251D',
      gradient: 'from-red-600 via-yellow-500 to-red-600',
      pattern: 'lantern',
      description: 'Lantern and lotus flower patterns'
    }
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    rtl: false,
    culturalTheme: {
      primary: '#2D2A4A',
      secondary: '#FFFFFF',
      accent: '#A51931',
      gradient: 'from-red-700 via-white to-blue-900',
      pattern: 'temple',
      description: 'Thai temple and silk patterns'
    }
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    rtl: false,
    culturalTheme: {
      primary: '#FF0000',
      secondary: '#FFFFFF',
      accent: '#FF0000',
      gradient: 'from-red-600 via-white to-red-600',
      pattern: 'batik',
      description: 'Batik patterns with bold colors'
    }
  },
  {
    code: 'ms',
    name: 'Malay',
    nativeName: 'Bahasa Melayu',
    flag: '🇲🇾',
    rtl: false,
    culturalTheme: {
      primary: '#010066',
      secondary: '#CC0001',
      accent: '#FFCC00',
      gradient: 'from-blue-900 via-white to-red-600',
      pattern: 'songket',
      description: 'Traditional songket weaving patterns'
    }
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    rtl: false,
    culturalTheme: {
      primary: '#FF9933',
      secondary: '#FFFFFF',
      accent: '#138808',
      gradient: 'from-orange-500 via-white to-green-700',
      pattern: 'mandala',
      description: 'Intricate mandala and paisley patterns'
    }
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    rtl: false,
    culturalTheme: {
      primary: '#006A4E',
      secondary: '#F42A41',
      accent: '#F42A41',
      gradient: 'from-green-700 via-red-500 to-green-700',
      pattern: 'alpana',
      description: 'Alpana art with vibrant colors'
    }
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇵🇰',
    rtl: true,
    culturalTheme: {
      primary: '#01411C',
      secondary: '#FFFFFF',
      accent: '#01411C',
      gradient: 'from-green-900 via-white to-green-900',
      pattern: 'mughal',
      description: 'Mughal architecture inspired patterns'
    }
  },

  // Middle Eastern & Arabic Languages
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    culturalTheme: {
      primary: '#165B33',
      secondary: '#FFFFFF',
      accent: '#FFD700',
      gradient: 'from-green-800 via-white to-green-800',
      pattern: 'geometric-islamic',
      description: 'Islamic geometric patterns and calligraphy'
    }
  },
  {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    flag: '🇮🇷',
    rtl: true,
    culturalTheme: {
      primary: '#239F40',
      secondary: '#FFFFFF',
      accent: '#DA0000',
      gradient: 'from-green-600 via-white to-red-600',
      pattern: 'persian-carpet',
      description: 'Persian carpet and miniature painting motifs'
    }
  },
  {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    flag: '🇮🇱',
    rtl: true,
    culturalTheme: {
      primary: '#0038B8',
      secondary: '#FFFFFF',
      accent: '#0038B8',
      gradient: 'from-blue-700 via-white to-blue-700',
      pattern: 'star-of-david',
      description: 'Clean and modern with traditional symbols'
    }
  },

  // African Languages
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇰🇪',
    rtl: false,
    culturalTheme: {
      primary: '#006600',
      secondary: '#FFFFFF',
      accent: '#BB0000',
      gradient: 'from-green-700 via-red-600 to-black',
      pattern: 'kente',
      description: 'East African patterns with vibrant colors'
    }
  },
  {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    flag: '🇪🇹',
    rtl: false,
    culturalTheme: {
      primary: '#078930',
      secondary: '#FCDD09',
      accent: '#DA121A',
      gradient: 'from-green-700 via-yellow-400 to-red-600',
      pattern: 'ethiopic',
      description: 'Ethiopian cross and traditional patterns'
    }
  },

  // Additional European Languages
  {
    code: 'sk',
    name: 'Slovak',
    nativeName: 'Slovenčina',
    flag: '🇸🇰',
    rtl: false,
    culturalTheme: {
      primary: '#0B4EA2',
      secondary: '#FFFFFF',
      accent: '#EE1C25',
      gradient: 'from-white via-blue-700 to-red-600',
      pattern: 'folk-embroidery',
      description: 'Traditional Slovak embroidery patterns'
    }
  },
  {
    code: 'sl',
    name: 'Slovenian',
    nativeName: 'Slovenščina',
    flag: '🇸🇮',
    rtl: false,
    culturalTheme: {
      primary: '#005DA4',
      secondary: '#FFFFFF',
      accent: '#FF0000',
      gradient: 'from-white via-blue-600 to-red-600',
      pattern: 'alpine',
      description: 'Alpine-inspired clean design'
    }
  },
  {
    code: 'hr',
    name: 'Croatian',
    nativeName: 'Hrvatski',
    flag: '🇭🇷',
    rtl: false,
    culturalTheme: {
      primary: '#FF0000',
      secondary: '#FFFFFF',
      accent: '#171796',
      gradient: 'from-red-600 via-white to-blue-800',
      pattern: 'checkerboard',
      description: 'Croatian checkerboard with coastal colors'
    }
  },
  {
    code: 'sr',
    name: 'Serbian',
    nativeName: 'Српски',
    flag: '🇷🇸',
    rtl: false,
    culturalTheme: {
      primary: '#C6363C',
      secondary: '#0C4076',
      accent: '#FFFFFF',
      gradient: 'from-red-600 via-blue-800 to-white',
      pattern: 'byzantine',
      description: 'Byzantine and Orthodox Christian motifs'
    }
  },
  {
    code: 'lt',
    name: 'Lithuanian',
    nativeName: 'Lietuvių',
    flag: '🇱🇹',
    rtl: false,
    culturalTheme: {
      primary: '#FDB913',
      secondary: '#006A44',
      accent: '#C1272D',
      gradient: 'from-yellow-500 via-green-700 to-red-600',
      pattern: 'baltic',
      description: 'Baltic amber and nature-inspired patterns'
    }
  },
  {
    code: 'lv',
    name: 'Latvian',
    nativeName: 'Latviešu',
    flag: '🇱🇻',
    rtl: false,
    culturalTheme: {
      primary: '#9E3039',
      secondary: '#FFFFFF',
      accent: '#9E3039',
      gradient: 'from-red-800 via-white to-red-800',
      pattern: 'baltic-folk',
      description: 'Latvian folk art with geometric patterns'
    }
  },
  {
    code: 'et',
    name: 'Estonian',
    nativeName: 'Eesti',
    flag: '🇪🇪',
    rtl: false,
    culturalTheme: {
      primary: '#0072CE',
      secondary: '#000000',
      accent: '#FFFFFF',
      gradient: 'from-blue-600 via-black to-white',
      pattern: 'nordic-digital',
      description: 'Modern Nordic design with digital elements'
    }
  },
];

// Helper functions
export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(l => l.code === code);
};

export const getLanguagesByRTL = (rtl: boolean): Language[] => {
  return languages.filter(l => l.rtl === rtl);
};

export const searchLanguages = (query: string): Language[] => {
  const lowerQuery = query.toLowerCase();
  return languages.filter(
    l =>
      l.name.toLowerCase().includes(lowerQuery) ||
      l.nativeName.toLowerCase().includes(lowerQuery) ||
      l.code.toLowerCase().includes(lowerQuery)
    );
};

export const getSupportedLocales = (): string[] => {
  return languages.map(l => l.code);
};

export const getLanguageLabel = (code: string): string => {
  const lang = getLanguageByCode(code);
  return lang ? `${lang.flag} ${lang.nativeName}` : code;
};
