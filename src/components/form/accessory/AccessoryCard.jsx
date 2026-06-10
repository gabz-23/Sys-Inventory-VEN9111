import { X } from 'lucide-react';

export const AccessoryCard = ({ accessory, onRemove }) => {
    const displayText = accessory.description || accessory.specs || '';

    return (
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-150 group">
            <div className="flex items-center">
                <p className="text-sm flex flex-col text-gray-900 truncate">
                    <span>{displayText}</span>
                    <span className="text-xs text-gray-500">{accessory.type}</span>
                    <span className="text-zinc-600 mt-0.5">Código: {accessory.code}</span>
                </p>
            </div>

            <button
                onClick={() => onRemove(accessory.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Remover accesorio"
            >
                <X className="w-4 h-4 text-red-600" />
            </button>
        </div>
    );
};
