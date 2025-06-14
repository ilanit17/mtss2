
import React from 'react';
import { Partner, Resource } from '../types';

type Item = Partner | Resource; // Type union
type ItemType = 'partner' | 'resource';

interface ItemCardProps<T extends Item> {
  item: T;
  itemType: ItemType;
  categories: string[];
  onUpdate: (itemType: ItemType, id: string, field: keyof T, value: string) => void;
  onRemove: (itemType: ItemType, id: string) => void;
}

const ItemCard = <T extends Item,>({ item, itemType, categories, onUpdate, onRemove }: ItemCardProps<T>) => {
  const isPartner = itemType === 'partner';
  const specificField = isPartner ? 'role' : 'details';
  const placeholder = isPartner ? "מנטור, יועץ" : "10 שעות, 5000 שח";

  return (
    <div className="item-card p-4 border rounded-lg bg-white shadow-sm space-y-3 fade-in">
      <div className="flex justify-between items-center">
        <input
          type="text"
          className="text-lg font-semibold border-b-2 border-transparent focus:border-blue-500 outline-none w-full"
          value={item.name}
          onChange={(e) => onUpdate(itemType, item.id, 'name' as keyof T, e.target.value)}
        />
        <button onClick={() => onRemove(itemType, item.id)} className="text-red-500 hover:text-red-700 font-bold text-xl">
          &times;
        </button>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-600">קטגוריה</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md mt-1"
          value={item.category}
          onChange={(e) => onUpdate(itemType, item.id, 'category' as keyof T, e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-600">{isPartner ? 'תפקיד' : 'פרטים'}</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md mt-1"
          placeholder={placeholder}
          value={(item as any)[specificField]} // Accessing dynamic field
          onChange={(e) => onUpdate(itemType, item.id, specificField as keyof T, e.target.value)}
        />
      </div>
    </div>
  );
};

export default ItemCard;
