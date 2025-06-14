
import React from 'react';
import ItemCard from './ItemCard';
import { SupportPlan, Partner, Resource, PartnerSuggestion, ResourceSuggestion } from '../types';
import { PARTNER_CATEGORIES, RESOURCE_CATEGORIES, SUGGESTED_PARTNERS_BANK, SUGGESTED_RESOURCES_BANK } from '../constants';

interface Step5PartnersResourcesProps {
  supportPlan: SupportPlan;
  onAddItem: (type: 'partner' | 'resource', suggestion?: PartnerSuggestion | ResourceSuggestion) => void;
  onUpdateItem: (type: 'partner' | 'resource', id: string, field: keyof Partner | keyof Resource, value: string) => void;
  onRemoveItem: (type: 'partner' | 'resource', id: string) => void;
}

const Step5PartnersResources: React.FC<Step5PartnersResourcesProps> = ({
  supportPlan,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) => {

  const renderSuggestionItem = (type: 'partner' | 'resource', sugg: PartnerSuggestion | ResourceSuggestion) => (
    <div key={sugg.name} className="p-3 border-b hover:bg-blue-50 flex justify-between items-center">
      <div>
        <p className="font-semibold text-blue-700">{sugg.name}</p>
        <p className="text-sm text-gray-600">{sugg.category}</p>
      </div>
      <button
        onClick={() => onAddItem(type, sugg)}
        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
      >
        + הוסף
      </button>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Partners Section */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">🤝 שותפים</h3>
        <div className="space-y-4 mb-6">
          {supportPlan.partners.length > 0 ? (
            supportPlan.partners.map(p => (
              <ItemCard<Partner>
                key={p.id}
                item={p}
                itemType="partner"
                categories={PARTNER_CATEGORIES}
                onUpdate={onUpdateItem as any} // Cast needed due to generic complexity
                onRemove={onRemoveItem}
              />
            ))
          ) : (
            <p className="text-gray-500 italic">לא זוהו שותפים.</p>
          )}
        </div>
        <button
          onClick={() => onAddItem('partner')}
          className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
        >
          + הוסף שותף
        </button>
        <div className="bg-gray-50 p-4 rounded-lg border mt-6">
          <h4 className="text-xl font-semibold text-gray-700 mb-3">מאגר שותפים</h4>
          <div className="suggestion-bank">
            {SUGGESTED_PARTNERS_BANK.map(s => renderSuggestionItem('partner', s))}
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">💎 משאבים</h3>
        <div className="space-y-4 mb-6">
          {supportPlan.resources.length > 0 ? (
            supportPlan.resources.map(r => (
              <ItemCard<Resource>
                key={r.id}
                item={r}
                itemType="resource"
                categories={RESOURCE_CATEGORIES}
                onUpdate={onUpdateItem as any} // Cast needed
                onRemove={onRemoveItem}
              />
            ))
          ) : (
            <p className="text-gray-500 italic">לא הוגדרו משאבים.</p>
          )}
        </div>
        <button
          onClick={() => onAddItem('resource')}
          className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
        >
          + הוסף משאב
        </button>
        <div className="bg-gray-50 p-4 rounded-lg border mt-6">
          <h4 className="text-xl font-semibold text-gray-700 mb-3">מאגר משאבים</h4>
          <div className="suggestion-bank">
            {SUGGESTED_RESOURCES_BANK.map(s => renderSuggestionItem('resource', s))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5PartnersResources;
