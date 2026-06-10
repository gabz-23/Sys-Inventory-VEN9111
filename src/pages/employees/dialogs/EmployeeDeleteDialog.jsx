import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Info, AlertTriangle } from 'lucide-react';
import { useEmployeeStore } from '@/store/useEmployeeStore';
import { useDeskStore } from '@/pages/desks/store/useDeskStore';

export const EmployeeDeleteDialog = ({ employee, open, onOpenChange }) => {
    const { deleteEmployee } = useEmployeeStore();
    const { loadDesks } = useDeskStore();
    const [assignedDesk, setAssignedDesk] = useState(null);

    useEffect(() => {
        if (open && employee) {
            loadDesks().then(() => {
                const employeeFullName = `${employee.nombres} ${employee.apellidos}`.toLowerCase().trim();
                const { desks: updatedDesks } = useDeskStore.getState();
                const desk = updatedDesks.find(
                    (d) => d.employeeName?.toLowerCase().trim() === employeeFullName
                );
                setAssignedDesk(desk || null);
            });
        } else {
            setAssignedDesk(null);
        }
    }, [open, employee, loadDesks]);

    const handleDelete = (e) => {
        e.preventDefault();
        if (!employee) {
            onOpenChange();
            return;
        }

        deleteEmployee(employee.id);
        onOpenChange();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[430px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-1">
                        <Info />
                        <span> Eliminar empleado {employee?.nombres} {employee?.apellidos} </span>
                    </DialogTitle>
                    <DialogDescription>
                        {assignedDesk ? (
                            <span className="flex items-start gap-2 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                                <span>
                                    Este empleado está asignado al escritorio <strong>{assignedDesk.code}</strong>. Al
                                    eliminarlo, se desvinculará automáticamente del escritorio.
                                </span>
                            </span>
                        ) : (
                            <span>
                                Al eliminar este empleado se eliminarán todos sus datos asociados. Esta acción no se
                                puede deshacer.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end mt-2">
                    <form onSubmit={(e) => handleDelete(e)}>
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer mr-2"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" variant="destructive" className="cursor-pointer">
                            Eliminar
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
