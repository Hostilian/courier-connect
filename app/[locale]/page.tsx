'use client';

import LanguageSelector from '@/components/LanguageSelector';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Package, Shield, Star, Truck, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

// Cultural color schemes for each language
const culturalThemes = {
  en: {
    primary: '#FBBF24', // Warm yellow
    secondary: '#FF6B6B', // Coral
    accent: '#3B82F6', // Blue
    gradient: 'from-yellow-400 via-orange-300 to-red-400',
    pattern: 'geometric',
  },
  cs: {
    primary: '#DC2626', // Czech red
    secondary: '#1E40AF', // Czech blue
    accent: '#FFFFFF', // White
    gradient: 'from-red-600 via-blue-600 to-white',
    pattern: 'bohemian',
  },
  uk: {
    primary: '#FFD500', // Ukrainian yellow
    secondary: '#0057B7', // Ukrainian blue
    accent: '#FFD500',
    gradient: 'from-blue-600 via-blue-500 to-yellow-400',
    pattern: 'embroidery',
  },
  vi: {
    primary: '#DA251D', // Vietnamese red
    secondary: '#FFCD00', // Gold/Yellow
    accent: '#DA251D',
    gradient: 'from-red-600 via-yellow-500 to-red-600',
    pattern: 'lantern',
  },
  tr: {
    primary: '#E30A17', // Turkish red
    secondary: '#FFFFFF', // White
    accent: '#FDB913', // Gold
    gradient: 'from-red-600 via-white to-red-600',
    pattern: 'tulip',
  },
};

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale() as keyof typeof culturalThemes;
  const theme = culturalThemes[locale] || culturalThemes.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.primary }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {locale === 'en' && 'Courier Connect'}
                {locale === 'cs' && 'Kurýr Spojení'}
                {locale === 'uk' && "Кур'єр Зв'язок"}
                {locale === 'vi' && 'Kết Nối Shipper'}
                {locale === 'tr' && 'Kurye Bağlantı'}
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href={`/${locale}`}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {t('nav.home')}
              </Link>
              <Link 
                href={`/${locale}/request`}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {t('nav.requestDelivery')}
              </Link>
              <Link 
                href={`/${locale}/track`}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {t('nav.trackDelivery')}
              </Link>
              <Link 
                href={`/${locale}/courier/login`}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {t('nav.forCouriers')}
              </Link>
              <LanguageSelector />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Cultural Design */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} py-20 sm:py-32`}>
        {/* Cultural Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          {theme.pattern === 'geometric' && (
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
            }} />
          )}
          {theme.pattern === 'bohemian' && (
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />
          )}
          {theme.pattern === 'embroidery' && (
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)',
            }} />
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl sm:text-2xl text-white/95 mb-10 max-w-3xl mx-auto drop-shadow">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/request`}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                {t('home.hero.cta')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/courier/register`}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gray-900/30 backdrop-blur-sm border-2 border-white rounded-xl hover:bg-gray-900/40 transition-all transform hover:scale-105 shadow-xl"
              >
                {t('home.hero.ctaSecondary')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Package, value: '5000+', label: t('home.stats.deliveries'), color: theme.primary },
              { icon: Users, value: '1000+', label: t('home.stats.couriers'), color: theme.secondary },
              { icon: MapPin, value: '50+', label: t('home.stats.cities'), color: theme.primary },
              { icon: Star, value: '4.9', label: t('home.stats.rating'), color: theme.secondary },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.howItWorks.title')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', icon: Package, title: t('home.howItWorks.step1.title'), desc: t('home.howItWorks.step1.description') },
              { step: '2', icon: Truck, title: t('home.howItWorks.step2.title'), desc: t('home.howItWorks.step2.description') },
              { step: '3', icon: MapPin, title: t('home.howItWorks.step3.title'), desc: t('home.howItWorks.step3.description') },
              { step: '4', icon: Star, title: t('home.howItWorks.step4.title'), desc: t('home.howItWorks.step4.description') },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 text-white font-bold text-2xl"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {step.step}
                  </div>
                  <div 
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                    style={{ backgroundColor: `${theme.secondary}15` }}
                  >
                    <step.icon className="w-10 h-10" style={{ color: theme.secondary }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/4 -right-4 w-8 h-0.5 bg-gray-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 bg-gradient-to-br ${theme.gradient} relative`}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{t('home.features.title')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, title: t('home.features.fast.title'), desc: t('home.features.fast.description') },
              { icon: Shield, title: t('home.features.secure.title'), desc: t('home.features.secure.description') },
              { icon: Package, title: t('home.features.affordable.title'), desc: t('home.features.affordable.description') },
              { icon: Users, title: t('home.features.support.title'), desc: t('home.features.support.description') },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                  style={{ backgroundColor: `${theme.primary}20` }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: theme.primary }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">{t('home.cta.title')}</h2>
            <p className="text-xl text-gray-300 mb-10">{t('home.cta.subtitle')}</p>
            <Link
              href={`/${locale}/request`}
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-semibold rounded-xl transition-all transform hover:scale-105 shadow-2xl"
              style={{ 
                backgroundColor: theme.primary,
                color: locale === 'uk' || locale === 'vi' ? '#000' : '#fff'
              }}
            >
              {t('home.cta.button')}
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Courier Connect. All rights reserved.</p>
            <p className="mt-2">
              <span className="inline-flex items-center space-x-2">
                <span>{locale === 'en' && '🇬🇧'}</span>
                <span>{locale === 'cs' && '🇨🇿'}</span>
                <span>{locale === 'uk' && '🇺🇦'}</span>
                <span>{locale === 'vi' && '🇻🇳'}</span>
                <span>{locale === 'tr' && '🇹🇷'}</span>
                <span className="font-semibold" style={{ color: theme.primary }}>
                  hostilian.org
                </span>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
