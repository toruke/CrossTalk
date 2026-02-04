'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Language {
  id: string;
  name: string;
  flag: string;
  image: string;
  color: string;
}

const LANGUAGES: Language[] = [
  { id: 'fr', name: 'Français', flag: '🇫🇷', color: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1609861046022-b966db74c64f' },
  { id: 'es', name: 'Español', flag: '🇪🇸', color: 'bg-red-500', image: 'https://images.unsplash.com/photo-1682282910440-0e054ff0dce5' },
  { id: 'jp', name: '日本語', flag: '🇯🇵', color: 'bg-rose-600', image: 'https://images.unsplash.com/photo-1662107399413-ccaf9bbb1ce9' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪', color: 'bg-amber-500', image: 'https://images.unsplash.com/photo-1583413739899-419fe46efefb' },
];

export const LanguageSelector = ({ onSelect }: { onSelect: (id: string) => void }) => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Quelle langue voulez-vous apprendre ?</h2>
          <p className="mt-4 text-gray-600">Choisissez votre destination et commencez votre voyage linguistique.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {LANGUAGES.map((lang, index) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => onSelect(lang.id)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="h-48 relative">
                <ImageWithFallback 
                  src={`${lang.image}?w=500&h=400&fit=crop`} 
                  alt={lang.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-3xl">
                  {lang.flag}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{lang.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">120+ Leçons</span>
                  <div className={`w-8 h-8 rounded-full ${lang.color} flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity`}>
                    →
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
