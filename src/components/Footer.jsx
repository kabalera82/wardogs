const Footer = () => (
  <footer className="bg-black border-t border-gray-900 py-12 mt-12">
    <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
        <a href="#" className="hover:text-white transition-colors">About Us</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
      </div>
      
      <div className="flex gap-4">
        {/* Círculos rojos de redes sociales */}
        {['Youtube', 'Twitter', 'Insta', 'Web'].map((social, i) => (
          <div key={i} className="w-8 h-8 bg-red-900/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors text-white text-xs">
            {/* Aquí irían iconos reales, uso iniciales por ahora */}
            {social[0]}
          </div>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;