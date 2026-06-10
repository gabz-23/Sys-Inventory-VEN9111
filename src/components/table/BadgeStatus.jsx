import { statusStyles } from '@/constants/badgeColorStatus';

export const BadgeStatus = ({ cell }) => {
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold
                ${statusStyles[cell.getValue()]}
            `}
        >
            {cell.getValue()}
        </span>
    );
};
