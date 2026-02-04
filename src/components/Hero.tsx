'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, Globe, MessageCircle, Sparkles, Zap } from 'lucide-react';

export const Hero = ({ onStart }: { onStart: () => void }) => {
  const router = useRouter();
  return (
    <div className="relative pt-28 pb-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#1E7F88]/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-[10%] w-96 h-96 bg-[#F1843F]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#1E7F88]/3 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-[#1E7F88]/20 text-[#1E7F88] bg-[#1E7F88]/5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Plateforme d'apprentissage nouvelle generation
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            <span className="text-gray-900">Apprenez une langue</span>
            <br />
            <span className="bg-gradient-to-r from-[#1E7F88] to-[#F1843F] bg-clip-text text-transparent">
              avec de vrais profs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Cours en ligne, chat en temps reel avec des professeurs natifs.
            Progressez a votre rythme avec un suivi personnalise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={onStart}
              size="lg"
              className="bg-[#1E7F88] hover:bg-[#176570] text-white px-8 py-6 text-base rounded-xl shadow-lg shadow-[#1E7F88]/20 group"
            >
              Commencer maintenant
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/courses')}
              className="px-8 py-6 text-base rounded-xl border-gray-200 hover:border-[#1E7F88]/30 hover:bg-[#1E7F88]/5"
            >
              Voir les cours
            </Button>
          </motion.div>
        </div>

        {/* Floating feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#1E7F88]/10 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-[#1E7F88]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Profs natifs</p>
              <p className="text-xs text-gray-500">Du monde entier</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#F1843F]/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-[#F1843F]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Chat en direct</p>
              <p className="text-xs text-gray-500">Reponse instantanee</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Progression rapide</p>
              <p className="text-xs text-gray-500">Suivi personnalise</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
