import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Home, Menu, X, Library, Repeat, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-700">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" onClick={closeMenu} className="text-2xl font-extrabold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 transition-all hover:scale-105">
                    <BookOpen className="text-indigo-400" /> ReCard
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-5 items-center text-sm font-medium">
                    {isAuthenticated ? (
                        <>
                            <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                                <Home size={18} className="text-gray-400" /> Keşfet
                            </Link>
                            <Link to="/library" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                                <Library size={18} className="text-gray-400" /> Kütüphane
                            </Link>
                            <Link to="/review" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                                <Repeat size={18} className="text-gray-400" /> Tekrar
                            </Link>
                            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                                <User size={18} className="text-gray-400" /> Profil
                            </Link>
                            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 ml-2">
                                <LogOut size={18} /> Çıkış
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                                <LogIn size={18} className="text-gray-400" /> Giriş Yap
                            </Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-1.5">
                                <UserPlus size={18} /> Kayıt Ol
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-xl bg-gray-700/30 border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/65 transition-all">
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-gray-700/80 absolute w-full left-0 right-0 shadow-2xl">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-2 text-sm font-medium">
                        {isAuthenticated ? (
                            <>
                                <Link to="/" onClick={closeMenu} className="text-gray-300 hover:text-white hover:bg-gray-700/40 px-3 py-2.5 rounded-xl transition-all flex items-center gap-3">
                                    <Home size={18} className="text-indigo-400" /> Keşfet
                                </Link>
                                <Link to="/library" onClick={closeMenu} className="text-gray-300 hover:text-white hover:bg-gray-700/40 px-3 py-2.5 rounded-xl transition-all flex items-center gap-3">
                                    <Library size={18} className="text-indigo-400" /> Kütüphane
                                </Link>
                                <Link to="/review" onClick={closeMenu} className="text-gray-300 hover:text-white hover:bg-gray-700/40 px-3 py-2.5 rounded-xl transition-all flex items-center gap-3">
                                    <Repeat size={18} className="text-indigo-400" /> Tekrar
                                </Link>
                                <Link to="/profile" onClick={closeMenu} className="text-gray-300 hover:text-white hover:bg-gray-700/40 px-3 py-2.5 rounded-xl transition-all flex items-center gap-3">
                                    <User size={18} className="text-indigo-400" /> Profil
                                </Link>
                                <hr className="border-gray-700/50 my-1" />
                                <button onClick={handleLogout} className="w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2.5 rounded-xl transition-all flex items-center gap-3">
                                    <LogOut size={18} /> Çıkış
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu} className="text-gray-300 hover:text-white hover:bg-gray-700/40 px-3 py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-700">
                                    <LogIn size={18} className="text-indigo-400" /> Giriş Yap
                                </Link>
                                <Link to="/register" onClick={closeMenu} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-3 rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all text-center flex items-center justify-center gap-2">
                                    <UserPlus size={18} /> Kayıt Ol
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
