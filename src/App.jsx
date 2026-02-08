import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import Footer from './components/Footer';
import Login from './pages/Login';
import UserPanel from './components/user/UserPanel';
import Shop from './pages/Shop';
import News from './pages/News';
import Fighters from './pages/Fighters';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Ruta pública - Home */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Hero />
                <Footer />
              </>
            }
          />

          {/* Ruta pública - Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/news" element={<News />} />
          <Route path="/fighters" element={<Fighters />} />

          {/* Rutas protegidas - User Panel */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;