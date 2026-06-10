import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserCircle, Phone, IdCard, Briefcase, Mail, Table } from 'lucide-react';
import { useDeskStore } from '@/pages/desks/store/useDeskStore';

export const EmployeeDetailsDialog = ({ open, onOpenChange, employee }) => {
    const { loadDesks } = useDeskStore();
    const [assignedDesk, setAssignedDesk] = useState(null);

    useEffect(() => {
        if (open && employee) {
            loadDesks().then(() => {
                const employeeFullName = `${employee.nombres} ${employee.apellidos}`.toLowerCase().trim();
                const { desks } = useDeskStore.getState();
                const desk = desks.find(
                    (d) => d.employeeName?.toLowerCase().trim() === employeeFullName
                );
                setAssignedDesk(desk || null);
            });
        } else {
            setAssignedDesk(null);
        }
    }, [open, employee, loadDesks]);

    if (!employee) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-0 max-w-2xl flex flex-col max-h-[90vh] py-3 px-0">
                <DialogHeader className="pt-4 px-6 pb-0 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <UserCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold text-zinc-900">
                                {employee?.nombres} {employee?.apellidos}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-600 mt-1">
                                Información completa del empleado registrado
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Separator className="shrink-0" />

                <Card className="border-0 shadow-none flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-0">
                    <CardContent className="space-y-6 pt-4 pb-0">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <UserCircle className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Información Personal
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estado</p>
                                    <p className="font-semibold text-slate-900">{employee?.estado || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <IdCard className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cédula</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{employee?.cedula || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Teléfono</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{employee?.telefono || 'No registrado'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Correo</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{employee?.correo || 'No registrado'}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="w-3 h-3 text-slate-400" />
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Tipo de Empleado
                                        </p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{employee?.tipoEmpleado || 'N/A'}</p>
                                </div>
                                {employee?.createdAt && (
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Fecha de Registro
                                        </p>
                                        <p className="font-medium text-slate-900">
                                            {new Date(employee.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {assignedDesk && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Table className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                        Escritorio Asignado
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Código
                                        </p>
                                        <p className="font-semibold text-slate-900">{assignedDesk.code}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};
