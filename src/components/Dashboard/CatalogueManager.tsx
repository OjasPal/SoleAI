import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Sparkles, 
  Upload, 
  Download, 
  Check, 
  AlertCircle,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import { FootwearItem, FootwearCategory } from '../../types';

interface CatalogueManagerProps {
  shoes: FootwearItem[];
  onUpdateStock: (shoeId: string, sizeUK: number, newStock: number) => Promise<void>;
  onUpdateShoe: (shoeId: string, data: Partial<FootwearItem>) => Promise<void>;
}

export const CatalogueManager: React.FC<CatalogueManagerProps> = ({
  shoes,
  onUpdateStock,
  onUpdateShoe,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'All Silhouettes', value: 'all' },
    { label: 'Sneakers', value: 'sneakers' },
    { label: 'Loafers', value: 'loafers' },
    { label: 'Boots', value: 'boots' },
    { label: 'Slides', value: 'slides' },
    { label: 'Formals', value: 'formals' },
  ];

  const filteredShoes = shoes.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.colorway.toLowerCase().includes(search.toLowerCase()) ||
                          s.material.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStockChange = async (shoeId: string, sizeUK: number, currentStock: number, delta: number) => {
    const updated = Math.max(0, currentStock + delta);
    await onUpdateStock(shoeId, sizeUK, updated);
  };

  const simulateShopifySync = () => {
    setSyncStatus('Syncing with Shopify & WhatsApp catalogue...');
    setTimeout(() => {
      setSyncStatus('✅ 8 silhouettes & 48 SKU sizes synced successfully!');
      setTimeout(() => setSyncStatus(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white font-heading">Footwear Catalogue & Real-Time Stock</h2>
          <p className="text-xs text-stone-400">
            SoleAI reads this structured stock live to tell customers exact size availability and advise on fit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {syncStatus && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-950/80 px-2.5 py-1.5 rounded-lg border border-emerald-800 animate-pulse">
              {syncStatus}
            </span>
          )}
          <button
            onClick={simulateShopifySync}
            className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" /> Sync Shopify / CSV
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by silhouette, material, color..."
            className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Shoes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredShoes.map(shoe => {
          const totalStock = shoe.sizes.reduce((acc, s) => acc + s.stock, 0);

          return (
            <div
              key={shoe.id}
              className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-sm hover:border-stone-700 transition-all flex flex-col justify-between"
            >
              {/* Top Details */}
              <div className="p-4 flex gap-4">
                <img
                  src={shoe.imageUrl}
                  alt={shoe.name}
                  className="w-28 h-28 object-cover rounded-xl border border-stone-800 flex-shrink-0"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {shoe.category}
                      </span>
                      <h3 className="text-base font-bold text-white font-heading mt-1 line-clamp-1">
                        {shoe.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-white">₹{shoe.priceINR}</div>
                      {shoe.originalPriceINR && (
                        <div className="text-[11px] text-stone-500 line-through">₹{shoe.originalPriceINR}</div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 line-clamp-2">{shoe.tagline}</p>
                  <p className="text-[11px] text-stone-500">Colorway: <span className="text-stone-300">{shoe.colorway}</span></p>
                </div>
              </div>

              {/* Fit Guidance & Sizing Rules (SoleAI intelligence context) */}
              <div className="px-4 py-2.5 bg-stone-950/60 border-t border-b border-stone-800/80 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-stone-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-[11px] line-clamp-1 italic">
                    <strong className="text-amber-400 not-italic">Fit rule:</strong> {shoe.fitGuidance}
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded whitespace-nowrap ${
                  shoe.sizeRecommendation === 'size_up'
                    ? 'bg-orange-950 text-orange-400 border border-orange-800'
                    : shoe.sizeRecommendation === 'size_down'
                    ? 'bg-blue-950 text-blue-400 border border-blue-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {shoe.sizeRecommendation.replace('_', ' ')}
                </span>
              </div>

              {/* Size & Stock Controls (UK 6 to 11) */}
              <div className="p-4 bg-stone-900/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-300">Size Breakdown (India / UK)</span>
                  <span className="text-xs text-stone-500">Total: <strong className="text-white">{totalStock} pairs</strong></span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {shoe.sizes.map(sizeObj => {
                    const isSoldOut = sizeObj.stock === 0;

                    return (
                      <div
                        key={sizeObj.sizeUK}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                          isSoldOut
                            ? 'bg-stone-950/80 border-red-900/40 text-red-400'
                            : 'bg-stone-950 border-stone-800 text-stone-200'
                        }`}
                      >
                        <span className="text-[10px] font-bold font-mono">UK {sizeObj.sizeUK}</span>
                        <span className={`text-xs font-extrabold my-1 ${isSoldOut ? 'text-red-400' : 'text-amber-400'}`}>
                          {isSoldOut ? 'OUT' : sizeObj.stock}
                        </span>

                        <div className="flex items-center gap-1 w-full justify-center">
                          <button
                            onClick={() => handleStockChange(shoe.id, sizeObj.sizeUK, sizeObj.stock, -1)}
                            disabled={sizeObj.stock === 0}
                            className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-300"
                            title="Decrease stock"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={() => handleStockChange(shoe.id, sizeObj.sizeUK, sizeObj.stock, 1)}
                            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300"
                            title="Increase stock"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
