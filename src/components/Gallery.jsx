import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Todas');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('display_order', { ascending: true });

            if (data && !error) {
                setItems(data);
            }
            setLoading(false);
        };
        fetchGallery();
    }, []);

    const categories = ['Todas', ...new Set(items.map(item => item.category))];

    const filteredItems = activeCategory === 'Todas'
        ? items
        : items.filter(item => item.category === activeCategory);

    const defaultColors = ['bg-brand-sage/20', 'bg-brand-purple/20', 'bg-brand-brown/20'];

    return (
        <div id="gallery" className="bg-brand-cream py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-brand-brown sm:text-4xl font-serif">
                        Nossa Galeria
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto font-sans">
                        Um pouco do nosso trabalho e das peças que já encantaram nossos clientes.
                    </p>

                    {/* Filter Buttons */}
                    {!loading && items.length > 0 && (
                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 font-sans text-sm ${activeCategory === cat
                                        ? 'bg-brand-purple text-white shadow-md'
                                        : 'bg-white text-brand-brown hover:bg-brand-purple/10'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-sans">
                        Nenhuma peça encontrada nesta categoria.
                    </div>
                ) : (
                    <div className="relative group/gallery">
                        {/* Navigation Arrows */}
                        <button
                            onClick={() => {
                                const container = document.getElementById('gallery-container');
                                container.scrollBy({ left: -400, behavior: 'smooth' });
                            }}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-3 rounded-full shadow-xl text-brand-purple hover:bg-brand-purple hover:text-white transition-all opacity-0 group-hover/gallery:opacity-100 hidden md:block"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <button
                            onClick={() => {
                                const container = document.getElementById('gallery-container');
                                container.scrollBy({ left: 400, behavior: 'smooth' });
                            }}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-3 rounded-full shadow-xl text-brand-purple hover:bg-brand-purple hover:text-white transition-all opacity-0 group-hover/gallery:opacity-100 hidden md:block"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Carousel Container */}
                        <div
                            id="gallery-container"
                            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {filteredItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="min-w-full sm:min-w-[300px] md:min-w-[350px] snap-center group relative cursor-pointer"
                                    onClick={() => setSelectedImage(item)}
                                >
                                    <div className={`w-full h-[450px] ${defaultColors[index % defaultColors.length]} rounded-2xl overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500`}>
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                            <h3 className="text-2xl text-white font-serif font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title}</h3>
                                            <p className="text-brand-cream/80 text-sm uppercase tracking-widest font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.category}</p>
                                        </div>
                                    </div>

                                    {/* Mobile info (always visible) */}
                                    <div className="mt-4 md:hidden px-2">
                                        <h3 className="text-lg text-brand-brown font-medium font-serif">{item.title}</h3>
                                        <p className="text-[10px] text-brand-purple font-bold uppercase tracking-widest">{item.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal/Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-brown/95 backdrop-blur-sm transition-all overflow-y-auto"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="fixed top-6 right-6 text-white hover:text-brand-purple transition-colors p-2 z-[60] bg-brand-brown/50 rounded-full"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>

                    <div
                        className="max-w-4xl w-full my-auto flex flex-col items-center py-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full flex flex-col items-center">
                            <img
                                src={selectedImage.image_url}
                                alt={selectedImage.title}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border-4 border-white/10"
                            />

                            <div className="mt-8 text-center text-white w-full px-4">
                                <h3 className="text-3xl font-serif font-bold mb-2">{selectedImage.title}</h3>
                                <p className="text-brand-cream/70 font-sans uppercase tracking-widest text-sm mb-8">{selectedImage.category}</p>

                                <a
                                    href={`https://wa.me/5581998910873?text=Olá! Vi esse item na galeria e gostaria de saber mais sobre o ${selectedImage.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.4)] text-lg"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    Fazer orçamento no WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
