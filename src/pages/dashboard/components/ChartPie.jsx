import { Cell, Pie, PieChart } from 'recharts';
import { CheckCircle2, Package, AlertCircle, Wrench, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

const statusConfig = {
    good: {
        label: 'Bueno',
        color: '#22c55e',
        bgColor: 'bg-green-50 dark:bg-green-950/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-400',
        icon: CheckCircle2,
        chartColor: 'hsl(142, 76%, 36%)',
    },
    repaired: {
        label: 'Reincorporado',
        color: '#a855f7',
        bgColor: 'bg-purple-50 dark:bg-purple-950/20',
        borderColor: 'border-purple-200 dark:border-purple-800',
        textColor: 'text-purple-700 dark:text-purple-400',
        icon: Wrench,
        chartColor: 'hsl(270, 91%, 65%)',
    },
    replacement: {
        label: 'Repuesto',
        color: '#3b82f6',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-700 dark:text-blue-400',
        icon: Package,
        chartColor: 'hsl(217, 91%, 60%)',
    },
    damaged: {
        label: 'Dañado',
        color: '#ef4444',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-700 dark:text-red-400',
        icon: AlertCircle,
        chartColor: 'hsl(0, 84%, 60%)',
    },
    reconstructed: {
        label: 'Reconstruido',
        color: '#10b981',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        icon: RefreshCw,
        chartColor: 'hsl(160, 84%, 39%)',
    },
};

const chartConfig = {
    good: {
        label: 'Bueno',
        color: statusConfig.good.chartColor,
    },
    repaired: {
        label: 'Reincorporado',
        color: statusConfig.repaired.chartColor,
    },
    replacement: {
        label: 'Repuesto',
        color: statusConfig.replacement.chartColor,
    },
    damaged: {
        label: 'Dañado',
        color: statusConfig.damaged.chartColor,
    },
    reconstructed: {
        label: 'Reconstruido',
        color: statusConfig.reconstructed.chartColor,
    },
};

export function ChartPie({ computers }) {
    const goodComp = computers.filter((comp) => comp.state === 'Bueno').length;
    const reincorporatedComp = computers.filter((comp) => comp.state === 'Reincorporado').length;
    const replComp = computers.filter((comp) => comp.state === 'Repuesto').length;
    const damagedComp = computers.filter((comp) => comp.state === 'Dañado').length;
    const reconstructedComp = computers.filter((comp) => comp.state === 'Reconstruido').length;

    const total = computers.length;
    const percentages = {
        good: total > 0 ? ((goodComp / total) * 100).toFixed(1) : 0,
        repaired: total > 0 ? ((reincorporatedComp / total) * 100).toFixed(1) : 0,
        replacement: total > 0 ? ((replComp / total) * 100).toFixed(1) : 0,
        damaged: total > 0 ? ((damagedComp / total) * 100).toFixed(1) : 0,
        reconstructed: total > 0 ? ((reconstructedComp / total) * 100).toFixed(1) : 0,
    };

    const chartData = [
        { state: 'good', visitors: goodComp, fill: statusConfig.good.chartColor },
        { state: 'repaired', visitors: reincorporatedComp, fill: statusConfig.repaired.chartColor },
        { state: 'replacement', visitors: replComp, fill: statusConfig.replacement.chartColor },
        { state: 'damaged', visitors: damagedComp, fill: statusConfig.damaged.chartColor },
        { state: 'reconstructed', visitors: reconstructedComp, fill: statusConfig.reconstructed.chartColor },
    ];

    const allZero = chartData.every((item) => item.visitors === 0);
    const displayData = allZero ? chartData.map((item) => ({ ...item, visitors: 1 })) : chartData;

    const stats = [
        { key: 'good', count: goodComp, config: statusConfig.good, percentage: percentages.good },
        { key: 'repaired', count: reincorporatedComp, config: statusConfig.repaired, percentage: percentages.repaired },
        { key: 'replacement', count: replComp, config: statusConfig.replacement, percentage: percentages.replacement },
        { key: 'damaged', count: damagedComp, config: statusConfig.damaged, percentage: percentages.damaged },
        { key: 'reconstructed', count: reconstructedComp, config: statusConfig.reconstructed, percentage: percentages.reconstructed },
    ];

    return (
        <Card className="flex flex-col gap-0 border-border bg-card transition-shadow hover:shadow-md">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Estado de los Computadores</CardTitle>
                <CardDescription>Distribución por estado operativo</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Gráfico de pastel */}
                {allZero ? (
                    <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                        No hay computadores registrados
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[240px] [&_.recharts-pie-label-text]:fill-foreground"
                    >
                        <PieChart>
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0];
                                        const stateKey = data.dataKey === 'visitors' ? data.payload.state : null;
                                        const config = stateKey ? statusConfig[stateKey] : null;
                                        const count = data.value;
                                        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

                                        return (
                                            <div className="rounded-lg border bg-card p-3 shadow-lg">
                                                <div className="flex items-center gap-2 ">
                                                    {config && (
                                                        <div
                                                            className="h-3 w-3 rounded-full "
                                                            style={{ backgroundColor: config.chartColor }}
                                                        />
                                                    )}
                                                    <span className="font-semibold">{config?.label || ''}</span>
                                                </div>
                                                <div className="mt-1 text-sm text-muted-foreground">
                                                    {count} computador{count !== 1 ? 'es' : ''} ({percentage}%)
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Pie
                                data={displayData}
                                dataKey="visitors"
                                className="cursor-pointer"
                                nameKey="state"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                            >
                                {displayData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}

                {!allZero && (
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        {stats.map((stat) => {
                            return (
                                <div key={stat.key} className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: stat.config.chartColor }}
                                    />
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {stat.config.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
