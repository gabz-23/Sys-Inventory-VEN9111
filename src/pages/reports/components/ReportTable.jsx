import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

/**
 * Mapa de colores para los badges de estado.
 * Cada estado tiene un color de fondo y texto específico.
 */
const statusColors = {
    Bueno: 'bg-green-500/10 text-green-700 dark:text-green-400',
    Repuesto: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    Dañado: 'bg-red-500/10 text-red-700 dark:text-red-400',
    'En reparacion': 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    Disponible: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    Asignado: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
};

/**
 * Componente que muestra la tabla de resultados del reporte.
 * 
 * Muestra una tabla con las siguientes columnas:
 * - Código: Código único del item
 * - Tipo: Tipo de item (Computador, Escritorio, Accesorio)
 * - Descripción: Descripción del item
 * - Estado: Estado actual con badge coloreado
 * - Categoría: Categoría del item
 * - Fecha: Fecha de creación formateada
 * 
 * Si no hay items, muestra un mensaje indicando que no hay datos.
 * 

 */
export const ReportTable = ({ filteredItems }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Resultados del Reporte</CardTitle>
                <CardDescription>Lista de items según los filtros aplicados</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.code}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusColors[item.status] || ''}>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>
                                            {new Date(item.date).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-sm text-muted-foreground">No hay datos para mostrar</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Ajusta los filtros para ver más resultados
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
