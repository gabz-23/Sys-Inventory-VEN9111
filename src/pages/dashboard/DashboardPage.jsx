import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoCard } from './components/InfoCard';
import { ChartPie } from './components/ChartPie';
import { useComputerStore } from '../computers/store/useComputerStore';
import { RecentItem } from './components/RecentItem';
import { useDeskStore } from '../desks/store/useDeskStore';
import { useDeskAccessoryStore } from '@/store/useDeskAccessoryStore';
import { useComponentStore } from '@/store/useComponentStore';
import { usePeripheralStore } from '@/store/usePeripheralStore';
import { useEmployeeStore } from '@/store/useEmployeeStore';

export const DashboardPage = () => {
    const { computers, loadComputers } = useComputerStore();
    const { desks, loadDesks } = useDeskStore();
    const { deskAccessories, loadDeskAccessories } = useDeskAccessoryStore();
    const { components, loadComponents } = useComponentStore();
    const { peripherals, loadPeripherals } = usePeripheralStore();
    const { employees, loadEmployees } = useEmployeeStore();
    const [recentActivities, setRecentActivities] = useState([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(false);

    useEffect(() => {
        loadComputers();
        loadDesks();
        loadDeskAccessories();
        loadComponents();
        loadPeripherals();
        loadEmployees();
        loadRecentActivities();
    }, []);

    const loadRecentActivities = async () => {
        setIsLoadingActivities(true);
        try {
            const activities = await window.electronAPI.getRecentActivities();
            setRecentActivities(activities);
        } catch (error) {
            console.error('Error al cargar actividades recientes:', error);
            setRecentActivities([]);
        } finally {
            setIsLoadingActivities(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Panel de Control</h1>
                <p className="mt-2 text-muted-foreground">
                    Gestión de Bienes. Tu vista completa sobre la asignación y el estatus de tus recursos físicos.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard title="Total Computadores" total={computers.length} type="computer" />
                <InfoCard title="Total Escritorios" total={desks.length} type="desk" />
                <InfoCard title="Acc. Escritorio" total={deskAccessories.length} type="desk_accessory" />
                <InfoCard title="Componentes" total={components.length} type="component" />
                <InfoCard title="Periféricos" total={peripherals.length} type="peripheral" />
                <InfoCard title="Total Empleados" total={employees.length} type="employee" />
            </div>

            {/* Movimientos recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                <Card className="border-border bg-card transition-shadow hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Movimientos en el Sistema</CardTitle>
                        <CardDescription>
                            Actividades registradas en la última semana (creaciones, actualizaciones y eliminaciones)
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-2 pr-4 h-[280px] overflow-auto">
                        {isLoadingActivities ? (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                Cargando movimientos...
                            </div>
                        ) : recentActivities.length > 0 ? (
                            <div className="space-y-2">
                                {recentActivities.map((item, index) => (
                                    <RecentItem key={`${item.type}-${item.id}-${index}`} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                No hay movimientos recientes
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div>
                    <ChartPie computers={computers} />
                </div>
            </div>
        </div>
    );
};
