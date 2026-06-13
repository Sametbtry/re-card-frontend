import { useEffect, useState } from 'react';
import api from '../services/api';
import FlashcardComponent from '../components/Flashcard';
import { PlusCircle, Loader2 } from 'lucide-react';

const Library = () => {
    const [cards, setCards] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newWord, setNewWord] = useState('');
    const [newExample, setNewExample] = useState('');
    const [newTranslation, setNewTranslation] = useState('');
    const [newExampleTranslation, setNewExampleTranslation] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [editingCardId, setEditingCardId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const cardsPerPage = 8;

    const handleFetchImage = async () => {
        if (!newWord) return alert("Önce kelimeyi giriniz!");
        setImageLoading(true);
        try {
            const res = await api.get(`/cards/preview-image?word=${newWord}`);
            setNewImageUrl(res.data.image_url || '');
        } catch (e) {
            alert("Görsel bulunamadı");
        } finally {
            setImageLoading(false);
        }
    };

    const fetchCards = async () => {
        try {
            const skip = (currentPage - 1) * cardsPerPage;
            const res = await api.get(`/cards?skip=${skip}&limit=${cardsPerPage}`);
            setCards(res.data.items);
            setTotalPages(res.data.total_pages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCards();
    }, [currentPage]);

    const handleDeleteCard = async (id: number) => {
        if (window.confirm("Bu kartı silmek istediğinize emin misiniz?")) {
            try {
                await api.delete(`/cards/${id}`);
                fetchCards(); // Re-fetch the current page to ensure correct pagination
            } catch (err) {
                alert("Kart silinirken bir hata oluştu.");
            }
        }
    };

    const handleEditCard = (card: any) => {
        setEditingCardId(card.id);
        setNewWord(card.word);
        setNewExample(card.example_sentence || '');
        setNewTranslation(card.translation);
        setNewExampleTranslation(card.example_translation || '');
        setNewImageUrl(card.image_url || '');
        setIsPublic(card.is_public);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleInfo = async (card: any) => {
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
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                word: newWord,
                example_sentence: newExample,
                example_translation: newExampleTranslation,
                translation: newTranslation,
                image_url: newImageUrl,
                is_public: isPublic
            };

            if (editingCardId) {
                await api.patch(`/cards/${editingCardId}`, payload);
            } else {
                await api.post('/cards', payload);
            }

            setShowAddForm(false);
            setEditingCardId(null);
            setNewWord('');
            setNewExample('');
            setNewTranslation('');
            setNewExampleTranslation('');
            setNewImageUrl('');
            setIsPublic(false);
            setCurrentPage(1); // Reset to first page to see the new/updated card
            fetchCards();
        } catch (err) {
            alert('Kart kaydedilirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const currentCards = cards;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 shadow-lg">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Kütüphanem</h1>
                <button
                    onClick={() => {
                        if (showAddForm) {
                            setShowAddForm(false);
                            setEditingCardId(null);
                            setNewWord('');
                            setNewExample('');
                            setNewTranslation('');
                            setNewExampleTranslation('');
                            setNewImageUrl('');
                        } else {
                            setShowAddForm(true);
                        }
                    }}
                    className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30"
                >
                    <PlusCircle size={20} /> {showAddForm ? 'İptal' : 'Yeni Kart Ekle'}
                </button>
            </div>

            {showAddForm && (
                <div className="bg-gray-800/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-indigo-500/30 shadow-2xl animate-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-6 text-indigo-300">{editingCardId ? 'Kartı Düzenle' : 'Yeni Flashcard Oluştur'}</h2>
                    <form onSubmit={handleAddCard} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative">
                                <label className="block text-gray-300 mb-1 text-sm font-medium">İngilizce Kelime / Kalıp</label>
                                <div className="flex gap-2">
                                    <input type="text" className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" value={newWord} onChange={e => setNewWord(e.target.value)} required placeholder="Örn: Serendipity" />
                                    <button type="button" onClick={handleFetchImage} disabled={imageLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-lg flex items-center justify-center min-w-[100px] shadow-lg disabled:opacity-50 transition-colors shrink-0">
                                        {imageLoading ? <Loader2 className="animate-spin" size={20} /> : 'Görsel Bul'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1 text-sm font-medium">Türkçe Çeviri</label>
                                <input type="text" className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" value={newTranslation} onChange={e => setNewTranslation(e.target.value)} required placeholder="Örn: Şans eseri bulma" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-300 mb-1 text-sm font-medium">Görsel URL (İsteğe bağlı, Görsel Bul butonuna basarak otomatik doldurabilirsiniz)</label>
                                <div className="flex gap-4 items-center">
                                    <input type="text" className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="https://..." />
                                    {newImageUrl && <img src={newImageUrl} alt="Preview" className="w-32 h-32 rounded-xl object-cover border border-gray-600 shadow-md shrink-0" />}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1 text-sm font-medium">Örnek Cümle (İsteğe bağlı)</label>
                                <textarea rows={3} className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-y" value={newExample} onChange={e => setNewExample(e.target.value)} placeholder="Örn: They found each other by pure serendipity."></textarea>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-1 text-sm font-medium">Örnek Cümle Çevirisi (İsteğe bağlı)</label>
                                <textarea rows={3} className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-y" value={newExampleTranslation} onChange={e => setNewExampleTranslation(e.target.value)} placeholder="Örn: Birbirlerini tamamen şans eseri buldular."></textarea>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700 w-fit">
                            <input type="checkbox" id="public" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="w-5 h-5 accent-indigo-500 cursor-pointer" />
                            <label htmlFor="public" className="text-gray-300 text-sm cursor-pointer select-none">Herkese Açık Paylaş</label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/40 disabled:opacity-50">
                                {loading ? <><Loader2 className="animate-spin" size={18} /> Kaydediliyor...</> : (editingCardId ? 'Güncelle' : 'Oluştur')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-8">
                {currentCards.map((card: any) => (
                    <div key={card.id} className="w-full sm:w-[320px]">
                        <FlashcardComponent card={card} onDelete={handleDeleteCard} onEdit={handleEditCard} onInfo={handleInfo} />
                    </div>
                ))}
                {cards.length === 0 && !showAddForm && (
                    <div className="w-full py-16 text-center bg-gray-800/30 rounded-2xl border border-gray-700/50 border-dashed">
                        <p className="text-gray-400 text-lg">Henüz hiç kartınız yok. Hemen "Yeni Kart Ekle" butonuna tıklayarak ilk kartınızı oluşturun!</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 mt-12 mb-8">
                    <button
                        onClick={() => {
                            setCurrentPage(p => Math.max(1, p - 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-xl bg-gray-800/80 border border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-gray-800/80 disabled:hover:text-gray-300"
                    >
                        Önceki
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
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-xl bg-gray-800/80 border border-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-gray-800/80 disabled:hover:text-gray-300"
                    >
                        Sonraki
                    </button>
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
    );
};

export default Library;
