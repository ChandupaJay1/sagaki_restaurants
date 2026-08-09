import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    Utensils,
    Plus,
    Search,
    Edit2,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Layers,
    Image,
    DollarSign,
    Check,
    X,
    Filter,
    PlusCircle,
    Info,
    ChevronRight
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

// Mock Data
const INITIAL_CATEGORIES = [
    { id: 1, name: 'Mains', subcategories: ['Rice', 'Kottu', 'Noodles', 'Curry'] },
    { id: 2, name: 'Starters', subcategories: ['Soups', 'Bites', 'Salads'] },
    { id: 3, name: 'Desserts', subcategories: ['Puddings', 'Ice Cream', 'Traditional'] },
    { id: 4, name: 'Beverages', subcategories: ['Hot Drinks', 'Fresh Juice', 'Soft Drinks'] },
];

const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: 'Chicken Kottu',
        category: 'Mains',
        subcategory: 'Kottu',
        image: '🍛',
        prices: { dineIn: 850, takeaway: 800, delivery: 900 },
        isCombo: false,
        addons: ['Extra Cheese', 'Egg Roasty'],
        available: true,
        description: 'Traditional Sri Lankan shredded flatbread with chicken, egg, and fresh veggies.'
    },
    {
        id: 2,
        name: 'Lamprais Special',
        category: 'Mains',
        subcategory: 'Rice',
        image: '📦',
        prices: { dineIn: 1100, takeaway: 1050, delivery: 1150 },
        isCombo: true,
        addons: ['Extra Cutlet', 'Seeni Sambol'],
        available: true,
        description: 'Rice boiled in stock, accompanied by frikadeller meatballs, mixed meat curry, blachan, and eggplant.'
    },
    {
        id: 3,
        name: 'Fish Ambul Thiyal Curry',
        category: 'Mains',
        subcategory: 'Curry',
        image: '🐠',
        prices: { dineIn: 950, takeaway: 900, delivery: 1000 },
        isCombo: false,
        addons: ['White Rice Portion'],
        available: true,
        description: 'Sour fish curry marinated in a blend of spices including dried garcinia (goraka).'
    },
    {
        id: 4,
        name: 'Egg Hopper Combo (3 pcs)',
        category: 'Mains',
        subcategory: 'Kottu',
        image: '🥞',
        prices: { dineIn: 450, takeaway: 420, delivery: 480 },
        isCombo: true,
        addons: ['Lunu Miris', 'Extra Egg'],
        available: true,
        description: 'Three crispy hoppers, including one egg hopper, served with spicy onion sambol.'
    },
    {
        id: 5,
        name: 'Hot Butter Cuttlefish',
        category: 'Starters',
        subcategory: 'Bites',
        image: '🦑',
        prices: { dineIn: 1200, takeaway: 1150, delivery: 1250 },
        isCombo: false,
        addons: ['Lime Wedges'],
        available: false,
        description: 'Crispy cuttlefish tossed in butter, spring onion, and dried red chillies.'
    },
    {
        id: 6,
        name: 'Watalappan Delight',
        category: 'Desserts',
        subcategory: 'Traditional',
        image: '🍮',
        prices: { dineIn: 450, takeaway: 400, delivery: 450 },
        isCombo: false,
        addons: ['Cashew Topping'],
        available: true,
        description: 'Steamed coconut custard made with kitul jaggery, eggs, and spices like cardamom.'
    },
    {
        id: 7,
        name: 'Fresh Woodapple Juice',
        category: 'Beverages',
        subcategory: 'Fresh Juice',
        image: '🥤',
        prices: { dineIn: 380, takeaway: 350, delivery: 380 },
        isCombo: false,
        addons: ['Vanilla Ice Cream Scoop'],
        available: true,
        description: 'Refreshing blended woodapple pulp with coconut milk and sugar syrup.'
    }
];

