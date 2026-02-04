import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Star, Send, MessageSquareQuote } from 'lucide-react';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (data && !error) {
            setReviews(data);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase.from('reviews').insert([
                {
                    name: newReview.name,
                    rating: newReview.rating,
                    comment: newReview.comment,
                    is_approved: false // Moderation by default
                }
            ]);

            if (error) throw error;

            setSuccessMsg('Obrigada! Sua avaliação foi enviada e será exibida após moderação. ❤️');
            setNewReview({ name: '', rating: 5, comment: '' });
            setShowForm(false);
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {
            alert('Erro ao enviar avaliação: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, size = 16, interactive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={`${star <= (interactive ? newReview.rating : rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                        onClick={() => interactive && setNewReview({ ...newReview, rating: star })}
                    />
                ))}
            </div>
        );
    };

    return (
        <section id="reviews" className="py-20 bg-brand-cream/50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-base text-brand-purple font-semibold tracking-wide uppercase font-sans">Depoimentos</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-brand-brown sm:text-4xl font-serif">
                        O que as clientes dizem
                    </p>
                </div>

                {successMsg && (
                    <div className="mb-8 p-4 bg-green-100 text-green-700 rounded-lg text-center font-medium animate-bounce">
                        {successMsg}
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-purple mx-auto"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-400 font-sans italic">
                            Seja a primeira a avaliar! Clique no botão abaixo.
                        </div>
                    ) : (
                        reviews.map((item) => (
                            <div key={item.id} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-purple/5 hover:shadow-md transition-shadow relative group">
                                <MessageSquareQuote className="absolute top-4 right-6 text-brand-purple/10 group-hover:text-brand-purple/20 transition-colors" size={40} />
                                <div className="mb-4">
                                    {renderStars(item.rating)}
                                </div>
                                <p className="text-gray-600 font-sans mb-6 italic leading-relaxed">
                                    "{item.comment}"
                                </p>
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="font-bold text-brand-brown font-title">{item.name}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-16 text-center">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-brand-brown text-white font-bold py-4 px-10 rounded-full hover:bg-black transition-all shadow-lg hover:scale-105"
                        >
                            Quero avaliar minha compra
                        </button>
                    ) : (
                        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-brand-purple/10 animate-in slide-in-from-bottom-5 duration-500">
                            <h3 className="text-2xl font-serif font-bold text-brand-brown mb-6 text-center">Sua Avaliação</h3>
                            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Seu Nome</label>
                                    <input
                                        type="text"
                                        required
                                        value={newReview.name}
                                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none font-sans"
                                        placeholder="Ex: Maria Silveira"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sua nota</label>
                                    {renderStars(0, 30, true)}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Comentário</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none font-sans"
                                        placeholder="Conte o que achou da sua peça..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-brand-purple text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                    >
                                        <Send size={18} />
                                        {submitting ? 'Enviando...' : 'Enviar Avaliação'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-4 border border-gray-200 rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-20 left-10 text-brand-purple opacity-5 transform -rotate-12">
                <Star size={120} fill="currentColor" />
            </div>
            <div className="absolute bottom-20 right-10 text-brand-brown opacity-5 transform rotate-45">
                <Star size={120} fill="currentColor" />
            </div>
        </section>
    );
};

export default Reviews;
