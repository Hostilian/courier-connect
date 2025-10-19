'use client';

import { useLocale, useTranslations } from 'next-intl';
import { getLocaleTheme, getLanguageByCode } from '@/lib/languages';
import { useLocationContext } from '@/components/LocationProvider';
import { getCountryByCode } from '@/lib/countries';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  Truck,
  Star,
  Shield,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import LocationSelector from './LocationSelector';
import QuickFlags from './QuickFlags';
import LanguageSelector from './LanguageSelector';
import ImageOptimizationDemo from './ImageOptimizationDemo';

const overlayStyles: Record<'geo' | 'floral' | 'grid' | 'waves', CSSProperties> = {
    geo: {
      backgroundImage:
        'repeating-linear-gradient(45deg, transparent, transparent 32px, rgba(255,255,255,0.12) 32px, rgba(255,255,255,0.12) 64px)',
    },
    floral: {
      backgroundImage:
        'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 2px, transparent 2px), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 3px, transparent 3px)',
      backgroundSize: '48px 48px',
    },
    grid: {
      backgroundImage:
        'repeating-linear-gradient(0deg, transparent, transparent 14px, rgba(255,255,255,0.12) 14px, rgba(255,255,255,0.12) 28px), repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(255,255,255,0.12) 14px, rgba(255,255,255,0.12) 28px)',
    },
    waves: {
      backgroundImage:
        'repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.16), rgba(255,255,255,0.16) 2px, transparent 2px, transparent 12px)',
    },
  };
  
  function resolveOverlay(pattern?: string): CSSProperties {
    if (!pattern) return overlayStyles.geo;
    const key = pattern.toLowerCase();
  
    if (key.includes('geo') || key.includes('digital') || key.includes('modern') || key.includes('grid')) {
      return overlayStyles.geo;
    }
    if (key.includes('wave') || key.includes('cloud') || key.includes('sakura') || key.includes('sea')) {
      return overlayStyles.waves;
    }
    if (key.includes('tile') || key.includes('azulejo') || key.includes('mosaic') || key.includes('lattice')) {
      return overlayStyles.grid;
    }
    return overlayStyles.floral;
  }
  
  const highlightHubs = [
    { key: 'berlin', flag: '🇩🇪' },
    { key: 'prague', flag: '🇨🇿' },
    { key: 'istanbul', flag: '🇹🇷' },
    { key: 'newYork', flag: '🇺🇸' },
    { key: 'toronto', flag: '🇨🇦' },
    { key: 'saoPaulo', flag: '🇧🇷' },
  ];

