import { useEffect } from 'react';
import { useComputerStore } from '@/pages/computers/store/useComputerStore';
import { TruncatedCell } from '@/components/table/TruncatedCell';

export const ComputerCell = ({ computerId }) => {
    const { computers, loadComputers } = useComputerStore();

    useEffect(() => {
        if (computers.length === 0) {
            loadComputers();
        }
    }, []);

    const computer = computers.find((c) => c.id === computerId);
    return <TruncatedCell value={computer?.code} minWidth="80px" maxWidth="120px" />;
};
