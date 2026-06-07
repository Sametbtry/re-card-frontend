import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            setError('Şifre en az 8 karakter, 1 harf ve 1 sayı içermelidir');
            return;
        }
        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }
        try {
            await api.post('/auth/register', { username: username.trim(), password });
            navigate('/login');
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail[0]?.msg || 'Kayıt başarısız');
            } else {
                setError(typeof detail === 'string' ? detail : 'Kayıt başarısız');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-gray-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-bold text-center pb-2 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Aramıza Katıl!</h2>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 mb-1 text-sm">Kullanıcı Adı</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={username} onChange={e => setUsername(e.target.value)} required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1 text-sm">Şifre</label>
                        <input 
                            type="password" 
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={password} onChange={e => setPassword(e.target.value)} required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1 text-sm">Şifre Tekrarı</label>
                        <input 
                            type="password" 
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required 
                        />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-[1.02]">
                        Kayıt Ol
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400 text-sm">
                    Zaten hesabın var mı? <Link to="/login" className="text-indigo-400 hover:underline">Giriş Yap</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
