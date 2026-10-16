import React, { useState } from 'react';
import { FootwearItem } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { Panel } from '../ui/Panel';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { StatusDot } from '../ui/StatusDot';
import { Input } from '../ui/Input';
import { StockEditSheet } from './StockEditSheet';
import { formatINR } from '../../lib/format';
import { Search } from 'lucide-react';

export interface CatalogueSectionProps {
  shoes: FootwearItem[];
  onUpdateStock: (shoeId: string, sizeUK: number, newStock: number) => Promise<void>;
  onUpdateShoe: (shoeId: string, data: Partial<FootwearItem>) => Promise<void>;
}

export const CatalogueSection: React.FC<CatalogueSectionProps> = ({
  shoes,
  onUpdateStock,
  onUpdateShoe,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingShoe, setEditingShoe] = useState<FootwearItem | null>(null);

  const categories = ['all', 'sneakers', 'loafers', 'boots', 'slides', 'formals'] as const;

  const filteredShoes = shoes.filter(s => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.colorway.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        primaryTitle="Catalogue & Stock."
        secondaryTitle={`${shoes.length} live footwear silhouettes.`}
        description="Structured inventory and sizing guidelines used by SoleAI for instant stock queries."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`h-8 px-3.5 rounded-pill text-small font-medium transition-colors cursor-pointer capitalize ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold'
                  : 'bg-bg-raised text-text-2 hover:text-text border border-line'
              }`}
            >
              {cat === 'all' ? 'All Silhouettes' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search silhouette or colorway..."
            className="pl-9"
          />
          <Search className="w-3.5 h-3.5 text-text-3 absolute left-3 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Dense Table */}
      <Panel className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Silhouette</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Fit Guidance</TableHead>
              <TableHead className="text-center font-mono">UK 6</TableHead>
              <TableHead className="text-center font-mono">UK 7</TableHead>
              <TableHead className="text-center font-mono">UK 8</TableHead>
              <TableHead className="text-center font-mono">UK 9</TableHead>
              <TableHead className="text-center font-mono">UK 10</TableHead>
              <TableHead className="text-center font-mono">UK 11</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredShoes.map(shoe => {
              const totalStock = shoe.sizes.reduce((acc, s) => acc + s.stock, 0);

              return (
                <TableRow
                  key={shoe.id}
                  onClick={() => setEditingShoe(shoe)}
                  className="cursor-pointer group"
                  title="Click to edit stock"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={shoe.imageUrl}
                        alt={shoe.name}
                        className="w-8 h-8 rounded-md object-cover bg-bg-sunken border border-line flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-medium text-text text-small block truncate group-hover:underline">
                          {shoe.name}
                        </span>
                        <span className="text-[11px] text-text-3 truncate block">
                          {shoe.colorway}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="capitalize text-small text-text-2">
                    {shoe.category}
                  </TableCell>

                  <TableCell className="font-mono text-small font-semibold">
                    {formatINR(shoe.priceINR)}
                  </TableCell>

                  <TableCell className="text-small text-text-3 max-w-[200px] truncate" title={shoe.fitGuidance}>
                    {shoe.fitGuidance}
                  </TableCell>

                  {/* UK 6 to 11 stock cells */}
                  {[6, 7, 8, 9, 10, 11].map(sizeNum => {
                    const sizeObj = shoe.sizes.find(s => s.sizeUK === sizeNum);
                    const stock = sizeObj ? sizeObj.stock : 0;
                    const isZero = stock === 0;
                    const isLow = stock > 0 && stock <= 2;

                    return (
                      <TableCell key={sizeNum} className="text-center font-mono text-small">
                        {isZero ? (
                          <span className="inline-flex items-center gap-1 text-risk line-through">
                            <span className="w-1.5 h-1.5 rounded-full bg-risk inline-block" /> 0
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-warn font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-warn inline-block" /> {stock}
                          </span>
                        ) : (
                          <span className="text-text">{stock}</span>
                        )}
                      </TableCell>
                    );
                  })}

                  <TableCell className="text-right font-mono font-bold text-text">
                    {totalStock}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Panel>

      {/* Side Sheet for Stock Edits */}
      <StockEditSheet
        shoe={editingShoe}
        open={Boolean(editingShoe)}
        onClose={() => setEditingShoe(null)}
        onUpdateStock={onUpdateStock}
      />
    </div>
  );
};
