import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Armchair, Monitor, Mouse, Cpu, Usb, Users, TrendingUp } from 'lucide-react';

const cardInfo = {
    computer: {
        bgCard: 'bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200/50 dark:border-orange-800/30',
        bgIcon: 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg shadow-orange-500/25',
        icon: Monitor,
        iconColor: 'text-orange-600 dark:text-orange-400',
        accentColor: 'text-orange-600 dark:text-orange-500',
    },
    desk: {
        bgCard: 'bg-gradient-to-br from-sky-50/50 to-sky-100/30 dark:from-sky-950/20 dark:to-sky-900/10 border-sky-200/50 dark:border-sky-800/30',
        bgIcon: 'bg-gradient-to-br from-sky-400 to-sky-500 shadow-lg shadow-sky-500/25',
        icon: Armchair,
        iconColor: 'text-sky-600 dark:text-sky-400',
        accentColor: 'text-sky-600 dark:text-sky-500',
    },
    desk_accessory: {
        bgCard: 'bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30',
        bgIcon: 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/25',
        icon: Mouse,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        accentColor: 'text-emerald-600 dark:text-emerald-500',
    },
    component: {
        bgCard: 'bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50 dark:border-purple-800/30',
        bgIcon: 'bg-gradient-to-br from-purple-400 to-purple-500 shadow-lg shadow-purple-500/25',
        icon: Cpu,
        iconColor: 'text-purple-600 dark:text-purple-400',
        accentColor: 'text-purple-600 dark:text-purple-500',
    },
    peripheral: {
        bgCard: 'bg-gradient-to-br from-teal-50/50 to-teal-100/30 dark:from-teal-950/20 dark:to-teal-900/10 border-teal-200/50 dark:border-teal-800/30',
        bgIcon: 'bg-gradient-to-br from-teal-400 to-teal-500 shadow-lg shadow-teal-500/25',
        icon: Usb,
        iconColor: 'text-teal-600 dark:text-teal-400',
        accentColor: 'text-teal-600 dark:text-teal-500',
    },
    employee: {
        bgCard: 'bg-gradient-to-br from-rose-50/50 to-rose-100/30 dark:from-rose-950/20 dark:to-rose-900/10 border-rose-200/50 dark:border-rose-800/30',
        bgIcon: 'bg-gradient-to-br from-rose-400 to-rose-500 shadow-lg shadow-rose-500/25',
        icon: Users,
        iconColor: 'text-rose-600 dark:text-rose-400',
        accentColor: 'text-rose-600 dark:text-rose-500',
    },
};

export const InfoCard = ({ title = '', total = 0, type = '' }) => {
    const { bgCard, bgIcon, icon: Icon, accentColor } = cardInfo[type] ?? cardInfo.computer;

    return (
        <Card
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 ${bgCard} gap-5`}
        >
            <div
                className={`absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-15 blur-3xl ${bgIcon.replace(
                    'bg-linear-to-br',
                    'bg'
                )}`}
            />

            <CardHeader className="relative z-10 pb-1.5">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 pt-0">
                <div className="flex items-end justify-between gap-3">
                    <div className="space-y-2">
                        <div
                            className={`text-4xl font-bold tracking-tight ${accentColor} transition-transform duration-300 group-hover:scale-105`}
                        >
                            {total}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>Total registrados</span>
                        </div>
                    </div>

                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${bgIcon}`}
                    >
                        <Icon className="h-7 w-7 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
