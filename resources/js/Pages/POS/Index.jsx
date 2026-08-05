import { Head } from '@inertiajs/react';
import { useState, useMemo, useCallback } from 'react';
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    Printer,
    CreditCard,
    Search,
    ChefHat,
    UtensilsCrossed,
    Coffee,
    Wine,
    IceCream,
    Tag,
    Receipt,
    X,
    Zap,
    Flame,
    Leaf,
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

// ─── Sample menu data (Sri Lankan restaurant) ────────────────────────────────
const CATEGORIES = [
    { id: 'all',        label: 'All Items',   icon: UtensilsCrossed },
    { id: 'kottu',      label: 'Kottu',       icon: Flame           },
    { id: 'rice',       label: 'Rice & Curry', icon: ChefHat        },
    { id: 'shortEats',  label: 'Short Eats',  icon: Tag            },
    { id: 'beverages',  label: 'Beverages',   icon: Coffee         },
    { id: 'drinks',     label: 'Drinks',      icon: Wine           },
    { id: 'desserts',   label: 'Desserts',    icon: IceCream       },
];

const MENU_ITEMS = [
    // Kottu
    { id: 1,  name: 'Chicken Kottu',         category: 'kottu',  price: 850,  emoji: '🍛', tags: ['spicy']       },
    { id: 2,  name: 'Egg Kottu',             category: 'kottu',  price: 700,  emoji: '🥘', tags: []              },
    { id: 3,  name: 'Fish Kottu',            category: 'kottu',  price: 950,  emoji: '🐟', tags: ['spicy']       },
    { id: 4,  name: 'Veg Kottu',             category: 'kottu',  price: 600,  emoji: '🥬', tags: ['vegan']       },
    { id: 5,  name: 'Mutton Kottu',          category: 'kottu',  price: 1200, emoji: '🍖', tags: ['spicy']       },
    { id: 6,  name: 'Cheese Kottu',          category: 'kottu',  price: 900,  emoji: '🧀', tags: []              },
    // Rice & Curry
    { id: 7,  name: 'Chicken Curry Rice',    category: 'rice',   price: 850,  emoji: '🍗', tags: ['spicy']       },
    { id: 8,  name: 'Lamprais',              category: 'rice',   price: 950,  emoji: '📦', tags: []              },
    { id: 9,  name: 'Fish Ambul Thiyal',     category: 'rice',   price: 1100, emoji: '🐠', tags: ['spicy']       },
    { id: 10, name: 'Red Rice & Curry',      category: 'rice',   price: 750,  emoji: '🍚', tags: ['spicy']       },
    { id: 11, name: 'Jaffna Crab Curry',     category: 'rice',   price: 1500, emoji: '🦀', tags: ['spicy']       },
    { id: 12, name: 'Coconut Rice',           category: 'rice',   price: 600,  emoji: '🥥', tags: []              },
    { id: 13, name: 'Prawn Curry Rice',      category: 'rice',   price: 1300, emoji: '🦐', tags: ['spicy']       },
    { id: 14, name: 'Hoppers (3 pcs)',        category: 'rice',   price: 450,  emoji: '🥞', tags: []              },
    { id: 15, name: 'String Hoppers (4 pcs)', category: 'rice',   price: 500,  emoji: '🍜', tags: []              },
    // Short Eats
    { id: 16, name: 'Roti with Curry',       category: 'shortEats', price: 350, emoji: '🫓', tags: []        },
    { id: 17, name: 'Cutlet (3 pcs)',        category: 'shortEats', price: 450, emoji: '🥟', tags: ['spicy']    },
    { id: 18, name: 'Prawn Rolls (4 pcs)',   category: 'shortEats', price: 650, emoji: '🦐', tags: []         },
    { id: 19, name: 'Fish Bankura',          category: 'shortEats', price: 550, emoji: '🐟', tags: ['spicy']    },
    { id: 20, name: 'Chicken 65',            category: 'shortEats', price: 600, emoji: '🍗', tags: ['spicy']    },
    { id: 21, name: 'Momo (6 pcs)',          category: 'shortEats', price: 750, emoji: '🥟', tags: []         },
    { id: 22, name: 'Veg Spring Roll (3 pcs)', category: 'shortEats', price: 400, emoji: '🌯', tags: ['vegan']  },
    { id: 23, name: 'Samosa (2 pcs)',        category: 'shortEats', price: 300, emoji: '🔺', tags: ['vegan']  },
    // Beverages
    { id: 24, name: 'Ceylon Tea',            category: 'beverages', price: 150, emoji: '🍵', tags: []        },
    { id: 25, name: 'Iced Tea',              category: 'beverages', price: 250, emoji: '🧊', tags: []        },
    { id: 26, name: 'Fresh Lime Soda',       category: 'beverages', price: 300, emoji: '🍋', tags: []        },
    { id: 27, name: 'Coconut Water',         category: 'beverages', price: 200, emoji: '🥥', tags: ['vegan']  },
    { id: 28, name: 'Milk Shake',            category: 'beverages', price: 450, emoji: '🥛', tags: []        },
    { id: 29, name: 'Fresh Juice',           category: 'beverages', price: 350, emoji: '🍊', tags: ['vegan']  },
    { id: 30, name: 'Espresso',              category: 'beverages', price: 280, emoji: '☕', tags: []        },
    // Drinks
    { id: 31, name: 'Coca-Cola',             category: 'drinks', price: 200,  emoji: '🥤', tags: []         },
    { id: 32, name: 'Fanta',                 category: 'drinks', price: 200,  emoji: '🍊', tags: []           },
    { id: 33, name: 'Sprite',                category: 'drinks', price: 200,  emoji: '🫧', tags: []           },
    { id: 34, name: 'Red Bull',              category: 'drinks', price: 450,  emoji: '🥫', tags: []           },
    { id: 35, name: 'Heineken',              category: 'drinks', price: 700,  emoji: '🍺', tags: []           },
    { id: 36, name: 'King Lager',            category: 'drinks', price: 550,  emoji: '🍻', tags: []           },
    // Desserts
    { id: 37, name: 'Watalappan',            category: 'desserts', price: 350, emoji: '🍮', tags: []         },
    { id: 38, name: 'Halawa',                category: 'desserts', price: 250, emoji: '🍬', tags: []         },
    { id: 39, name: 'Ice Cream (2 scoops)',  category: 'desserts', price: 400, emoji: '🍦', tags: []         },
    { id: 40, name: 'Chocolate Lava Cake',   category: 'desserts', price: 550, emoji: '🍫', tags: []         },
    { id: 41, name: 'Pineapple Torte',       category: 'desserts', price: 450, emoji: '🍍', tags: []         },
    { id: 42, name: 'Sticky Toffee Pudding', category: 'desserts', price: 500, emoji: '🍮', tags: []         },
];

