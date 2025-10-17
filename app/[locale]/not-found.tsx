'use client';

import { motion } from 'framer-motion';
import { Home, Package, Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const culturalThemes = {
  en: {
    primary: '#FBBF24',
    secondary: '#FF6B6B',
    gradient: 'from-yellow-400 via-orange-300 to-red-400',
  },
  cs: {
    primary: '#DC2626',
    secondary: '#1E40AF',
    gradient: 'from-red-600 via-blue-600 to-white',
  },
  uk: {
    primary: '#FFD500',
    secondary: '#0057B7',
    gradient: 'from-blue-600 via-blue-500 to-yellow-400',
  },
  vi: {
    primary: '#DA251D',
    secondary: '#FFCD00',
    gradient: 'from-red-600 via-yellow-500 to-red-600',
  },
  tr: {
    primary: '#E30A17',
    secondary: '#FFFFFF',
    gradient: 'from-red-600 via-white to-red-600',
  },
};

export default function NotFound() {
  const t = useTranslations();
  const locale = useLocale() as keyof typeof culturalThemes;
  const theme = culturalThemes[locale] || culturalThemes.en;

  const messages = {
    en: {
      title: '404 - Page Not Found',
      subtitle: 'Oops! This package seems to have been delivered to the wrong address.',
      description: 'The page you\'re looking for doesn\'t exist or has been moved.',
      home: 'Go Home',
      search: 'Track a Package',
    },
    cs: {
      title: '404 - Stránka Nenalezena',
      subtitle: 'Ups! Tento balíček byl zřejmě doručen na špatnou adresu.',
      description: 'Stránka, kterou hledáte, neexistuje nebo byla přesunuta.',
      home: 'Domů',
      search: 'Sledovat Balíček',
    },
    uk: {
      title: '404 - Сторінку Не Знайдено',
      subtitle: 'Ой! Здається, цю посилку доставили не за тією адресою.',
      description: 'Сторінка, яку ви шукаєте, не існує або була переміщена.',
      home: 'На Головну',
      search: 'Відстежити Посилку',
    },
    vi: {
      title: '404 - Không Tìm Thấy Trang',
      subtitle: 'Rất tiếc! Bưu kiện này có vẻ đã được giao nhầm địa chỉ.',
      description: 'Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.',
      home: 'Về Trang Chủ',
      search: 'Theo Dõi Bưu Kiện',
    },
    tr: {
      title: '404 - Sayfa Bulunamadı',
      subtitle: 'Hata! Bu paket yanlış adrese teslim edilmiş gibi görünüyor.',
      description: 'Aradığınız sayfa mevcut değil veya taşınmış.',
      home: 'Ana Sayfa',
      search: 'Paketi Takip Et',
    },
  };

  const msg = messages[locale] || messages.en;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center px-4`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          {/* Animated 404 Icon */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-8"
            style={{ backgroundColor: `${theme.primary}20` }}
          >
            <Package className="w-16 h-16" style={{ color: theme.primary }} />
          </motion.div>

          {/* 404 Number */}
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-8xl sm:text-9xl font-black mb-6"
            style={{ color: theme.primary }}
          >
            404
          </motion.h1>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {msg.title}
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-gray-700 mb-3">
            {msg.subtitle}
          </p>

          {/* Description */}
          <p className="text-gray-600 mb-10">
            {msg.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-xl transition-all transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <Home className="mr-2 w-5 h-5" />
              {msg.home}
            </Link>

            <Link
              href={`/${locale}/track`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
              style={{ 
                backgroundColor: theme.secondary,
                color: locale === 'tr' || locale === 'uk' ? '#000' : '#fff'
              }}
            >
              <Search className="mr-2 w-5 h-5" />
              {msg.search}
            </Link>
          </div>

          {/* Country Flag */}
          <div className="mt-12 text-6xl">
            {locale === 'en' && '🇬🇧'}
            {locale === 'cs' && '🇨🇿'}
            {locale === 'uk' && '🇺🇦'}
            {locale === 'vi' && '🇻🇳'}
            {locale === 'tr' && '🇹🇷'}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
