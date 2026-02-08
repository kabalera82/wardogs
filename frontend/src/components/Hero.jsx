import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { BACKEND_URL } from '../services/api';
import { contentService } from '../services/contentService';
import { galleryService } from '../services/galleryService';

import ClassSchedule from './ClassSchedule';

import { FaFistRaised, FaClock, FaMapMarkerAlt, FaCalendarDay, FaExpandArrowsAlt, FaTimes } from 'react-icons/fa';

export const Hero = () => {
  const [fights, setFights] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [isFightsExpanded, setIsFightsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Featured Fights from the standard Events API (managed by Admin)
        const eventsRes = await eventService.obtenerEventos();
        if (eventsRes.success) setFights(eventsRes.data);

        // Fetch Gallery Images
        const galleryRes = await galleryService.obtenerGaleria();
        if (galleryRes.success) {
          // Show latest 8 images in Home
          setGalleryImages(galleryRes.data.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div id="inicio" className="bg-[#0a0a0a] min-h-screen text-gray-200 font-sans selection:bg-red-600 selection:text-white">

      {/* === BACKGROUND === */}
      <div className="absolute inset-0 z-0 pointer-events-none h-[800px] overflow-hidden">
        <img src="/wardogs-bg.jpg" alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
      </div>

      {/* === MAIN CONTENT GRID === */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-start mt-12">

          {/* === LEFT COLUMN: SLOGAN + FIGHTS === */}
          <div className="flex flex-col gap-12">

            {/* SLOGAN */}
            <div className="flex justify-center lg:justify-start px-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter italic leading-[0.9] drop-shadow-2xl text-center lg:text-left">
                Dominate.<br />
                <span className="text-zinc-500">Train.</span><br />
                <span className="text-red-600">Conquer.</span>
              </h1>
            </div>

            {/* FEATURED FIGHTS CARD */}
            <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
              <div className="bg-gradient-to-r from-red-900/40 to-black p-5 border-b border-red-900/30 flex items-center gap-4">
                <div className="p-3 bg-red-600 rounded-lg shadow-lg shadow-red-600/20">
                  <FaFistRaised className="text-xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Eventos</h2>
              </div>
              <div
                className="p-0 bg-[#111] relative cursor-pointer group"
                onClick={() => setIsFightsExpanded(true)}
              >
                {/* Preview Container */}
                <div className="h-64 overflow-hidden relative opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="divide-y divide-zinc-800 pointer-events-none">
                    {fights.length > 0 ? fights.slice(0, 3).map(fight => (
                      <div key={fight._id} className="p-4 flex items-center gap-4 opacity-70">
                        <div className="w-16 h-16 rounded bg-zinc-800 flex-shrink-0 overflow-hidden">
                          {fight.imagen ? (
                            <img src={`${BACKEND_URL}${fight.imagen}`} className="w-full h-full object-cover" />
                          ) : <div className="w-full h-full bg-zinc-900" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{fight.titulo || `${fight.luchador1} vs ${fight.luchador2}`}</h4>
                          <span className="text-xs text-red-500">{new Date(fight.fecha).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )) : (
                      <div className="h-full flex items-center justify-center text-zinc-600 p-10">
                        <FaFistRaised className="text-4xl mb-4 opacity-20" />
                      </div>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors z-10">
                    <div className="bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-zinc-700 backdrop-blur-sm shadow-xl transform group-hover:scale-110 transition-transform">
                      <FaExpandArrowsAlt /> <span>Click to Expand</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN: LOGO + SCHEDULE === */}
          <div className="flex flex-col gap-12">

            {/* LOGO */}
            <div className="flex justify-center lg:justify-center px-4 h-[180px] items-center">
              <img
                src="/wardogs.webp"
                alt="Logo"
                className="h-40 md:h-56 w-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            {/* CLASS SCHEDULE CARD */}
            <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col relative group">
              <div className="bg-gradient-to-r from-zinc-800 to-black p-5 border-b border-zinc-700/50 flex items-center gap-4">
                <div className="p-3 bg-zinc-700 rounded-lg shadow-lg">
                  <FaClock className="text-xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Horarios</h2>
              </div>

              <div
                className="p-5 bg-[#111] relative cursor-pointer"
                onClick={() => setIsScheduleExpanded(true)}
              >
                {/* Miniaturized / Preview container */}
                <div className="h-64 overflow-hidden relative opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="transform scale-75 origin-top-left w-[133%]"> {/* Scale content down */}
                    <ClassSchedule initialAdminMode={false} />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors z-10">
                    <div className="bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-zinc-700 backdrop-blur-sm shadow-xl transform group-hover:scale-110 transition-transform">
                      <FaExpandArrowsAlt /> <span>Click to Expand</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>



        {/* GALLERIA SECTION */}
        <section id="galeria" className="pt-8 border-t border-zinc-900">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-4">
              Wardogs <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Gallery</span>
            </h2>
            <div className="h-1 w-24 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {galleryImages.length > 0 ? galleryImages.map((img) => (
              <div key={img._id} className="aspect-square relative group overflow-hidden bg-black cursor-pointer">
                <img
                  src={`${BACKEND_URL}${img.imagen}`}
                  alt={img.titulo || 'Gallery'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=WARDOGS'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                  <span className="text-white font-bold text-sm md:text-lg uppercase tracking-widest border-b-2 border-white pb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.titulo || 'View'}
                  </span>
                </div>
              </div>
            )) : (
              // Fallback to placeholders if no images
              [...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square relative group overflow-hidden bg-black cursor-pointer">
                  <img
                    src={`/assets/galeria/0${i + 1}.jpeg`}
                    alt="Gallery"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=WARDOGS'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <span className="text-white font-bold text-sm md:text-lg uppercase tracking-widest border-b-2 border-white pb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* COMMUNITY SECTION - Instagram Feed */}
        <section id="community" className="py-20 border-t border-zinc-900">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-4">
              Wardogs <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Comunidad</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Síguenos en Instagram y únete a nuestra comunidad de luchadores
            </p>
            <div className="h-1 w-24 bg-red-600 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Community / Contact Section */}
          <section className="py-20 bg-zinc-900">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  WARDOGS <span className="text-red-600">COMUNIDAD</span>
                </h2>
                <p className="text-gray-400 text-lg">Visítanos y entrena con nosotros</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Contact Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 hover:border-red-600 transition-all">
                    <h3 className="text-red-600 font-bold text-sm mb-2">EQUIPACIÓN</h3>
                    <p className="text-white text-lg">Disponible</p>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 hover:border-red-600 transition-all">
                    <h3 className="text-red-600 font-bold text-sm mb-2">HORARIOS</h3>
                    <p className="text-white text-lg">Consultar</p>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 hover:border-red-600 transition-all">
                    <h3 className="text-red-600 font-bold text-sm mb-2">WARDOGS CLUB</h3>
                    <p className="text-white text-lg">📞 631 318 270</p>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 hover:border-red-600 transition-all">
                    <h3 className="text-red-600 font-bold text-sm mb-2">INSTAGRAM</h3>
                    <a
                      href="https://instagram.com/wardogspdp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-lg hover:text-red-600 transition-colors"
                    >
                      @wardogspdp
                    </a>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 hover:border-red-600 transition-all col-span-2">
                    <h3 className="text-red-600 font-bold text-sm mb-2">UBICACIÓN</h3>
                    <p className="text-white text-lg">Cta. Tudela 9</p>
                    <p className="text-gray-400">CABANILLAS</p>
                    <p className="text-gray-400">Tudela, Navarra</p>
                  </div>

                  <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 hover:border-red-600 transition-all col-span-2">
                    <h3 className="text-red-600 font-bold text-sm mb-2">MATERIAL</h3>
                    <p className="text-white text-lg">Equipamiento completo disponible</p>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="rounded-lg overflow-hidden border border-zinc-700 h-[500px]">
                  <iframe
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Cta.+Tudela+9,+Cabanillas,+Tudela,+Navarra,+Spain&center=42.0322,-1.5245&zoom=15"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Wardogs Club - Cabanillas, Tudela"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>
        </section>

      </div>

      {/* === FIGHTS MODAL === */}
      {isFightsExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setIsFightsExpanded(false)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-[#111] rounded-2xl border border-zinc-700 shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsFightsExpanded(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-zinc-800 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <FaFistRaised className="text-red-500" /> Featured Fights
              </h2>
              <div className="divide-y divide-zinc-800">
                {fights.map(fight => (
                  <div key={fight._id} className="p-5 hover:bg-zinc-800/40 transition-colors flex items-center gap-5 group cursor-pointer">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-zinc-800 relative shadow-lg">
                      {fight.imagen ? (
                        <img src={`${BACKEND_URL}${fight.imagen}`} alt="Fight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                          <FaFistRaised className="text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-zinc-700 flex items-center gap-1">
                          <FaCalendarDay className="text-red-500" /> {new Date(fight.fecha).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white leading-tight truncate">
                        {fight.titulo || `${fight.luchador1} vs ${fight.luchador2}`}
                      </h3>
                      <p className="text-sm text-gray-400 truncate mt-1">{fight.descripcion}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500">
                        <FaMapMarkerAlt className="text-red-500" /> {fight.ubicacion}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === SCHEDULE MODAL === */}
      {isScheduleExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setIsScheduleExpanded(false)}>
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-[#111] rounded-2xl border border-zinc-700 shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsScheduleExpanded(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-zinc-800 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <FaClock className="text-red-500" /> Full Class Schedule
              </h2>
              <ClassSchedule initialAdminMode={false} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};