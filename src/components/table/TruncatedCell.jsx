import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const TruncatedCell = ({ value, minWidth = '80px', maxWidth = '150px', charLimit }) => {
    const rawValue = value || 'Sin asignar';
    const displayValue = charLimit && rawValue.length > charLimit ? rawValue.slice(0, charLimit) + '...' : rawValue;
    const shouldShowTooltip = rawValue.length > 20 || (charLimit && rawValue.length > charLimit);

    return shouldShowTooltip ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="truncate text-sm" style={{ maxWidth, minWidth }}>
                        {displayValue}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" className=" shadow-lg max-w-[300px]">
                    <p className="text-xs ">{rawValue}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        <div className="text-sm" style={{ minWidth }}>
            {displayValue === 'Sin asignar' ? (
                <span className="font-medium text-sm text-gray-400 italic">{displayValue}</span>
            ) : (
                <span className="font-medium text-sm text-gray-700">{displayValue}</span>
            )}
        </div>
    );
};
