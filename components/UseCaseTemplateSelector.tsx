'use client';

import { UseCaseTemplate, getAllTemplates, getRecommendedTemplates } from '@/lib/useCaseTemplates';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface UseCaseTemplateSelectorProps {
  onSelect: (template: UseCaseTemplate) => void;
  selectedTemplate?: UseCaseTemplate | null;
  onClear?: () => void;
}

export default function UseCaseTemplateSelector({ 
  onSelect, 
  selectedTemplate,
  onClear 
}: UseCaseTemplateSelectorProps) {
  const t = useTranslations('request.templates');
  const [showAll, setShowAll] = useState(false);
  const [showTips, setShowTips] = useState<string | null>(null);

  const recommendedTemplates = getRecommendedTemplates();
  const allTemplates = getAllTemplates();
  const templatesToShow = showAll ? allTemplates : recommendedTemplates;

  if (selectedTemplate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-4xl" role="img" aria-label={selectedTemplate.name}>
              {selectedTemplate.icon}
            </span>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{selectedTemplate.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
              
              {selectedTemplate.specialInstructions && selectedTemplate.specialInstructions.length > 0 && (
                <div className="mt-3 bg-white/50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {t('specialInstructions')}
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {selectedTemplate.specialInstructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {onClear && (
            <button
              onClick={onClear}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label={t('clearTemplate')}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{t('title')}</h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAll ? t('showLess') : t('showAll')}
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {templatesToShow.map((template, index) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(template)}
            onMouseEnter={() => setShowTips(template.id)}
            onMouseLeave={() => setShowTips(null)}
            className="relative group bg-white border-2 border-gray-200 hover:border-blue-400 rounded-xl p-4 transition-all hover:shadow-md text-left"
          >
            <span className="text-3xl block mb-2" role="img" aria-label={template.name}>
              {template.icon}
            </span>
            <h4 className="font-semibold text-sm text-gray-800 leading-tight">
              {template.name}
            </h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {template.description}
            </p>

            {/* Tooltip with tips */}
            <AnimatePresence>
              {showTips === template.id && template.tips && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 text-white text-xs rounded-lg p-3 z-10 pointer-events-none"
                >
                  <div className="space-y-1">
                    {template.tips.map((tip, i) => (
                      <p key={i} className="flex items-start gap-1">
                        <span className="text-blue-400 flex-shrink-0">•</span>
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                  <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        {t('helpText')}
      </p>
    </div>
  );
}