export default function HomePage() {
    const t = useTranslations();
    const locale = useLocale();
    const theme = getLocaleTheme(locale);
    const language = getLanguageByCode(locale);
    const overlay = resolveOverlay(language?.culturalTheme.pattern);
    const { location } = useLocationContext();
    const country = location.countryCode ? getCountryByCode(location.countryCode) : undefined;
  
    const locationLine = location.city
      ? t('home.hero.locationCity', {
          city: location.city || '',
          defaultMessage: 'Local couriers in {city}',
        })
      : country
      ? t('home.hero.locationCountry', {
          country: country.name,
          defaultMessage: 'Serving {country}',
        })
      : t('home.hero.locationFallback', {
          defaultMessage: 'Delivering worldwide',
        });
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href={`/${locale}`} className="flex items-center space-x-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {language?.nativeName || 'Courier Connect'}
                </span>
              </Link>
  
              <div className="hidden md:flex items-center space-x-4">
                <LocationSelector />
                <LanguageSelector />
                <Link
                  href={`/${locale}/courier/login`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {t('common.courierLogin')}
                </Link>
                <Link
                  href={`/${locale}/request`}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm"
                  style={{ backgroundColor: theme.primary }}
                >
                  {t('common.requestDelivery')}
                </Link>
              </div>
  
              <div className="md:hidden">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </nav>
  
        <header
          className="relative text-white py-20 md:py-32 overflow-hidden"
          style={{
            backgroundColor: theme.secondary,
            backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
          }}
        >
          <div
            className="absolute inset-0 opacity-50 mix-blend-overlay"
            style={overlay}
          />
          <div className="relative container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto opacity-90">
                {t('home.hero.subtitle')}
              </p>
              <p className="mt-2 text-sm font-semibold">{locationLine}</p>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <Link
                href={`/${locale}/request`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                {t('home.hero.ctaCustomer')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href={`/${locale}/courier/register`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {t('home.hero.ctaCourier')}
              </Link>
            </motion.div>
  
            <div className="mt-12">
              <QuickFlags />
            </div>
          </div>
        </header>
  
        <main>
          <section id="how-it-works" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {t('home.howItWorks.title')}
                </h2>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('home.howItWorks.subtitle')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {[
                  {
                    icon: Package,
                    title: t('home.howItWorks.step1.title'),
                    description: t('home.howItWorks.step1.description'),
                  },
                  {
                    icon: Truck,
                    title: t('home.howItWorks.step2.title'),
                    description: t('home.howItWorks.step2.description'),
                  },
                  {
                    icon: Star,
                    title: t('home.howItWorks.step3.title'),
                    description: t('home.howItWorks.step3.description'),
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: theme.primary, color: 'white' }}
                    >
                      <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-gray-600">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
  
          <section id="features" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {t('home.features.title')}
                </h2>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('home.features.subtitle')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: Clock,
                    title: t('home.features.fast.title'),
                    description: t('home.features.fast.description'),
                  },
                  {
                    icon: Shield,
                    title: t('home.features.secure.title'),
                    description: t('home.features.secure.description'),
                  },
                  {
                    icon: MapPin,
                    title: t('home.features.tracking.title'),
                    description: t('home.features.tracking.description'),
                  },
                  {
                    icon: Users,
                    title: t('home.features.noAccount.title'),
                    description: t('home.features.noAccount.description'),
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="w-12 h-12 rounded-md flex items-center justify-center mb-4"
                      style={{ backgroundColor: theme.primary, color: 'white' }}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
  
          <section
            id="hubs"
            className="py-16 md:py-24"
            style={{
              backgroundColor: theme.secondary,
              backgroundImage: `linear-gradient(to bottom, ${theme.secondary}, ${theme.primary})`,
            }}
          >
            <div className="container mx-auto px-4 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold">{t('home.hubs.title')}</h2>
              <p className="mt-3 text-lg opacity-90 max-w-2xl mx-auto">
                {t('home.hubs.subtitle')}
              </p>
              <div className="mt-8 flex flex-wrap justify-center items-center gap-4 md:gap-6">
                {highlightHubs.map((hub) => (
                  <div
                    key={hub.key}
                    className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold"
                  >
                    <span className="mr-2">{hub.flag}</span>
                    {t(`home.hubs.cities.${hub.key}`)}
                  </div>
                ))}
              </div>
            </div>
          </section>
  
          <section id="testimonials" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {t('home.testimonials.title')}
                </h2>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                  {t('home.testimonials.subtitle')}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    quote: t('home.testimonials.quote1.text'),
                    author: t('home.testimonials.quote1.author'),
                    role: t('home.testimonials.quote1.role'),
                  },
                  {
                    quote: t('home.testimonials.quote2.text'),
                    author: t('home.testimonials.quote2.author'),
                    role: t('home.testimonials.quote2.role'),
                  },
                  {
                    quote: t('home.testimonials.quote3.text'),
                    author: t('home.testimonials.quote3.author'),
                    role: t('home.testimonials.quote3.role'),
                  },
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-50 p-6 rounded-lg"
                  >
                    <div className="flex items-center mb-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full ml-1.5"
                        style={{ backgroundColor: theme.secondary }}
                      />
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                    <p className="mt-4 font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
  
          <section
            id="cta"
            className="py-20 md:py-28"
            style={{
              backgroundColor: theme.primary,
            }}
          >
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <Sparkles className="w-12 h-12 mx-auto text-white/80" />
                <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-white">
                  {t('home.cta.title')}
                </h2>
                <p className="mt-3 text-lg text-white/90 max-w-2xl mx-auto">
                  {t('home.cta.subtitle')}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Link
                    href={`/${locale}/request`}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    {t('home.cta.customerButton')}
                  </Link>
                  <Link
                    href={`/${locale}/courier/register`}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {t('home.cta.courierButton')}
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
          <ImageOptimizationDemo />
        </main>
  
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  {t('footer.solutions.title')}
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link
                      href={`/${locale}/request`}
                      className="text-base text-gray-300 hover:text-white"
                    >
                      {t('footer.solutions.request')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/track`}
                      className="text-base text-gray-300 hover:text-white"
                    >
                      {t('footer.solutions.track')}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  {t('footer.company.title')}
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {t('footer.company.about')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {t('footer.company.careers')}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  {t('footer.legal.title')}
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {t('footer.legal.privacy')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {t('footer.legal.terms')}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-8 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider uppercase">
                  {t('footer.language.title')}
                </h3>
                <div className="mt-4">
                  <LanguageSelector />
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8 text-center">
              <p className="text-base text-gray-400">
                &copy; {new Date().getFullYear()} Courier Connect. {t('footer.rights')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  