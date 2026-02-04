'use client';

import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/Navbar';
import { Hero } from '@/src/components/Hero';
import { CourseGrid } from '@/src/components/CourseGrid';
import { Separator } from '@/src/components/ui/separator';
import { Button } from '@/src/components/ui/button';
import { Users, BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    // Redirection vers toutes les pages
    router.push(`/${page === 'home' ? '' : page}`);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#1E7F88]/10 selection:text-[#1E7F88]">
      <Navbar onNavigate={handleNavigate} currentPage="home" />

      <main>
        <Hero onStart={() => {
          const element = document.getElementById('courses');
          element?.scrollIntoView({ behavior: 'smooth' });
        }} />

        <div id="courses">
          <CourseGrid limit={6} />
        </div>

              {/* Features section */}
              <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#1E7F88]/3 rounded-full blur-3xl -translate-y-1/2" />
                  <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#F1843F]/3 rounded-full blur-3xl -translate-y-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      Pourquoi choisir CrossTalk ?
                    </h2>
                    <p className="mt-3 text-gray-500 max-w-lg mx-auto">
                      Une plateforme pensee pour un apprentissage efficace et agreable
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                      {
                        icon: Users,
                        title: 'Professeurs qualifies',
                        desc: 'Des professeurs natifs et certifies passionnes par leur langue.',
                        color: '#1E7F88',
                      },
                      {
                        icon: MessageSquare,
                        title: 'Chat en temps reel',
                        desc: 'Communiquez directement avec vos professeurs a tout moment.',
                        color: '#F1843F',
                      },
                      {
                        icon: BookOpen,
                        title: 'Cours structures',
                        desc: 'Des parcours organises et adaptes a chaque niveau.',
                        color: '#8B5CF6',
                      },
                    ].map((feature, i) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${feature.color}10` }}
                        >
                          <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA section */}
              <section className="py-24 bg-gradient-to-br from-[#1E7F88] to-[#176570] relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F1843F]/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                      Pret a commencer votre aventure linguistique ?
                    </h2>
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                      Rejoignez des milliers d'etudiants qui apprennent une nouvelle langue chaque jour avec CrossTalk.
                    </p>
                    <Button
                      onClick={() => {
                        const element = document.getElementById('courses');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      size="lg"
                      className="bg-white text-[#1E7F88] hover:bg-white/90 px-8 py-6 text-base rounded-xl font-semibold group"
                    >
                      Decouvrir les cours
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>
              </section>

              {/* Footer */}
              <footer className="bg-gray-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2.5 mb-4">
                        <Image
                          src="/images/logo-crossTalk.png"
                          alt="CrossTalk Logo"
                          width={32}
                          height={32}
                          className="object-contain brightness-200"
                        />
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1E7F88] to-[#F1843F]">
                          CrossTalk
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                        La plateforme d'apprentissage de langues avec des professeurs natifs. Apprenez a votre rythme.
                      </p>
                    </div>

                    {/* Links */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-200 mb-4">Plateforme</h4>
                      <ul className="space-y-2.5">
                        <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Cours</a></li>
                        <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Professeurs</a></li>
                        <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Tarifs</a></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-200 mb-4">Support</h4>
                      <ul className="space-y-2.5">
                        <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">A propos</a></li>
                        <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a></li>
                        <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a></li>
                      </ul>
                    </div>
                  </div>

                  <Separator className="bg-gray-800" />

                  <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                      &copy; 2026 CrossTalk. Tous droits reserves.
                    </p>
                    <div className="flex gap-6">
                      <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Confidentialite</a>
                      <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Conditions</a>
                    </div>
                  </div>
                </div>
              </footer>
      </main>
    </div>
  );
}