const SERVICE_CHARGE_RATE = 0.10; // 10%
const TAX_RATE = 0.00;            // 0% (no VAT display for simplicity)

function formatLKR(amount) {
    return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CategoryTab({ category, isActive, onClick }) {
    const Icon = category.icon;
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                whitespace-nowrap transition-all duration-200
                ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-400/50'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600/40'
                }
            `}
        >
            <Icon size={15} />
            {category.label}
        </button>
    );
}

function MenuCard({ item, onAdd }) {
    return (
        <button
            onClick={() => onAdd(item)}
            className="
                group bg-slate-800 hover:bg-slate-750
                border border-slate-700/60 hover:border-indigo-500/60
                rounded-2xl p-4 text-left transition-all duration-200
                hover:shadow-lg hover:shadow-indigo-500/10
                active:scale-95
                flex flex-col
            "
        >
            <div className="text-3xl mb-3 leading-none group-hover:scale-110 transition-transform duration-200">
                {item.emoji}
            </div>
            <div className="flex-1">
                <p className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
                    {item.name}
                </p>
                {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag) => (
                            <span
                                key={tag}
                                className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                                    tag === 'spicy'
                                        ? 'bg-red-500/20 text-red-400'
                                        : tag === 'vegan'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-slate-600 text-slate-300'
                                }`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                <span className="text-indigo-400 font-bold text-base">
                    {formatLKR(item.price)}
                </span>
                <span className="
                    w-7 h-7 bg-indigo-600 group-hover:bg-indigo-500
                    rounded-lg flex items-center justify-center
                    transition-all duration-200
                    opacity-0 group-hover:opacity-100
                    shadow-md
                ">
                    <Plus size={14} className="text-white" />
                </span>
            </div>
        </button>
    );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="
            flex items-center gap-3 py-3
            border-b border-slate-700/40
            last:border-0
            hover:bg-slate-700/20 rounded-lg px-2 -mx-2 transition-colors
        ">
            <span className="text-2xl flex-shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium leading-tight truncate">
                    {item.name}
                </p>
                <p className="text-indigo-400 text-sm font-semibold mt-0.5">
                    {formatLKR(item.price * item.qty)}
                </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                    onClick={() => onDecrease(item.id)}
                    className="
                        w-7 h-7 bg-slate-700 hover:bg-slate-600
                        rounded-lg flex items-center justify-center
                        transition-colors
                    "
                >
                    <Minus size={12} className="text-slate-300" />
                </button>
                <span className="w-6 text-center text-white font-bold text-sm tabular-nums">
                    {item.qty}
                </span>
                <button
                    onClick={() => onIncrease(item.id)}
                    className="
                        w-7 h-7 bg-indigo-600 hover:bg-indigo-500
                        rounded-lg flex items-center justify-center
                        transition-colors
                    "
                >
                    <Plus size={12} className="text-white" />
                </button>
                <button
                    onClick={() => onRemove(item.id)}
                    className="
                        w-7 h-7 bg-red-500/20 hover:bg-red-500/40
                        rounded-lg flex items-center justify-center
                        transition-colors ml-1
                    "
                >
                    <Trash2 size={12} className="text-red-400" />
                </button>
            </div>
        </div>
    );
}

