import { useEffect, useState } from 'react';
import api from '../services/api';
import FlashcardComponent from '../components/Flashcard';
import { Loader2, CheckCircle2 } from 'lucide-react';

const Review = () => {
    const [dueCards, setDueCards] = useState<any[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Mobil/PWA'da scroll'u engeller
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    useEffect(() => {
        const fetchDueCards = async () => {
            try {
                const res = await api.get('/cards/review/due_cards');
                setDueCards(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDueCards();
    }, []);

    const handleReview = async (grade: number) => {
        const currentCard = dueCards[currentCardIndex];
        try {
            await api.post(`/cards/review/${currentCard.id}`, { grade });

            setTimeout(() => {
                setCurrentCardIndex(prev => prev + 1);
            }, 300); // Küçük bir gecikme kartın arkasını görmek için iyi olabilir
        } catch (err) {
            console.error("Failed to submit review");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-500 w-12 h-12" /></div>;
    }

    if (currentCardIndex >= dueCards.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-24 h-24 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Tebrikler!</h1>
                <p className="text-xl text-gray-400">Bugün için çalışılması gereken tüm kartları bitirdiniz.</p>
            </div>
        );
    }

    const currentCard = dueCards[currentCardIndex];

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8 px-4">
                <h1 className="text-2xl font-bold text-gray-200">Günün Tekrarı</h1>
                <div className="bg-indigo-900/50 text-indigo-300 font-medium px-4 py-1.5 rounded-full border border-indigo-700/50">
                    Kart: {currentCardIndex + 1} / {dueCards.length}
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-right-8 duration-500" key={currentCard.id}>
                <FlashcardComponent
                    card={currentCard}
                    showControls={true}
                    onReview={handleReview}
                    large={true}
                />
            </div>
        </div>
    );
};

export default Review;
