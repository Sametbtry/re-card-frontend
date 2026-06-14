import { useEffect, useState } from 'react';
import api from '../services/api';
import FlashcardComponent from '../components/Flashcard';
import { PlusCircle, Sparkles, GraduationCap } from 'lucide-react';

const Home = () => {
    const [publicCards, setPublicCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const cardsPerPage = 8;

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const skip = (currentPage - 1) * cardsPerPage;
                const res = await api.get(`/cards/public?skip=${skip}&limit=${cardsPerPage}`);
                setPublicCards(res.data.items);
                setTotalPages(res.data.total_pages);
            } catch (err) {
                console.error("Failed to fetch public cards", err);
            }
        };
        fetchCards();
    }, [currentPage]);

    const currentCards = publicCards;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center py-12">
                <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-sm py-2 leading-tight">
                    Kelimeleri Daha Hızlı Öğren
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                    Aralıklı tekrar yöntemiyle İngilizce kelime hazinenizi kolayca genişletin,
                    <span className="text-indigo-400 font-semibold"> Pexels </span> ile her karta otomatik görsel ve sesli telaffuz ile öğrenmeyi hızlandırın.
                </p>
                <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto mt-6 bg-gray-800/30 border border-gray-700/30 rounded-2xl py-2.5 px-4 leading-relaxed backdrop-blur-sm">
                    Bu uygulama <strong className="text-indigo-400 font-semibold">PWA</strong> olarak tasarlanmıştır. Tarayıcınızın ayarlarından <strong className="text-gray-300">"Ana Ekrana Ekle"</strong> veya <strong className="text-gray-300">"Uygulamayı Yükle"</strong> seçeneğini kullanarak cihazınıza bağımsız bir uygulama gibi yükleyip kullanabilirsiniz.
                </p>
            </div>

            {/* Nasıl Çalışır Bölümü */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Adım 1 */}
                    <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center text-center hover:border-indigo-500/30 transition-all hover:scale-105 duration-300 group shadow-lg">
                        <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                            <PlusCircle size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">1. Kart Oluştur</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Öğrenmek istediğiniz yeni kelimeleri ekleyin. Sistem, Pexels ile kelimelerinize en uygun görseli bularak görsel hafızanızı canlandırır.
                        </p>
                    </div>

                    {/* Adım 2 */}
                    <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center text-center hover:border-purple-500/30 transition-all hover:scale-105 duration-300 group shadow-lg">
                        <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                            <Sparkles size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">2. Akıllı Tekrar</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Gelişmiş SM-2 algoritması, kartları unutmaya yaklaştığınız en doğru zamanlarda karşınıza çıkararak kalıcı öğrenme sağlar.
                        </p>
                    </div>

                    {/* Adım 3 */}
                    <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 flex flex-col items-center text-center hover:border-pink-500/30 transition-all hover:scale-105 duration-300 group shadow-lg">
                        <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 text-pink-400 group-hover:bg-pink-500/20 group-hover:text-pink-300 transition-colors">
                            <GraduationCap size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">3. Hafızanı Güçlendir</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Kartların zorluğunu derecelendirerek kendinizi test edin. Ceza puanı sistemiyle zorlandığınız kelimeleri daha sık tekrar edin.
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 text-center">Keşfet</h2>
                    <p className="text-gray-400 text-sm uppercase tracking-widest font-medium text-center">Herkese Açık Kartlar</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full mt-4 opacity-70"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    {currentCards.map((card: any) => (
                        <div key={card.id} className="w-full sm:w-[320px]">
                            <FlashcardComponent
                                card={card}
                                onInfo={localStorage.getItem('token') ? async () => {
                                    const createdDate = new Date(card.created_at || Date.now()).toLocaleDateString('tr-TR');
                                    try {
                                        const res = await api.get(`/cards/review/progress/${card.id}`);
                                        const progress = res.data;
                                        const lastReviewed = progress.last_reviewed_at ? new Date(progress.last_reviewed_at).toLocaleDateString('tr-TR') : 'Hiç tekrar edilmedi';
                                        const nextReview = new Date(progress.next_review_date).toLocaleDateString('tr-TR');
                                        alert(`Kelime: ${card.word}\nEklenme Tarihi: ${createdDate}\nSon Tekrar: ${lastReviewed}\nSonraki Tekrar: ${nextReview}`);
                                    } catch (e) {
                                        alert(`Kelime: ${card.word}\nEklenme Tarihi: ${createdDate}\nDurum: Henüz bu kartı çalışmadınız.`);
                                    }
                                } : undefined}
                            />
                        </div>
                    ))}
                    {publicCards.length === 0 && (
                        <div className="w-full py-12 text-center bg-gray-800/30 rounded-2xl border border-gray-700/50 border-dashed">
                            <p className="text-gray-500 italic text-lg">Henüz paylaşılan genel bir kart yok. İlk paylaşan sen ol!</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 mt-12 mb-8">
                    <button
                        onClick={() => {
                            setCurrentPage(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-xl bg-gray-800/80 border border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-gray-800/80 disabled:hover:text-gray-300"
                    >
                        İlk Sayfa
                    </button>
                    <div className="flex gap-1 justify-center">
                        {(() => {
                            const maxPagesToShow = 5;
                            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                            let endPage = startPage + maxPagesToShow - 1;

                            if (endPage > totalPages) {
                                endPage = totalPages;
                                startPage = Math.max(1, endPage - maxPagesToShow + 1);
                            }

                            const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

                            return pages.map(page => (
                                <button
                                    key={page}
                                    onClick={() => {
                                        setCurrentPage(page);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-xl flex items-center justify-center transition-all ${currentPage === page
                                            ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30'
                                            : 'bg-gray-800/80 border border-gray-700 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ));
                        })()}
                    </div>
                    <button
                        onClick={() => {
                            setCurrentPage(totalPages);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-xl bg-gray-800/80 border border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-gray-800/80 disabled:hover:text-gray-300"
                    >
                        Son Sayfa
                    </button>
                </div>
            )}
            </div>
        </div>
    );
};

export default Home;
