import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    Save, LogOut, Plus, Trash2, Image as ImageIcon,
    Phone, Mail, MapPin, Pencil, Instagram, Clock,
    Type, AlignLeft, Layout, Star, CheckCircle, XCircle
} from 'lucide-react';

const SETTINGS_INFO = {
    hero_title: { label: 'Título Principal', section: 'Início (Hero)', icon: Type },
    hero_subtitle: { label: 'Subtítulo', section: 'Início (Hero)', icon: AlignLeft, type: 'textarea' },
    about_title: { label: 'Título da Seção', section: 'Sobre Nós', icon: Type },
    about_text: { label: 'Texto da História', section: 'Sobre Nós', icon: AlignLeft, type: 'textarea' },
    whatsapp_number: { label: 'WhatsApp (apenas números)', section: 'Contato', icon: Phone },
    contact_email: { label: 'E-mail de Contato', section: 'Contato', icon: Mail },
    location_city: { label: 'Cidade/UF', section: 'Contato', icon: MapPin },
    instagram_url: { label: 'Link do Instagram', section: 'Contato', icon: Instagram },
    working_hours: { label: 'Horário de Funcionamento', section: 'Contato', icon: Clock },
};

const AdminPanel = () => {
    const [view, setView] = useState('login'); // login, dashboard
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Data States
    const [settings, setSettings] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
            setView('dashboard');
            fetchData();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Erro ao entrar: ' + error.message);
        } else {
            setUser(data.user);
            setView('dashboard');
            fetchData();
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setView('login');
    };

    const fetchData = async () => {
        const { data: settingsData } = await supabase.from('site_settings').select('*');
        const { data: galleryData } = await supabase.from('gallery').select('*').order('display_order');
        const { data: reviewsData } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });

        setSettings(settingsData || []);
        setGallery(galleryData || []);
        setReviews(reviewsData || []);
    };

    const updateSetting = async (id, value) => {
        const { error } = await supabase.from('site_settings').upsert({ id, value, updated_at: new Date() });
        if (error) alert('Erro ao salvar: ' + error.message);
        else fetchData();
    };

    // Gallery Actions
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [newItem, setNewItem] = useState({ title: '', category: '', imageFile: null });
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.imageFile && !newItem.title) return;
        setUploading(true);
        try {
            let imageUrl = await handleFileUpload(newItem.imageFile);
            const { error } = await supabase.from('gallery').insert([{
                title: newItem.title,
                category: newItem.category || 'Geral',
                image_url: imageUrl,
                display_order: gallery.length
            }]);
            if (error) throw error;
            setNewItem({ title: '', category: '', imageFile: null });
            setShowAddForm(false);
            fetchData();
        } catch (error) {
            alert('Erro: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = editingItem.image_url;
            if (editingItem.newImageFile) {
                imageUrl = await handleFileUpload(editingItem.newImageFile);
            }
            const { error } = await supabase.from('gallery').update({
                title: editingItem.title,
                category: editingItem.category,
                image_url: imageUrl
            }).eq('id', editingItem.id);
            if (error) throw error;
            setEditingItem(null);
            fetchData();
        } catch (error) {
            alert('Erro: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const deleteGalleryItem = async (item) => {
        if (!confirm('Excluir esta peça?')) return;
        try {
            const { error } = await supabase.from('gallery').delete().eq('id', item.id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            alert('Erro: ' + error.message);
        }
    };

    // Review Actions
    const approveReview = async (id) => {
        const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
        if (error) alert('Erro: ' + error.message);
        else fetchData();
    };

    const deleteReview = async (id) => {
        if (!confirm('Excluir avaliação?')) return;
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) alert('Erro: ' + error.message);
        else fetchData();
    };

    if (view === 'login') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
                <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-brand-purple/20 text-brand-brown">
                    <h2 className="text-3xl font-serif font-bold mb-6 text-center">Painel Admin</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded-md" placeholder="E-mail" required />
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Senha" required />
                        <button disabled={loading} type="submit" className="w-full bg-brand-purple text-white py-2 rounded-md transition-all disabled:opacity-50">
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream p-4 md:p-8 text-brand-brown">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border border-brand-purple/10">
                    <div>
                        <h1 className="text-3xl font-serif font-bold">Painel de Controle</h1>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium">
                        <LogOut size={20} /> Sair
                    </button>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left: Settings */}
                    <div className="lg:col-span-8 space-y-8">
                        {['Início (Hero)', 'Sobre Nós', 'Contato'].map(section => (
                            <section key={section} className="bg-white p-6 rounded-xl shadow-sm border border-brand-purple/10">
                                <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                    <Layout size={20} className="text-brand-purple" /> {section}
                                </h2>
                                <div className="space-y-6">
                                    {Object.entries(SETTINGS_INFO)
                                        .filter(([_, info]) => info.section === section)
                                        .map(([id, info]) => {
                                            const setting = settings.find(s => s.id === id);
                                            const Icon = info.icon;
                                            return (
                                                <div key={id}>
                                                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                                        <Icon size={14} /> {info.label}
                                                    </label>
                                                    {info.type === 'textarea' ? (
                                                        <textarea
                                                            defaultValue={setting?.value || ''}
                                                            onBlur={(e) => updateSetting(id, e.target.value)}
                                                            className="w-full p-3 border border-brand-cream bg-brand-cream/30 rounded-md min-h-[100px] outline-none"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            defaultValue={setting?.value || ''}
                                                            onBlur={(e) => updateSetting(id, e.target.value)}
                                                            className="w-full p-2 border border-brand-cream bg-brand-cream/30 rounded-md outline-none"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Right: Gallery & Reviews */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Gallery Section */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-brand-purple/10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-serif font-bold flex items-center gap-2">
                                    <ImageIcon size={20} className="text-brand-purple" /> Galeria
                                </h2>
                                <button
                                    onClick={() => { setShowAddForm(!showAddForm); setEditingItem(null); }}
                                    className={`${showAddForm ? 'bg-gray-400' : 'bg-brand-purple'} text-white p-2 rounded-full`}
                                >
                                    <Plus size={20} className={showAddForm ? 'rotate-45' : ''} />
                                </button>
                            </div>

                            {showAddForm && (
                                <form onSubmit={handleAddItem} className="mb-6 p-4 bg-brand-cream/30 rounded-lg space-y-4 border border-brand-purple/10">
                                    <h3 className="font-bold text-sm text-brand-purple uppercase tracking-wider">Nova Peça</h3>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Título</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Ursinho de Crochê"
                                            value={newItem.title}
                                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                            className="w-full p-2 border border-brand-purple/20 rounded focus:ring-1 focus:ring-brand-purple outline-none bg-white font-sans"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Categoria</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Amigurumi"
                                            value={newItem.category}
                                            onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                            className="w-full p-2 border border-brand-purple/20 rounded focus:ring-1 focus:ring-brand-purple outline-none bg-white font-sans"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Foto</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setNewItem({ ...newItem, imageFile: e.target.files[0] })}
                                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 transition-all cursor-pointer"
                                            required
                                        />
                                    </div>
                                    <button
                                        disabled={uploading}
                                        type="submit"
                                        className="w-full bg-brand-purple text-white py-3 rounded-lg font-bold hover:bg-brand-brown transition-all shadow-md disabled:opacity-50"
                                    >
                                        {uploading ? 'Enviando...' : 'Salvar na Galeria'}
                                    </button>
                                </form>
                            )}

                            {editingItem && (
                                <form onSubmit={handleUpdateItem} className="mb-6 p-4 bg-brand-purple/5 rounded-lg space-y-4 border border-brand-purple/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-sm text-brand-brown uppercase tracking-wider">Editar Peça</h3>
                                        <button type="button" onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-red-500"><XCircle size={16} /></button>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Título</label>
                                        <input
                                            type="text"
                                            value={editingItem.title}
                                            onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                                            className="w-full p-2 border border-brand-purple/20 rounded focus:ring-1 focus:ring-brand-purple outline-none bg-white font-sans"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Categoria</label>
                                        <input
                                            type="text"
                                            value={editingItem.category}
                                            onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                            className="w-full p-2 border border-brand-purple/20 rounded focus:ring-1 focus:ring-brand-purple outline-none bg-white font-sans"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Foto (deixe vazio para manter atual)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setEditingItem({ ...editingItem, newImageFile: e.target.files[0] })}
                                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-purple/10 file:text-brand-purple hover:file:bg-brand-purple/20 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={uploading}
                                            type="submit"
                                            className="flex-1 bg-brand-brown text-white py-3 rounded-lg font-bold hover:bg-black transition-all shadow-md"
                                        >
                                            {uploading ? 'Atualizando...' : 'Salvar Alterações'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {gallery.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg group">
                                        <img src={item.image_url} className="w-12 h-12 rounded object-cover" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs truncate">{item.title}</p>
                                            <p className="text-[10px] text-brand-purple uppercase">{item.category}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                            <button onClick={() => setEditingItem({ ...item })} className="p-1 text-gray-400 hover:text-brand-purple"><Pencil size={14} /></button>
                                            <button onClick={() => deleteGalleryItem(item)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews Moderation */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-brand-purple/10">
                            <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                <Star size={20} className="text-brand-purple" /> Avaliações
                            </h2>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {reviews.length === 0 ? (
                                    <p className="text-center text-gray-400 py-6 text-sm italic">Nenhuma avaliação.</p>
                                ) : (
                                    reviews.map(rev => (
                                        <div key={rev.id} className={`p-3 border rounded-lg ${!rev.is_approved ? 'bg-yellow-50 border-yellow-200' : 'bg-brand-cream/10 border-brand-purple/10'}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-xs">{rev.name}</p>
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < rev.rating ? 'currentColor' : 'none'} />)}
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    {!rev.is_approved && <button onClick={() => approveReview(rev.id)} className="text-green-600 p-1"><CheckCircle size={16} /></button>}
                                                    <button onClick={() => deleteReview(rev.id)} className="text-red-400 p-1"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-brand-brown/70 mt-1 italic">"{rev.comment}"</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
