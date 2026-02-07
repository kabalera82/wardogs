import React from 'react';

// Componente auxiliar para las tarjetas de pelea
const FightCard = ({ fighter1, fighter2, stats1, stats2 }) => (
  <div className="bg-[#111] border border-gray-800 p-4 hover:border-red-600 transition-colors">
    <div className="flex justify-between items-center">
      <div className="text-center">
        <p className="text-white font-bold">{fighter1}</p>
        <p className="text-xs text-gray-500">{stats1}</p>
      </div>
      <span className="text-red-600 font-bold text-xl">VS</span>
      <div className="text-center">
        <p className="text-white font-bold">{fighter2}</p>
        <p className="text-xs text-gray-500">{stats2}</p>
      </div>
    </div>
  </div>
);

export const Hero = () => {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-gray-200 font-sans selection:bg-red-600 selection:text-white">

      {/* === HERO SECTION === */}
      <section id="inicio" className="relative h-[350px] w-full mt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/50"></div>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-between px-8 md:px-24 lg:px-32">
          <h1 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter italic leading-tight max-w-md">
            Dominate. <span className="text-gray-400">Train.</span><br />Conquer.
          </h1>
          <div className="flex-1 flex justify-end items-center pr-8 md:pr-16">
            <img src="/wardogs.webp" alt="Logo" className="h-40 md:h-56 w-auto" />
          </div>
        </div>
      </section>

      {/* === MAIN CONTENT GRID === */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3 space-y-12">
          
          <section id="luchadores">
            <h2 className="text-2xl font-bold text-white uppercase mb-6 tracking-wide border-l-4 border-red-600 pl-3">
              Featured Fights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FightCard 
                fighter1="Lenny 'Skin' Tech" 
                fighter2="Danny 'Warrior'"
                stats1="240 / 27 / 193"
                stats2="208 / 18 / 223"
              />
              <FightCard 
                fighter1="Mike 'Iron'" 
                fighter2="John 'Bones'"
                stats1="220 / 25 / 180"
                stats2="215 / 29 / 185"
              />
            </div>
          </section>

          <section id="galeria">
            <h2 className="text-2xl font-bold text-white uppercase mb-6 tracking-wide border-l-4 border-red-600 pl-3">
              Gallery
            </h2>
            <div className="border border-red-600 p-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square relative group overflow-hidden bg-gray-900">
                    <img 
                      src={`/assets/0${i+1}.jpeg`} 
                      alt="Gallery" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-[#111] p-4">
            <h3 className="text-xl font-bold text-white uppercase mb-4 text-right">Horarios</h3>
            
            <div className="flex flex-col gap-2">
               <img 
            src="/image.png" 
            alt="MMA Fight" 
            className="w-full h-full object-cover opacity-60"
          />
            </div>

            <div className="mt-6 text-right text-sm text-gray-400 space-y-1">
              <p className="font-bold text-white uppercase">Authentication</p>
              <a href="#" className="block hover:text-red-500 transition-colors">🔴 Reset Password</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};