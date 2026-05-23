import React, { useState } from 'react';
import { 
  Calendar, MapPin, Video, Users, 
  Search, Filter, ChevronRight, Clock, 
  Ticket, ExternalLink, Info, Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import PageTransition from '../components/PageTransition';

const EVENTS_DATA = [
  {
    id: 1,
    title: "Salon International de l'Industrie (Algeria Industry 2026)",
    type: "Physique",
    category: "Salon",
    date: "15 - 18 Juin 2026",
    location: "Palais des Expositions (SAFEX), Alger",
    description: "Le plus grand rassemblement industriel de l'année en Algérie. Plus de 500 exposants attendus.",
    image: "https://picsum.photos/seed/expo/800/400",
    status: "Bientôt"
  },
  {
    id: 2,
    title: "Webinaire : L'IA au service de la maintenance prédictive",
    type: "En ligne",
    category: "Webinaire",
    date: "12 Avril 2026",
    time: "10:00 - 11:30",
    location: "Plateforme Zoom",
    description: "Découvrez comment l'intelligence artificielle révolutionne la maintenance industrielle avec nos experts.",
    image: "https://picsum.photos/seed/webinar/800/400",
    status: "Ouvert"
  },
  {
    id: 3,
    title: "Forum de l'Investissement Industriel",
    type: "Physique",
    category: "Conférence",
    date: "05 Mai 2026",
    location: "Hôtel El Aurassi, Alger",
    description: "Rencontre entre décideurs publics et investisseurs privés pour discuter du nouveau code de l'investissement.",
    image: "https://picsum.photos/seed/forum/800/400",
    status: "Bientôt"
  },
  {
    id: 4,
    title: "Atelier : Certification ISO 14001",
    type: "En ligne",
    category: "Formation",
    date: "22 Avril 2026",
    time: "14:00 - 17:00",
    location: "Google Meet",
    description: "Une session pratique pour comprendre les exigences de la norme environnementale.",
    image: "https://picsum.photos/seed/training/800/400",
    status: "Ouvert"
  }
];

const Events = () => {
  const [activeType, setActiveType] = useState('Tous');

  const filteredEvents = EVENTS_DATA.filter(event => {
    const matchesType = activeType === 'Tous' || event.type === activeType;
    return matchesType;
  });

  return (
    <PageTransition>
      <div className="bg-neutral-bg min-h-screen pb-20">
        {/* Header */}
        <section className="bg-primary py-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h1 className="text-4xl font-extrabold mb-4">Agenda des <span className="text-secondary">Événements</span></h1>
                <p className="text-primary-foreground/80 text-lg max-w-xl">
                  Ne manquez aucun rendez-vous majeur de l'industrie algérienne : salons, forums et webinaires.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
            <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
              {['Tous', 'Physique', 'En ligne'].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activeType === type 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-gray-500 hover:text-primary"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                <Filter className="h-4 w-4" />
                <span>Plus de filtres</span>
              </button>
              <button className="flex items-center space-x-2 text-sm font-bold text-secondary hover:underline">
                <Calendar className="h-4 w-4" />
                <span>Vue calendrier</span>
              </button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col md:flex-row"
              >
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                      event.type === 'Physique' ? "bg-primary/80 text-white" : "bg-secondary/80 text-white"
                    )}>
                      {event.type}
                    </span>
                  </div>
                </div>
                <div className="md:w-3/5 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                      {event.category}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded uppercase",
                      event.status === 'Ouvert' ? "bg-success/10 text-success" : "bg-gray-100 text-gray-400"
                    )}>
                      {event.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-secondary" />
                      <span className="font-medium truncate">{event.location}</span>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <button className="text-primary font-bold text-sm flex items-center space-x-1 hover:translate-x-1 transition-transform">
                      <span>Détails</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button className="btn-primary py-2 px-6 rounded-xl text-xs">
                      S'inscrire
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Organizer CTA */}
          <section className="mt-24 bg-neutral-bg border-2 border-dashed border-gray-200 p-12 rounded-[40px] text-center">
            <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center text-primary mx-auto mb-6">
              <Ticket className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">Vous organisez un événement industriel ?</h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-8">
              Faites connaître votre salon, conférence ou webinaire à toute la communauté Algeria Industry.
            </p>
            <button className="bg-white border border-primary text-primary px-8 py-4 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all flex items-center space-x-2 mx-auto">
              <span>Soumettre un événement</span>
              <ExternalLink className="h-5 w-5" />
            </button>
          </section>

          {/* Reminder Section */}
          <section className="mt-12 bg-white p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-primary">Alerte Événements</h4>
                <p className="text-sm text-gray-400">Recevez une notification 24h avant chaque événement qui vous intéresse.</p>
              </div>
            </div>
            <button className="text-secondary font-bold text-sm hover:underline">
              Activer les notifications
            </button>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default Events;