// ─── Main POS Component ────────────────────────────────────────────────────────

export default function POSIndex() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [orderType, setOrderType] = useState('dine-in');
    const [orderNote, setOrderNote] = useState('');
    const [kotPrinted, setKotPrinted] = useState(false);

    const filteredItems = useMemo(() => {
        return MENU_ITEMS.filter((item) => {
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const addToCart = useCallback((item) => {
        setKotPrinted(false);
        setCart((prev) => {
            const existing = prev.find((c) => c.id === item.id);
            if (existing) {
                return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
            }
            return [...prev, { ...item, qty: 1 }];
        });
    }, []);

    const increaseQty = useCallback((id) => {
        setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: c.qty + 1 } : c));
    }, []);

    const decreaseQty = useCallback((id) => {
        setCart((prev) => {
            const item = prev.find((c) => c.id === id);
            if (item.qty <= 1) return prev.filter((c) => c.id !== id);
            return prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c);
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCart((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
        setTableNumber('');
        setOrderNote('');
        setKotPrinted(false);
    }, []);

    const subtotal = useMemo(() => cart.reduce((sum, c) => sum + c.price * c.qty, 0), [cart]);
    const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
    const grandTotal = subtotal + serviceCharge;
    const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);

    const handlePrintKOT = () => {
        if (cart.length === 0) return;
        setKotPrinted(true);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        clearCart();
    };

    return (
        <POSLayout>
            <Head title="POS Billing" />

            <div className="flex h-full overflow-hidden">
                {/* ── LEFT: Menu Panel ──────────────────────────────────── */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Header */}
                    <header className="px-6 py-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between gap-4 flex-shrink-0 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <UtensilsCrossed size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white leading-none">POS Billing</h1>
                                <p className="text-slate-400 text-xs mt-0.5">New Order</p>
                            </div>
                        </div>

                        {/* Order type toggle */}
                        <div className="flex bg-slate-700/60 rounded-xl p-0.5 border border-slate-600/40">
                            {['dine-in', 'takeaway'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setOrderType(type)}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                                        ${orderType === type
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                        }
                                    `}
                                >
                                    {type === 'dine-in' ? 'Dine In' : 'Take Away'}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative max-w-xs w-full">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="
                                    w-full bg-slate-700/60 border border-slate-600/60
                                    rounded-xl pl-9 pr-4 py-2.5 text-sm text-white
                                    placeholder-slate-400
                                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
                                    transition-colors
                                "
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Table input */}
                        {orderType === 'dine-in' && (
                            <div className="flex items-center gap-2">
                                <label className="text-slate-400 text-sm whitespace-nowrap">Table</label>
                                <input
                                    type="text"
                                    placeholder="e.g. T4"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    className="
                                        w-20 bg-slate-700/60 border border-slate-600/60
                                        rounded-xl px-3 py-2.5 text-sm text-white
                                        placeholder-slate-500
                                        focus:outline-none focus:border-indigo-500
                                        transition-colors text-center font-semibold
                                    "
                                />
                            </div>
                        )}
                    </header>

                    {/* Category Tabs */}
                    <div className="px-6 py-3 bg-slate-800/40 border-b border-slate-700/40 flex-shrink-0">
                        <div className="flex gap-2 overflow-x-auto pb-0.5">
                            {CATEGORIES.map((cat) => (
                                <CategoryTab
                                    key={cat.id}
                                    category={cat}
                                    isActive={activeCategory === cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Menu Grid */}
                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        {filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                                <Search size={40} strokeWidth={1.5} />
                                <p className="text-lg font-medium">No items found</p>
                                <p className="text-sm">Try a different category or search term</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {filteredItems.map((item) => (
                                    <MenuCard key={item.id} item={item} onAdd={addToCart} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: Cart Sidebar ───────────────────────────────── */}
                <aside className="
                    w-96 flex flex-col bg-slate-800
                    border-l border-slate-700/60
                    flex-shrink-0
                ">
                    {/* Cart Header */}
                    <div className="px-5 py-4 border-b border-slate-700/60 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                                <ShoppingCart size={16} className="text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-sm">Current Order</h2>
                                <p className="text-slate-500 text-xs">
                                    {orderType === 'dine-in'
                                        ? (tableNumber ? `Table ${tableNumber}` : 'No table set')
                                        : 'Take Away'
                                    }
                                </p>
                            </div>
                            {totalItems > 0 && (
                                <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="
                                    text-slate-500 hover:text-red-400
                                    transition-colors flex items-center gap-1 text-xs
                                    px-2 py-1 rounded-lg hover:bg-red-500/10
                                "
                            >
                                <Trash2 size={13} />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-5">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 py-16">
                                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center">
                                    <ShoppingCart size={32} strokeWidth={1.5} />
                                </div>
                                <p className="text-sm font-medium">Cart is empty</p>
                                <p className="text-xs text-center text-slate-500">
                                    Tap items from the menu to add them
                                </p>
                            </div>
                        ) : (
                            <div className="py-2">
                                {cart.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onIncrease={increaseQty}
                                        onDecrease={decreaseQty}
                                        onRemove={removeFromCart}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Note */}
                    {cart.length > 0 && (
                        <div className="px-5 pt-2 pb-3 border-t border-slate-700/40">
                            <textarea
                                placeholder="Order note (allergies, preferences...)"
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                rows={2}
                                className="
                                    w-full bg-slate-700/50 border border-slate-600/50
                                    rounded-xl px-3 py-2 text-xs text-white
                                    placeholder-slate-500
                                    focus:outline-none focus:border-indigo-500
                                    resize-none transition-colors
                                "
                            />
                        </div>
                    )}

                    {/* Totals */}
                    <div className="px-5 pt-3 pb-2 border-t border-slate-700/60 space-y-2 flex-shrink-0">
                        <div className="flex justify-between text-sm text-slate-400">
                            <span>Subtotal</span>
                            <span className="text-white tabular-nums">{formatLKR(subtotal)}</span>
                        </div>
                        {serviceCharge > 0 && (
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>Service Charge (10%)</span>
                                <span className="text-white tabular-nums">{formatLKR(serviceCharge)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-700/60">
                            <span className="text-white">Grand Total</span>
                            <span className="text-indigo-400 text-lg tabular-nums">{formatLKR(grandTotal)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-5 pb-5 pt-3 space-y-2.5 flex-shrink-0">
                        <button
                            onClick={handlePrintKOT}
                            disabled={cart.length === 0}
                            className={`
                                w-full flex items-center justify-center gap-2.5 py-3
                                rounded-xl font-semibold text-sm
                                transition-all duration-200
                                ${cart.length === 0
                                    ? 'bg-slate-700/40 text-slate-500 cursor-not-allowed'
                                    : kotPrinted
                                    ? 'bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/30'
                                    : 'bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25 active:scale-[.98]'
                                }
                            `}
                        >
                            <Printer size={16} />
                            {kotPrinted ? 'KOT Sent ✓' : 'Print KOT'}
                        </button>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className={`
                                w-full flex items-center justify-center gap-2.5 py-3.5
                                rounded-xl font-bold text-sm
                                transition-all duration-200
                                ${cart.length === 0
                                    ? 'bg-slate-700/40 text-slate-500 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 active:scale-[.98]'
                                }
                            `}
                        >
                            <CreditCard size={16} />
                            Checkout — {formatLKR(grandTotal)}
                        </button>
                    </div>
                </aside>
            </div>
        </POSLayout>
    );
}
