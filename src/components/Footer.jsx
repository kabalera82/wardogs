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
        {/* YouTube */}
        <a href="#" className="w-10 h-10 bg-red-900/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        {/* Twitter/X */}
        <a href="#" className="w-10 h-10 bg-red-900/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        {/* Instagram */}
        <a href="#" className="w-10 h-10 bg-red-900/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        {/* Web/Globe */}
        <a href="#" className="w-10 h-10 bg-red-900/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.931 9h-2.764a14.67 14.67 0 0 0-1.792-6.243A8.013 8.013 0 0 1 19.931 11zm-6.93-7.252c1.447 1.5 2.567 3.91 2.922 7.252h-5.846c.355-3.342 1.475-5.752 2.924-7.252zM11 20.006c-.012.004-.025 0-.037.004-1.411-1.507-2.506-3.895-2.858-7.01h5.794c-.352 3.115-1.447 5.503-2.858 7.01-.012-.004-.024 0-.04-.004zM8.623 4.757A14.667 14.667 0 0 0 6.833 11H4.069a8.013 8.013 0 0 1 4.554-6.243zM4.069 13h2.764a14.67 14.67 0 0 0 1.792 6.243A8.013 8.013 0 0 1 4.069 13zm11.307 6.243A14.667 14.667 0 0 0 17.167 13h2.764a8.013 8.013 0 0 1-4.555 6.243z"/>
          </svg>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;