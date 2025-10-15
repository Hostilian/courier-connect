'use client';
'use client';

import LanguageSelector from '@/components/LanguageSelector';
import { useLocationContext } from '@/components/LocationProvider';
import LocationSelector from '@/components/LocationSelector';
import { getCountryByCode } from '@/lib/countries';
import { getLanguageByCode, getLocaleTheme } from '@/lib/languages';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Package, Shield, Sparkles, Star, Truck, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import type { CSSProperties } from 'react';

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
        defaultMessage: 'Serving {country} with sunshine energy',
      })
    : t('home.hero.locationFallback', {
        defaultMessage: 'Delivering with a sunshine smile worldwide',
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
              <LocationSelector />
              <LanguageSelector />
            </div>

            <div className="md:hidden flex items-center gap-2">
              <LocationSelector />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      <section className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} py-20 sm:py-28`}>
        <div className="absolute inset-0 opacity-10" style={overlay} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>{language?.culturalTheme.description || 'Sunshine-fast deliveries'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl sm:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow">
              {t('home.hero.subtitle')}
            </p>

            <div className="flex flex-col items-center gap-4 mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm sm:text-base">
                <MapPin className="w-4 h-4" />
                {locationLine}
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-3 text-white/80 text-sm">
                <span>{t('home.hero.changeLocation', { defaultMessage: 'Need a different spot?' })}</span>
                <LocationSelector />
              </div>
            </div>

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

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Package, value: '5000+', label: t('home.stats.deliveries'), color: theme.primary },
              { icon: Users, value: '1000+', label: t('home.stats.couriers'), color: theme.secondary },
              { icon: MapPin, value: '150+', label: t('home.stats.cities'), color: theme.primary },
              { icon: Star, value: '4.9', label: t('home.stats.rating'), color: theme.secondary },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            ].map((item, index) => (
              <motion.div
                key={item.step}
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
                    {item.step}
                  </div>
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                    style={{ backgroundColor: `${theme.secondary}15` }}
                  >
                    <item.icon className="w-10 h-10" style={{ color: theme.secondary }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {index < 3 && <div className="hidden lg:block absolute top-1/4 -right-4 w-8 h-0.5 bg-gray-300" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {t('home.locations.title', { defaultMessage: 'Trusted wherever you need us' })}
                </h2>
                <p className="text-lg text-gray-600">
                  {t('home.locations.subtitle', {
                    city: location.city || '',
                    country: country?.name || '',
                    defaultMessage: 'From historic boulevards to coastal markets, Courier Connect brings sunshine energy to every doorstep.',
                  })}
                </p>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl" aria-hidden="true">{country?.flag ?? '🌍'}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {country?.name || t('home.locations.global', { defaultMessage: 'Worldwide coverage' })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {location.city
                          ? t('home.locations.activeCity', {
                              city: location.city || '',
                              defaultMessage: 'Showing nearby couriers in {city}',
                            })
                          : t('home.locations.activeGlobal', {
                              defaultMessage: 'Pick a location to see local courier vibes',
                            })}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {t('home.locations.coverage', {
                      defaultMessage: 'We operate across the European Union, North and South America, and every country Steam recognizes. Tap the selector to share where you are, and we will handle the hand-off.',
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid sm:grid-cols-2 gap-3"
              >
                {highlightHubs.map((hub, index) => (
                  <div
                    key={hub.key}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex items-center gap-3"
                  >
                    <span className="text-2xl" aria-hidden="true">{hub.flag}</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {t(`home.locations.hubs.${hub.key}` as any, {
                          defaultMessage: hub.key,
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('home.locations.hubTagline', {
                          defaultMessage: 'Same-day sunshine service',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 bg-gradient-to-br ${theme.gradient} relative`}>
        <div className="absolute inset-0 opacity-5" style={overlay} />

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
                key={feature.title as string}
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
                color: '#111827',
              }}
            >
              {t('home.cta.button')}
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Courier Connect. All rights reserved.</p>
            <p className="mt-2 font-semibold" style={{ color: theme.primary }}>
              hostilian.org
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
