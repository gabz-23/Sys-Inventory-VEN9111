import { Package, CheckCircle, Archive, AlertTriangle, Circle, UserCheck } from 'lucide-react';

/**
 * Componente que muestra las estadísticas del reporte.
 * 
 * Muestra estadísticas con:
 * - Total de items
 * - Cantidad por estado (Bueno, Repuesto, Dañado, Disponible, Asignado)
 * 
 * Solo muestra las estadísticas de estados que tienen items (mayor a 0).
 * Cada estadística tiene un icono distintivo según el estado.
 * 
 * 
 */
export const ReportStats = ({ stats }) => {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-foreground">Resumen de Estadísticas</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Vista general de los items según los filtros aplicados
                </p>
            </div>
            <div className="flex items-center gap-5 overflow-x-auto pb-3 border-b border-border">
                <div className="flex items-center gap-2.5 min-w-[110px]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        <Package className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
                        <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                    </div>
                </div>

                {stats.bueno > 0 && (
                    <>
                        <div className="h-10 w-px bg-border" />
                        <div className="flex items-center gap-2.5 min-w-[110px]">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Bueno</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {stats.bueno}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {stats.enReparacion > 0 && (
                    <>
                        <div className="h-10 w-px bg-border" />
                        <div className="flex items-center gap-2.5 min-w-[110px]">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">En reparacion</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {stats.enReparacion}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {stats.repuesto > 0 && (
                    <>
                        <div className="h-10 w-px bg-border" />
                        <div className="flex items-center gap-2.5 min-w-[110px]">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                <Archive className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Repuesto</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {stats.repuesto}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {stats.danado > 0 && (
                    <>
                        <div className="h-10 w-px bg-border" />
                        <div className="flex items-center gap-2.5 min-w-[110px]">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Dañado</p>
                                <p className="text-2xl font-semibold text-foreground">{stats.danado}</p>
                            </div>
                        </div>
                    </>
                )}

                {stats.disponible > 0 && (
                    <>
                        <div className="h-10 w-px bg-border" />
                        <div className="flex items-center gap-2.5 min-w-[110px]">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                <Circle className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Disponible</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {stats.disponible}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {stats.asignado > 0 && (
                    <>
                        <div className="h-10 w-px bg-border" />
                        <div className="flex items-center gap-2.5 min-w-[110px]">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                <UserCheck className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Asignado</p>
                                <p className="text-2xl font-semibold text-foreground">
                                    {stats.asignado}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
