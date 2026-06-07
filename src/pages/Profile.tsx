import { useState, useEffect } from 'react';
import { User, Key, LayoutDashboard, Edit2, Check, BookOpen, GraduationCap } from 'lucide-react';
import api from '../services/api';

interface UserProfile {
    id: number;
    username: string;
    email: string | null;
    created_at: string;
    total_cards_count: number;
    studied_cards_count: number;
    learned_cards_count: number;
}

const Profile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // const [isEditingEmail, setIsEditingEmail] = useState(false);
    // const [newEmail, setNewEmail] = useState('');

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get('/auth/me');
            setProfile(res.data);
            // setNewEmail(res.data.email || '');
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = (msg: string, isError: boolean = false) => {
        if (isError) {
            setError(msg);
            setMessage('');
        } else {
            setMessage(msg);
            setError('');
        }
        setTimeout(() => {
            setMessage('');
            setError('');
        }, 5000);
    };

    // const handleSaveEmail = async () => {
    //     try {
    //         const res = await api.post('/auth/change-email', { new_email: newEmail });
    //         handleMessage(res.data.message || 'E-posta güncellendi');
    //         setIsEditingEmail(false);
    //         fetchProfile();
    //     } catch (err: any) {
    //         const detail = err.response?.data?.detail;
    //         if (Array.isArray(detail)) {
    //             handleMessage(detail[0]?.msg || 'E-posta güncellenemedi', true);
    //         } else {
    //             handleMessage(typeof detail === 'string' ? detail : 'E-posta güncellenemedi', true);
    //         }
    //     }
    // };

    const handleSavePassword = async () => {
        if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
            handleMessage('Şifre en az 8 karakter, 1 harf ve 1 sayı içermelidir', true);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            handleMessage('Yeni şifreler eşleşmiyor', true);
            return;
        }
        try {
            const res = await api.post('/auth/change-password', {
                current_password: currentPassword,
                new_password: newPassword
            });
            handleMessage(res.data.message || 'Şifre güncellendi');
            setIsEditingPassword(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                handleMessage(detail[0]?.msg || 'Şifre güncellenemedi', true);
            } else {
                handleMessage(typeof detail === 'string' ? detail : 'Şifre güncellenemedi', true);
            }
        }
    };

    return (
        <div className="flex flex-col items-center py-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl">
                <h2 className="text-3xl font-bold pb-2 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
                    <User size={32} className="text-indigo-400" /> Profilim
                </h2>

                {message && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg mb-6 text-sm border border-green-500/30">{message}</div>}
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-sm border border-red-500/30">{error}</div>}

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Yükleniyor...</div>
                ) : profile ? (
                    <div className="space-y-6">
                        <div className="space-y-4 bg-gray-900/50 p-5 rounded-xl border border-gray-700">
                            <div className="flex items-center gap-3 text-gray-300 pb-3 border-b border-gray-700/50">
                                <User size={20} className="text-indigo-400" />
                                <span className="font-medium text-lg">Kullanıcı Adı:</span>
                                <span className="text-white ml-auto text-lg">{profile.username}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <BookOpen size={18} className="text-indigo-400" />
                                <span className="font-medium">Çalışılan Kart:</span>
                                <span className="text-white ml-auto font-bold">{profile.studied_cards_count}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <GraduationCap size={18} className="text-indigo-400" />
                                <span className="font-medium">Öğrenilen Kart:</span>
                                <span className="text-white ml-auto font-bold">{profile.learned_cards_count}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <LayoutDashboard size={18} className="text-indigo-400" />
                                <span className="font-medium">Toplam Kart:</span>
                                <span className="text-white ml-auto font-bold">{profile.total_cards_count}</span>
                            </div>
                        </div>



                        {/* Password Section */}
                        <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-gray-300 font-medium text-lg">
                                    <Key size={20} className="text-indigo-400" /> Şifre
                                </div>
                                {!isEditingPassword && (
                                    <button onClick={() => setIsEditingPassword(true)} className="text-indigo-400 hover:text-indigo-300 transition-colors p-1 bg-indigo-500/10 rounded-md">
                                        <Edit2 size={18} />
                                    </button>
                                )}
                            </div>
                            {isEditingPassword ? (
                                <div className="space-y-4 mt-4">
                                    <input
                                        type="password"
                                        placeholder="Mevcut Şifre"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                                        value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Yeni Şifre"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                                        value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Yeni Şifre Tekrarı"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500"
                                        value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={handleSavePassword} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                                            <Check size={18} /> Kaydet
                                        </button>
                                        <button onClick={() => setIsEditingPassword(false)} className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 rounded-lg transition-colors flex items-center justify-center">
                                            İptal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-white tracking-[0.3em] font-mono text-xl mt-1">
                                    ••••••••
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-red-400 py-12">Profil bilgileri alınamadı.</div>
                )}
            </div>
        </div>
    );
};

export default Profile;
