import { useState } from 'react';
import { Volume2, Trash2, Edit2, Info } from 'lucide-react';

interface FlashcardProps {
    card: {
        id: number;
        word: string;
        example_sentence?: string;
        example_translation?: string;
        translation: string;
        image_url?: string;
    };
    onReview?: (grade: number) => void;
    onDelete?: (id: number) => void;
    onEdit?: (card: any) => void;
    onInfo?: (card: any) => void;
    showControls?: boolean;
}

const Flashcard = ({ card, onReview, onDelete, onEdit, onInfo, showControls = false }: FlashcardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const speak = (text: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Tarayıcınız Web Speech API desteklemiyor.');
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto h-[400px] perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d shadow-2xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Ön Yüz */}
                <div className="absolute inset-0 backface-hidden bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700/50 flex flex-col items-center p-6 justify-between hover:border-indigo-500/50 transition-colors">
                    {onInfo && (
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); onInfo(card); }} className="p-2 bg-gray-900/80 text-gray-200 backdrop-blur-sm border border-gray-700/80 rounded-full hover:bg-gray-700 hover:text-white transition-colors" title="İstatistikleri Gör">
                                <Info size={18} />
                            </button>
                        </div>
                    )}
                    {(onDelete || onEdit) && (
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            {onEdit && (
                                <button onClick={(e) => { e.stopPropagation(); onEdit(card); }} className="p-2 bg-blue-900/80 text-blue-300 backdrop-blur-sm border border-blue-500/40 rounded-full hover:bg-blue-500 hover:text-white transition-colors" title="Kartı Düzenle">
                                    <Edit2 size={18} />
                                </button>
                            )}
                            {onDelete && (
                                <button onClick={(e) => { e.stopPropagation(); onDelete(card.id); }} className="p-2 bg-red-900/80 text-red-300 backdrop-blur-sm border border-red-500/40 rounded-full hover:bg-red-500 hover:text-white transition-colors" title="Kartı Sil">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    )}
                    {card.image_url ? (
                        <div className="w-full h-44 rounded-xl overflow-hidden mb-4 shadow-inner relative group-hover:shadow-indigo-500/20">
                            <img src={card.image_url} alt={card.word} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                        </div>
                    ) : (
                        <div className="w-full h-44 rounded-xl bg-gray-700 mb-4 flex items-center justify-center shadow-inner">
                            <span className="text-gray-500">Görsel Yok</span>
                        </div>
                    )}
                    
                    <div className="flex flex-col items-center w-full flex-grow justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl font-black tracking-tight text-white">{card.word}</h3>
                            <button onClick={(e) => speak(card.word, e)} className="p-3 bg-indigo-500/20 text-indigo-400 rounded-full hover:bg-indigo-500 hover:text-white transition-all shadow-sm">
                                <Volume2 size={26} />
                            </button>
                        </div>
                        {card.example_sentence && (
                            <div className="flex items-start gap-2 w-full justify-center mt-2 px-2">
                                <p className="text-gray-400 text-sm italic text-center font-serif leading-relaxed text-pretty">{card.example_sentence}</p>
                                <button onClick={(e) => speak(card.example_sentence || '', e)} className="p-2 bg-gray-700/50 text-gray-400 rounded-full hover:bg-gray-600 hover:text-white transition-colors shrink-0 mt-0.5">
                                    <Volume2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 text-xs font-semibold text-gray-500 uppercase tracking-widest animate-pulse flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Çevirmek için tıkla
                    </div>
                </div>

                {/* Arka Yüz */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-indigo-500/30 flex flex-col items-center justify-center p-8">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 rounded-2xl mix-blend-overlay"></div>
                    
                    <div className="text-center z-10 w-full mb-8 mt-auto flex-grow flex flex-col justify-center items-center">
                        <div className="mb-4">
                            <p className="text-xl text-gray-500/40 font-medium mb-1 line-through decoration-gray-500/20">{card.word}</p>
                            <p className="text-4xl font-bold text-white drop-shadow-md">{card.translation}</p>
                        </div>
                        
                        {(card.example_sentence || card.example_translation) && (
                            <div className="mt-4 p-4 w-full bg-gray-800/60 rounded-xl border border-gray-700/50 shadow-inner">
                                {card.example_sentence && <p className="text-sm text-gray-500/50 italic mb-2 leading-relaxed">{card.example_sentence}</p>}
                                {card.example_translation && <p className="text-base text-gray-300 font-serif leading-relaxed text-pretty">{card.example_translation}</p>}
                            </div>
                        )}
                    </div>
                    
                    {showControls && isFlipped && (
                        <div className="w-full grid grid-cols-3 gap-3 mt-auto z-10" onClick={e => e.stopPropagation()}>
                            <button onClick={() => {onReview?.(1); setIsFlipped(false);}} className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-red-500/40">Unuttum</button>
                            <button onClick={() => {onReview?.(2); setIsFlipped(false);}} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500 hover:text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-orange-500/40">Zor</button>
                            <button onClick={() => {onReview?.(3); setIsFlipped(false);}} className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-green-500/40">Kolay</button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Flashcard;