export default function MenuManagement() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSubcategory, setSelectedSubcategory] = useState('All');
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);

    // Modal States
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    // Form States
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [selectedCatForSub, setSelectedCatForSub] = useState(INITIAL_CATEGORIES[0]?.id || '');

    const [productForm, setProductForm] = useState({
        name: '',
        category: INITIAL_CATEGORIES[0]?.name || '',
        subcategory: INITIAL_CATEGORIES[0]?.subcategories[0] || '',
        image: '🍔',
        prices: { dineIn: '', takeaway: '', delivery: '' },
        isCombo: false,
        addons: '',
        available: true,
        description: ''
    });

    const triggerToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // Filter subcategories list based on selected category in form
    const formSubcategories = useMemo(() => {
        const cat = categories.find(c => c.name === productForm.category);
        return cat ? cat.subcategories : [];
    }, [productForm.category, categories]);

    const activeSubcategories = useMemo(() => {
        if (selectedCategory === 'All') return [];
        const cat = categories.find(c => c.name === selectedCategory);
        return cat ? cat.subcategories : [];
    }, [selectedCategory, categories]);

    // Filtered Products
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                                (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
            const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
            const matchSubcategory = selectedSubcategory === 'All' || p.subcategory === selectedSubcategory;
            return matchSearch && matchCategory && matchSubcategory;
        });
    }, [products, search, selectedCategory, selectedSubcategory]);

    // Handlers
    const toggleAvailability = (id) => {
        setProducts(prev => prev.map(p => {
            if (p.id === id) {
                const nextState = !p.available;
                triggerToast(`"${p.name}" is now ${nextState ? 'Available' : 'Unavailable'}`);
                return { ...p, available: nextState };
            }
            return p;
        }));
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();
        if (!productForm.name || !productForm.prices.dineIn) {
            triggerToast('Please fill out the product name and base prices');
            return;
        }

        const addonArray = productForm.addons
            ? productForm.addons.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        if (editingProduct) {
            // Edit
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
                ...p,
                name: productForm.name,
                category: productForm.category,
                subcategory: productForm.subcategory,
                prices: {
                    dineIn: Number(productForm.prices.dineIn),
                    takeaway: Number(productForm.prices.takeaway || productForm.prices.dineIn),
                    delivery: Number(productForm.prices.delivery || productForm.prices.dineIn)
                },
                isCombo: productForm.isCombo,
                addons: addonArray,
                available: productForm.available,
                description: productForm.description
            } : p));
            triggerToast(`Updated menu item: ${productForm.name}`);
        } else {
            // Add
            const newProduct = {
                id: products.length + 1,
                name: productForm.name,
                category: productForm.category,
                subcategory: productForm.subcategory,
                image: productForm.image || '🍔',
                prices: {
                    dineIn: Number(productForm.prices.dineIn),
                    takeaway: Number(productForm.prices.takeaway || productForm.prices.dineIn),
                    delivery: Number(productForm.prices.delivery || productForm.prices.dineIn)
                },
                isCombo: productForm.isCombo,
                addons: addonArray,
                available: productForm.available,
                description: productForm.description
            };
            setProducts(prev => [...prev, newProduct]);
            triggerToast(`Added new menu item: ${productForm.name}`);
        }

        setShowProductModal(false);
        setEditingProduct(null);
    };

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCategoryName) return;
        if (categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
            triggerToast('Category already exists');
            return;
        }
        const newCat = {
            id: categories.length + 1,
            name: newCategoryName,
            subcategories: []
        };
        setCategories(prev => [...prev, newCat]);
        setNewCategoryName('');
        triggerToast(`Category "${newCategoryName}" created`);
    };

    const handleAddSubcategory = (e) => {
        e.preventDefault();
        if (!newSubcategoryName) return;
        setCategories(prev => prev.map(c => {
            if (c.id === Number(selectedCatForSub)) {
                if (c.subcategories.includes(newSubcategoryName)) {
                    triggerToast('Subcategory already exists under this category');
                    return c;
                }
                triggerToast(`Subcategory "${newSubcategoryName}" added to ${c.name}`);
                return { ...c, subcategories: [...c.subcategories, newSubcategoryName] };
            }
            return c;
        }));
        setNewSubcategoryName('');
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            category: product.category,
            subcategory: product.subcategory,
            image: product.image,
            prices: {
                dineIn: product.prices.dineIn.toString(),
                takeaway: product.prices.takeaway.toString(),
                delivery: product.prices.delivery.toString()
            },
            isCombo: product.isCombo,
            addons: product.addons.join(', '),
            available: product.available,
            description: product.description || ''
        });
        setShowProductModal(true);
    };

    const handleDeleteProduct = (id, name) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            setProducts(prev => prev.filter(p => p.id !== id));
            triggerToast(`Deleted ${name}`);
        }
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setProductForm({
            name: '',
            category: categories[0]?.name || '',
            subcategory: categories[0]?.subcategories[0] || '',
            image: '🍛',
            prices: { dineIn: '', takeaway: '', delivery: '' },
            isCombo: false,
            addons: '',
            available: true,
            description: ''
        });
        setShowProductModal(true);
    };

    return (
        <POSLayout>
            <Head title="Menu Management" />
            <div className="flex flex-col h-full relative transition-colors duration-300">
                {/* Background glow */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -right-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>

                {/* Header */}
                <header className="relative z-10 px-6 py-4 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                            <Utensils size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight text-slate-900 dark:text-white">Menu Management</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Configure catalog categories, pricing tiers, availability, and combos</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowCategoryModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all shadow-sm"
                        >
                            <Layers size={14} /> Categories
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            <Plus size={14} /> Add Item
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Controls Bar */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xl shadow-black/5 dark:shadow-black/20">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search menu items..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Category filter pills */}
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                onClick={() => { setSelectedCategory('All'); setSelectedSubcategory('All'); }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                    selectedCategory === 'All'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                All Categories
                            </button>
                            {categories.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => { setSelectedCategory(c.name); setSelectedSubcategory('All'); }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                        selectedCategory === c.name
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subcategories pills if a category is selected */}
                    {selectedCategory !== 'All' && activeSubcategories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/40">
                            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
                                <Filter size={10} /> Sub:
                            </span>
                            <button
                                onClick={() => setSelectedSubcategory('All')}
                                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                                    selectedSubcategory === 'All'
                                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                All
                            </button>
                            {activeSubcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => setSelectedSubcategory(sub)}
                                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                                        selectedSubcategory === sub
                                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredProducts.map(p => (
                            <div
                                key={p.id}
                                className={`group relative rounded-2xl bg-white dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 p-5 ${
                                    !p.available ? 'opacity-70 border-dashed dark:border-slate-800' : ''
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon / Image representation */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 transition-colors duration-200`}>
                                        {p.image}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                {p.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5">
                                                {p.isCombo && (
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
                                                        COMBO
                                                    </span>
                                                )}
                                                {p.addons.length > 0 && (
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 whitespace-nowrap" title={p.addons.join(', ')}>
                                                        +{p.addons.length} Addons
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                                            {p.description}
                                        </p>

                                        {/* Category tags */}
                                        <div className="flex items-center gap-1.5 mb-4">
                                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40">
                                                {p.category}
                                            </span>
                                            <ChevronRight size={10} className="text-slate-400" />
                                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40">
                                                {p.subcategory}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Multi price tiers */}
                                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3.5 mt-2.5 grid grid-cols-3 gap-2 text-center">
                                    {[
                                        { label: 'Dine-In', val: p.prices.dineIn },
                                        { label: 'Takeaway', val: p.prices.takeaway },
                                        { label: 'Delivery', val: p.prices.delivery }
                                    ].map(tier => (
                                        <div key={tier.label} className="bg-slate-50 dark:bg-slate-950/30 rounded-xl p-1.5 border border-slate-100 dark:border-slate-800/30">
                                            <p className="text-[9px] uppercase font-semibold text-slate-400">{tier.label}</p>
                                            <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 tabular-nums">LKR {tier.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Availability Toggle & Actions */}
                                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3.5 mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleAvailability(p.id)}
                                            className="text-slate-400 hover:text-indigo-500 transition-colors"
                                            aria-label="Toggle item status"
                                        >
                                            {p.available ? (
                                                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                                                    <ToggleRight size={22} className="text-emerald-400" />
                                                    <span>Active</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                    <ToggleLeft size={22} className="text-slate-500" />
                                                    <span>Inactive</span>
                                                </div>
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handleEditClick(p)}
                                            className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 rounded-lg transition-colors border border-indigo-500/10"
                                            title="Edit Item"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(p.id, p.name)}
                                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-lg transition-colors border border-red-500/10"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toast Notification */}
                {toast && (
                    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-2 animate-bounce">
                        <Info size={16} className="text-indigo-400" />
                        <span className="text-xs font-semibold">{toast}</span>
                    </div>
                )}

                {/* MODAL: Add / Edit Product */}
                {showProductModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
                        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-850 dark:text-white font-bold text-base">{editingProduct ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                                <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Item Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={productForm.name}
                                            onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Icon/Emoji Representation</label>
                                        <input
                                            type="text"
                                            maxLength={2}
                                            placeholder="e.g. 🍔"
                                            value={productForm.image}
                                            onChange={e => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-center text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Category</label>
                                        <select
                                            value={productForm.category}
                                            onChange={e => {
                                                const newCatName = e.target.value;
                                                const cat = categories.find(c => c.name === newCatName);
                                                setProductForm(prev => ({
                                                    ...prev,
                                                    category: newCatName,
                                                    subcategory: cat?.subcategories[0] || ''
                                                }));
                                            }}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                        >
                                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Sub-Category</label>
                                        <select
                                            value={productForm.subcategory}
                                            onChange={e => setProductForm(prev => ({ ...prev, subcategory: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                        >
                                            {formSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Prices (LKR)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <span className="text-[9px] text-slate-500 block mb-0.5">Dine-In</span>
                                            <input
                                                type="number"
                                                required
                                                placeholder="850"
                                                value={productForm.prices.dineIn}
                                                onChange={e => setProductForm(prev => ({ ...prev, prices: { ...prev.prices, dineIn: e.target.value } }))}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-slate-500 block mb-0.5">Takeaway</span>
                                            <input
                                                type="number"
                                                placeholder="800"
                                                value={productForm.prices.takeaway}
                                                onChange={e => setProductForm(prev => ({ ...prev, prices: { ...prev.prices, takeaway: e.target.value } }))}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-slate-500 block mb-0.5">Delivery</span>
                                            <input
                                                type="number"
                                                placeholder="900"
                                                value={productForm.prices.delivery}
                                                onChange={e => setProductForm(prev => ({ ...prev, prices: { ...prev.prices, delivery: e.target.value } }))}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-850 dark:text-white font-semibold">Combo Meal Configuration</span>
                                            <span className="text-[10px] text-slate-500">Includes multiple pre-packaged items</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={productForm.isCombo}
                                            onChange={e => setProductForm(prev => ({ ...prev, isCombo: e.target.checked }))}
                                            className="w-4 h-4 rounded border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Add-ons (Comma-separated)</label>
                                    <input
                                        type="text"
                                        placeholder="Extra Cheese, Chili Paste, Fried Egg"
                                        value={productForm.addons}
                                        onChange={e => setProductForm(prev => ({ ...prev, addons: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Item Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Short description of ingredients or size..."
                                        value={productForm.description}
                                        onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="available-form"
                                            checked={productForm.available}
                                            onChange={e => setProductForm(prev => ({ ...prev, available: e.target.checked }))}
                                            className="w-4 h-4 rounded border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                                        />
                                        <label htmlFor="available-form" className="text-xs text-slate-500 dark:text-slate-300 font-medium select-none">Available for Sale immediately</label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/10"
                                    >
                                        {editingProduct ? 'Save Changes' : 'Create Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Categories Configuration */}
                {showCategoryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)} />
                        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-805 dark:text-white font-bold text-base">Category & Subcategory Settings</h2>
                                <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>

                            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                                {/* Create Category */}
                                <form onSubmit={handleAddCategory} className="space-y-2">
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Create New Category</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Appetizers"
                                            value={newCategoryName}
                                            onChange={e => setNewCategoryName(e.target.value)}
                                            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>

                                <hr className="border-slate-200 dark:border-slate-800" />

                                {/* Create Subcategory */}
                                <form onSubmit={handleAddSubcategory} className="space-y-3">
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Add Subcategory to Category</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="text-[9px] text-slate-500 block mb-0.5">Parent Category</span>
                                            <select
                                                value={selectedCatForSub}
                                                onChange={e => setSelectedCatForSub(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                            >
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-slate-500 block mb-0.5">Subcategory Name</span>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Cold Soups"
                                                value={newSubcategoryName}
                                                onChange={e => setNewSubcategoryName(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-semibold rounded-xl transition-colors"
                                    >
                                        Add Subcategory
                                    </button>
                                </form>

                                <hr className="border-slate-200 dark:border-slate-800" />

                                {/* Existing hierarchy view */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Existing Categories & Subcategories</label>
                                    <div className="space-y-2.5">
                                        {categories.map(c => (
                                            <div key={c.id} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs text-slate-850 dark:text-white font-bold">{c.name}</span>
                                                    <span className="text-[10px] text-slate-500">{c.subcategories.length} subcategories</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {c.subcategories.map(sub => (
                                                        <span key={sub} className="text-[9px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                                                            {sub}
                                                        </span>
                                                    ))}
                                                    {c.subcategories.length === 0 && (
                                                        <span className="text-[9px] text-slate-500 italic">No subcategories yet</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </POSLayout>
    );
}
