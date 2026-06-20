import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Monitor,
    Armchair,
    Mouse,
    FileText,
    Plus,
    Pencil,
    Trash2,
    Eye,
    Filter,
    Download,
    FileSpreadsheet,
    Search,
    LayoutDashboard,
    History,
    Info,
    BookOpen,
    UserCircle,
    Cpu,
    Usb,
    Sofa,
    Scissors,
    Settings,
    Database,
    Users,
    Shield,
    Wrench,
    RotateCcw,
    CheckCircle,
} from 'lucide-react';

export function HelpPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Centro de Ayuda</h2>
                <p className="text-muted-foreground">
                    Guía completa para gestionar el inventario, canibalización, reportes y configuración del sistema
                </p>
            </div>

            <Accordion collapsible className="w-full space-y-4 mb-10">

                {/* ============================================================ */}
                {/* SECCIÓN: DICCIONARIO DE PREFIJOS */}
                {/* ============================================================ */}
                <AccordionItem value="prefijos" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Diccionario de Prefijos</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        ¿Qué son los Prefijos?
                                    </CardTitle>
                                    <CardDescription>
                                        Los prefijos son códigos cortos que identifican el tipo de elemento en el sistema
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>
                                            Cada elemento en el inventario tiene un código único que comienza con un
                                            prefijo. Este prefijo identifica el tipo de elemento y se usa para generar
                                            códigos automáticos.
                                        </p>
                                        <p className="text-muted-foreground">
                                            El formato de los códigos es:{' '}
                                            <code className="bg-muted px-2 py-1 rounded">PREFIJO-XXXXX</code> donde{' '}
                                            <code className="bg-muted px-2 py-1 rounded">XXXXX</code> es un código
                                            alfanumérico único generado automáticamente.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Monitor className="h-4 w-4" />
                                        COMP - Computadores
                                    </CardTitle>
                                    <CardDescription>
                                        Prefijo utilizado para identificar computadores en el sistema
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="outline" className="font-mono text-base px-3 py-1">COMP</Badge>
                                            <span className="text-muted-foreground">= Computador</span>
                                        </div>
                                        <p>
                                            El prefijo <strong>COMP</strong> se utiliza para identificar todos los
                                            computadores del inventario, ya sean laptops o de escritorio.
                                        </p>
                                        <div className="bg-muted/50 p-3 rounded-lg mt-3">
                                            <p className="text-xs font-medium mb-2">Ejemplos:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                                <li><code className="bg-background px-1 py-0.5 rounded">COMP-A3B2C</code> — Un computador</li>
                                                <li><code className="bg-background px-1 py-0.5 rounded">COMP-X9Y8Z</code> — Otro computador</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Armchair className="h-4 w-4" />
                                        ESC - Escritorios
                                    </CardTitle>
                                    <CardDescription>
                                        Prefijo utilizado para identificar escritorios o mesas de trabajo
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="outline" className="font-mono text-base px-3 py-1">ESC</Badge>
                                            <span className="text-muted-foreground">= Escritorio</span>
                                        </div>
                                        <p>
                                            El prefijo <strong>ESC</strong> se utiliza para identificar escritorios.
                                            Un escritorio puede tener asignado un computador, un empleado y varios accesorios.
                                        </p>
                                        <div className="bg-muted/50 p-3 rounded-lg mt-3">
                                            <p className="text-xs font-medium mb-2">Ejemplos:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                                <li><code className="bg-background px-1 py-0.5 rounded">ESC-M5N4O</code> — Un escritorio</li>
                                                <li><code className="bg-background px-1 py-0.5 rounded">ESC-P2Q1R</code> — Otro escritorio</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: DASHBOARD */}
                {/* ============================================================ */}
                <AccordionItem value="dashboard" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Panel de Control (Dashboard)</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Vista General del Sistema
                                    </CardTitle>
                                    <CardDescription>
                                        El Dashboard proporciona una vista completa del estado del inventario
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>El Panel de Control muestra información importante del sistema:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Tarjetas de Resumen:</strong> Total de computadores, escritorios, accesorios, componentes y periféricos</li>
                                            <li><strong>Gráfico de Distribución:</strong> Visualización de elementos por estado (Bueno, Dañado, Reconstruido, Reincorporado, Repuesto)</li>
                                            <li><strong>Movimientos Recientes:</strong> Registro de actividades de la última semana</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <History className="h-4 w-4" />
                                        Registro de Actividades Recientes
                                    </CardTitle>
                                    <CardDescription>
                                        Sistema automático de registro de todas las operaciones realizadas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>El sistema registra automáticamente todas las actividades:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Creaciones:</strong> Cuando se agrega un nuevo elemento</li>
                                            <li><strong>Actualizaciones:</strong> Cuando se modifica información de cualquier elemento</li>
                                            <li><strong>Eliminaciones:</strong> Cuando se elimina un elemento</li>
                                            <li><strong>Canibalizaciones:</strong> Cuando se transfieren componentes entre equipos</li>
                                        </ul>
                                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground">
                                                El registro muestra las operaciones de los últimos 7 días, incluyendo tipo de elemento, acción, código y fecha/hora.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: EMPLEADOS */}
                {/* ============================================================ */}
                <AccordionItem value="empleados" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <UserCircle className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Gestión de Empleados</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear un Empleado
                                    </CardTitle>
                                    <CardDescription>Registrar un nuevo empleado en el sistema</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Navega a la sección <strong>Empleados</strong> en el menú lateral</li>
                                        <li>Haz clic en <Badge variant="outline">Agregar Empleado</Badge></li>
                                        <li>Completa los campos: nombre, cédula, cargo, departamento y correo</li>
                                        <li>Haz clic en <Badge>Guardar</Badge></li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Editar y Eliminar Empleados
                                    </CardTitle>
                                    <CardDescription>Modificar o eliminar registros de empleados</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p><strong>Editar:</strong> Usa el botón <Badge variant="outline" className="gap-1"><Pencil className="h-3 w-3" /> Editar</Badge> en la tabla para modificar los datos del empleado.</p>
                                        <p><strong>Eliminar:</strong> Usa el botón <Badge variant="destructive" className="gap-1"><Trash2 className="h-3 w-3" /> Eliminar</Badge> y confirma la acción.</p>
                                        <p className="text-muted-foreground italic text-xs">Los empleados se pueden asignar a escritorios desde la gestión de escritorios.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: INVENTARIO - COMPUTADORES */}
                {/* ============================================================ */}
                <AccordionItem value="computadores" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Monitor className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Gestión de Computadores</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear un Computador
                                    </CardTitle>
                                    <CardDescription>Pasos para agregar un nuevo computador</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Navega a <strong>Inventario → Computadores</strong></li>
                                        <li>Haz clic en <Badge variant="outline">Agregar Computador</Badge></li>
                                        <li>Completa el formulario con las pestañas:
                                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                                                <li><strong>General:</strong> Código, serial, marca, modelo, tipo (Laptop/Escritorio) y estado</li>
                                                <li><strong>Especificaciones:</strong> CPU, RAM, almacenamiento, tarjeta gráfica, fuente, motherboard, cooler, lector CD/DVD</li>
                                            </ul>
                                        </li>
                                        <li>Haz clic en <Badge>Guardar</Badge></li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Editar un Computador
                                    </CardTitle>
                                    <CardDescription>Modificar información de un computador</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>En la tabla, localiza el computador y haz clic en <Badge variant="outline" className="gap-1"><Pencil className="h-3 w-3" /> Editar</Badge></li>
                                        <li>Modifica los campos necesarios</li>
                                        <li>Haz clic en <Badge>Guardar Cambios</Badge></li>
                                        <li className="text-muted-foreground italic">El código no se puede modificar después de creado</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Eliminar un Computador
                                    </CardTitle>
                                    <CardDescription>Eliminar un computador del inventario</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Haz clic en <Badge variant="destructive" className="gap-1"><Trash2 className="h-3 w-3" /> Eliminar</Badge></li>
                                        <li>Confirma la eliminación</li>
                                        <li className="text-destructive font-medium">⚠️ Esta acción no se puede deshacer</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Ver Detalles
                                    </CardTitle>
                                    <CardDescription>Consultar información completa de un computador</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Haz clic en <Badge variant="outline" className="gap-1"><Eye className="h-3 w-3" /> Ver</Badge></li>
                                        <li>Se abrirá un diálogo con todas las especificaciones, componentes y periféricos asignados</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Search className="h-4 w-4" />
                                        Buscar y Filtrar
                                    </CardTitle>
                                    <CardDescription>Encontrar computadores específicos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>Usa la barra de búsqueda para buscar por código, serial, marca o modelo</li>
                                        <li>Filtra por estado, asignación a escritorio y tipo</li>
                                        <li>Ordena las columnas haciendo clic en los encabezados</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Monitor className="h-4 w-4" />
                                        Estados de un Computador
                                    </CardTitle>
                                    <CardDescription>Significado de cada estado disponible</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li><strong>Bueno:</strong> Funcionando correctamente</li>
                                        <li><strong>Dañado:</strong> Presenta fallas, pendiente de reparación o reconstrucción</li>
                                        <li><strong>Reconstruido:</strong> Reparado mediante canibalización de partes</li>
                                        <li><strong>Reincorporado:</strong> Reparado y disponible sin asignación</li>
                                        <li><strong>Repuesto:</strong> Usado como repuesto</li>
                                        <li><strong>En reparacion:</strong> Actualmente en proceso de reparación</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: INVENTARIO - ESCRITORIOS */}
                {/* ============================================================ */}
                <AccordionItem value="escritorios" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Armchair className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Gestión de Escritorios</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear un Escritorio
                                    </CardTitle>
                                    <CardDescription>Agregar un nuevo escritorio al inventario</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Navega a <strong>Inventario → Escritorios</strong></li>
                                        <li>Haz clic en <Badge variant="outline">Agregar Escritorio</Badge></li>
                                        <li>Completa el formulario: código, ubicación, empleado asignado y computador asignado</li>
                                        <li>Haz clic en <Badge>Guardar</Badge></li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Monitor className="h-4 w-4" />
                                        Asignar Computador a un Escritorio
                                    </CardTitle>
                                    <CardDescription>Vincular un computador a un escritorio</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Al crear o editar un escritorio, selecciona un computador disponible</li>
                                        <li>También puedes asignar un empleado responsable</li>
                                        <li>Los accesorios de escritorio se asignan desde su propia sección</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Ver Detalles del Escritorio
                                    </CardTitle>
                                    <CardDescription>Información completa del escritorio y sus asignaciones</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <p>Al hacer clic en <Badge variant="outline" className="gap-1"><Eye className="h-3 w-3" /> Ver</Badge> puedes consultar:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                                            <li>Información del escritorio y ubicación</li>
                                            <li>Empleado asignado</li>
                                            <li>Computador asignado con sus especificaciones</li>
                                            <li>Accesorios de escritorio vinculados</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Editar y Eliminar
                                    </CardTitle>
                                    <CardDescription>Modificar o eliminar escritorios</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p><strong>Editar:</strong> Usa el botón <Badge variant="outline" className="gap-1"><Pencil className="h-3 w-3" /> Editar</Badge> para cambiar la asignación de computador, empleado o ubicación.</p>
                                        <p><strong>Eliminar:</strong> Usa <Badge variant="destructive" className="gap-1"><Trash2 className="h-3 w-3" /> Eliminar</Badge>. Al eliminar un escritorio, los accesorios vinculados se desasignan automáticamente.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: INVENTARIO - ACCESORIOS DE ESCRITORIO */}
                {/* ============================================================ */}
                <AccordionItem value="accesorios-escritorio" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Sofa className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Gestión de Accesorios de Escritorio</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        ¿Qué son los Accesorios de Escritorio?
                                    </CardTitle>
                                    <CardDescription>Elementos físicos asociados a un escritorio</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>Los accesorios de escritorio son elementos como sillas, lámparas, papeleras, archiveros y teléfonos que se asignan a un escritorio específico.</p>
                                        <p>Cada accesorio tiene un código, serial, tipo, descripción y estado. Pueden estar asignados a un escritorio o disponibles (no asignados).</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear Accesorio de Escritorio
                                    </CardTitle>
                                    <CardDescription>Agregar un nuevo accesorio</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Navega a <strong>Inventario → Acc. Escritorio</strong></li>
                                        <li>Haz clic en <Badge variant="outline">Agregar Accesorio</Badge></li>
                                        <li>Completa: código, serial, descripción, tipo (Silla, Lámpara, Papelera, Archivero, Teléfono) y estado</li>
                                        <li>Opcionalmente asígnalo a un escritorio existente</li>
                                        <li>Haz clic en <Badge>Guardar</Badge></li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Editar, Eliminar y Filtrar
                                    </CardTitle>
                                    <CardDescription>Gestión completa de accesorios</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p><strong>Editar:</strong> Cambia tipo, estado o reasigna a otro escritorio.</p>
                                        <p><strong>Eliminar:</strong> Elimina el accesorio del inventario.</p>
                                        <p><strong>Filtrar:</strong> Filtra por estado, tipo o asignación a escritorio.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: INVENTARIO - COMPONENTES */}
                {/* ============================================================ */}
                <AccordionItem value="componentes" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Cpu className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Gestión de Componentes</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        ¿Qué son los Componentes?
                                    </CardTitle>
                                    <CardDescription>Partes internas de un computador</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>Los componentes son partes internas como RAM, discos duros, procesadores, tarjetas gráficas, fuentes de poder, tarjetas WiFi y fans/coolers.</p>
                                        <p>Pueden estar asignados a un computador específico o disponibles en el inventario como repuesto. Los componentes se usan en el proceso de canibalización.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear Componente
                                    </CardTitle>
                                    <CardDescription>Agregar un nuevo componente</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Navega a <strong>Inventario → Componentes</strong></li>
                                        <li>Haz clic en <Badge variant="outline">Agregar Componente</Badge></li>
                                        <li>Completa: código, serial, marca, modelo, especificaciones y tipo</li>
                                        <li>Selecciona el estado y asigna a un computador si corresponde</li>
                                        <li>Haz clic en <Badge>Guardar</Badge></li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Editar, Eliminar y Buscar
                                    </CardTitle>
                                    <CardDescription>Gestión de componentes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p><strong>Editar:</strong> Modifica especificaciones, estado o reasigna a otro computador.</p>
                                        <p><strong>Eliminar:</strong> Elimina el componente del inventario.</p>
                                        <p><strong>Filtrar:</strong> Filtra por tipo de componente, estado o computador asignado.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: INVENTARIO - PERIFÉRICOS */}
                {/* ============================================================ */}
                <AccordionItem value="perifericos" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Usb className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Gestión de Periféricos</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        ¿Qué son los Periféricos?
                                    </CardTitle>
                                    <CardDescription>Dispositivos externos conectados a un computador</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>Los periféricos son dispositivos como mouse, monitores, impresoras, teclados y cargadores.</p>
                                        <p>Pueden estar asignados a un computador o disponibles. Cada periférico tiene un tipo de conexión (VGA, USB, Bluetooth, HDMI, Otro).</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear Periférico
                                    </CardTitle>
                                    <CardDescription>Agregar un nuevo periférico</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Navega a <strong>Inventario → Periféricos</strong></li>
                                        <li>Haz clic en <Badge variant="outline">Agregar Periférico</Badge></li>
                                        <li>Completa: código, serial, descripción, marca, modelo, tipo y tipo de conexión</li>
                                        <li>Selecciona el estado y asigna a un computador si corresponde</li>
                                        <li>Haz clic en <Badge>Guardar</Badge></li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Editar, Eliminar y Filtrar
                                    </CardTitle>
                                    <CardDescription>Gestión de periféricos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p><strong>Editar:</strong> Modifica datos, reasigna a otro computador o cambia el estado.</p>
                                        <p><strong>Eliminar:</strong> Elimina el periférico del inventario.</p>
                                        <p><strong>Filtrar:</strong> Filtra por tipo, estado, tipo de conexión o computador asignado.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: CANIBALIZACIÓN */}
                {/* ============================================================ */}
                <AccordionItem value="canibalizacion" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Scissors className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Canibalización</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        ¿Qué es la Canibalización?
                                    </CardTitle>
                                    <CardDescription>Transferencia de componentes entre equipos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>La canibalización consiste en tomar componentes o periféricos de un computador donante para reparar o mejorar un computador receptor. El sistema permite gestionar todo el ciclo de vida:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Movimientos:</strong> Registro de transferencias de componentes entre equipos</li>
                                            <li><strong>Faltantes:</strong> Lista de componentes y periféricos faltantes en los equipos receptores</li>
                                            <li><strong>Bitácora:</strong> Pipeline de estados: Dañado → Reconstruido/Reincorporado</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Scissors className="h-4 w-4" />
                                        Movimientos de Canibalización
                                    </CardTitle>
                                    <CardDescription>Registro de transferencias entre equipos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Selecciona un <strong>computador donante</strong> (el que aporta las partes)</li>
                                        <li>Selecciona un <strong>computador receptor</strong> (el que recibe las partes)</li>
                                        <li>Elige los componentes y periféricos a transferir</li>
                                        <li>Agrega observaciones si es necesario</li>
                                        <li>Haz clic en <Badge>Guardar</Badge></li>
                                        <li className="text-muted-foreground italic">El sistema registra automáticamente la fecha, el usuario y los elementos transferidos</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Faltantes
                                    </CardTitle>
                                    <CardDescription>Componentes que necesita cada computador</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>La pestaña <strong>Faltantes</strong> muestra los componentes y periféricos que el computador receptor necesita pero que aún no se le han asignado.</p>
                                        <p>Esto permite identificar rápidamente qué partes deben conseguirse o canibalizarse para completar un equipo.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <History className="h-4 w-4" />
                                        Bitácora de Estados
                                    </CardTitle>
                                    <CardDescription>Pipeline de reparación y reconstrucción</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>La bitácora gestiona el ciclo de vida de los elementos con estos tabs:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>
                                                <strong>Dañados:</strong> Elementos con estado <span className="text-red-600 font-medium">Dañado</span>.
                                                Acciones disponibles:
                                                <ul className="list-disc list-inside ml-8 mt-1 space-y-1 text-muted-foreground">
                                                    <li><Badge variant="outline" className="gap-1"><Wrench className="h-3 w-3" /> Reparar</Badge> → Cambia a <strong>Reincorporado</strong></li>
                                                    <li><Badge variant="outline" className="gap-1"><RotateCcw className="h-3 w-3" /> Reconstruir</Badge> → Cambia a <strong>Reconstruido</strong></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <strong>Reconstruidos:</strong> Elementos reconstruidos listos para reincorporarse.
                                                Acción: <Badge variant="outline" className="gap-1"><CheckCircle className="h-3 w-3" /> Disponible</Badge> → Cambia a <strong>Reincorporado</strong> y se desasigna
                                            </li>
                                            <li>
                                                <strong>Reincorporados:</strong> Elementos reparados/reconstruidos, disponibles y sin asignación (solo lectura)
                                            </li>
                                        </ul>
                                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground">
                                                Los cambios de estado se registran automáticamente en la trazabilidad del sistema.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: TRAZABILIDAD */}
                {/* ============================================================ */}
                <AccordionItem value="trazabilidad" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <History className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Trazabilidad</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        ¿Qué es la Trazabilidad?
                                    </CardTitle>
                                    <CardDescription>Historial completo de movimientos de cada elemento</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>
                                            La trazabilidad registra todos los eventos importantes de cada elemento del inventario:
                                            cambios de estado, asignaciones, desasignaciones y movimientos de canibalización.
                                        </p>
                                        <p>Para cada registro puedes ver:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Tipo:</strong> Computador, Componente, Periférico o Acc. Escritorio</li>
                                            <li><strong>Código:</strong> Identificador único del elemento</li>
                                            <li><strong>Fechas:</strong> Dañado, en reparación, reincorporado</li>
                                            <li><strong>Origen y Destino:</strong> Ubicación anterior y nueva del elemento</li>
                                            <li><strong>Registrado por:</strong> Usuario que realizó la operación</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        Filtrar Trazabilidad
                                    </CardTitle>
                                    <CardDescription>Buscar eventos específicos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li><strong>Por tipo de movimiento:</strong> Canibalización, Cambio de estado o Asignación</li>
                                        <li><strong>Por tipo de elemento:</strong> Computadoras, Componentes, Periféricos, Acc. Escritorio</li>
                                        <li><strong>Por rango de fechas:</strong> Desde y hasta una fecha específica</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Editar y Eliminar Registros
                                    </CardTitle>
                                    <CardDescription>Gestión de registros de trazabilidad</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>En la página de trazabilidad puedes:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Editar:</strong> Modificar fechas, descripciones y razones de un registro</li>
                                            <li><strong>Eliminar:</strong> Eliminar registros individuales o múltiples (selección masiva)</li>
                                        </ul>
                                        <p className="text-muted-foreground italic text-xs">La edición de registros es útil para corregir fechas o detalles de movimientos anteriores.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: REPORTES */}
                {/* ============================================================ */}
                <AccordionItem value="reportes" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Generación de Reportes</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        Tipos de Reportes
                                    </CardTitle>
                                    <CardDescription>Vistas disponibles para consultar el inventario</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li><strong>General:</strong> Vista completa del inventario con filtros por fecha, tipo de elemento, estado, categoría y asignación</li>
                                        <li><strong>Escritorios:</strong> Inventario organizado por escritorio, mostrando empleado, computador y accesorios asignados</li>
                                        <li><strong>Trazabilidad:</strong> Historial unificado de todos los movimientos, cambios de estado y canibalizaciones</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        Filtrar Reportes (General)
                                    </CardTitle>
                                    <CardDescription>Personalizar la vista del reporte general</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li><strong>Rango de Fechas:</strong> Hoy, Semana, Mes, Trimestre, Año o Todo</li>
                                        <li><strong>Tipo de Elemento:</strong> Computadores, Escritorios, Acc. Escritorio, Componentes o Periféricos</li>
                                        <li><strong>Estado:</strong> Bueno, Repuesto, Dañado, En reparacion, Reincorporado, Reconstruido</li>
                                        <li><strong>Asignación:</strong> Asignado o No asignado</li>
                                        <li><strong>Ordenar por:</strong> Fecha, Nombre, Código o Estado</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        Exportar a PDF
                                    </CardTitle>
                                    <CardDescription>Generar un reporte en formato PDF</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Aplica los filtros deseados</li>
                                        <li>Haz clic en <Badge className="gap-2"><Download className="h-4 w-4" /> Exportar PDF</Badge></li>
                                        <li>El archivo incluye: resumen de estadísticas, tabla completa y filtros aplicados</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileSpreadsheet className="h-4 w-4" />
                                        Exportar a Excel
                                    </CardTitle>
                                    <CardDescription>Generar un reporte en formato Excel</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Configura los filtros según tus necesidades</li>
                                        <li>Haz clic en <Badge variant="outline" className="gap-2"><FileSpreadsheet className="h-4 w-4" /> Exportar Excel</Badge></li>
                                        <li>Se descargará un archivo .xlsx listo para análisis</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        Exportar Reporte de Escritorios
                                    </CardTitle>
                                    <CardDescription>Exportar el inventario organizado por escritorios</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <p>El reporte de escritorios se puede exportar a PDF con el botón <Badge className="gap-2"><Download className="h-4 w-4" /> Exportar PDF</Badge>.</p>
                                        <p>Incluye: empleado asignado, computador con especificaciones y accesorios vinculados.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: USUARIOS Y ROLES */}
                {/* ============================================================ */}
                <AccordionItem value="usuarios" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Usuarios y Roles</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Roles del Sistema
                                    </CardTitle>
                                    <CardDescription>Permisos y capacidades según el rol</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 text-sm">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border rounded-lg">
                                            <p className="font-medium text-blue-700 dark:text-blue-400">Administrador</p>
                                            <p className="text-muted-foreground mt-1">Acceso completo al sistema: crear, editar, eliminar elementos, gestionar usuarios, canibalización, reportes y respaldo de base de datos.</p>
                                        </div>
                                        <div className="p-3 bg-green-50 dark:bg-green-950/20 border rounded-lg">
                                            <p className="font-medium text-green-700 dark:text-green-400">Visualizador (Viewer)</p>
                                            <p className="text-muted-foreground mt-1">Acceso de solo lectura. Puede ver todas las secciones (Dashboard, Inventario, Canibalización, Trazabilidad, Ayuda) pero no puede crear, editar ni eliminar registros. Tampoco puede exportar reportes ni acceder a Usuarios o Respaldo BD.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Gestión de Usuarios (Admin)
                                    </CardTitle>
                                    <CardDescription>Administrar cuentas de usuario</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>Los usuarios administradores pueden:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li><strong>Crear usuarios:</strong> Registrar nuevos usuarios con rol de administrador o visualizador</li>
                                            <li><strong>Editar usuarios:</strong> Modificar nombre, cédula, username y rol</li>
                                            <li><strong>Activar/Desactivar:</strong> Habilitar o deshabilitar cuentas de usuario</li>
                                            <li><strong>Cambiar contraseña:</strong> Restablecer la contraseña de cualquier usuario</li>
                                            <li><strong>Eliminar usuarios:</strong> Eliminar cuentas del sistema</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: CONFIGURACIÓN */}
                {/* ============================================================ */}
                <AccordionItem value="configuracion" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Settings className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Configuración de la Cuenta</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserCircle className="h-4 w-4" />
                                        Datos Personales
                                    </CardTitle>
                                    <CardDescription>Modificar tu información de perfil</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">En la sección <strong>Configuración</strong> puedes editar tu nombre, apellido y cédula.</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="h-4 w-4" />
                                        Cambiar Contraseña
                                    </CardTitle>
                                    <CardDescription>Actualizar tu contraseña de acceso</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Ve a <strong>Configuración</strong></li>
                                        <li>Haz clic en <Badge variant="outline">Cambiar Contraseña</Badge></li>
                                        <li>Ingresa tu contraseña actual y la nueva contraseña</li>
                                        <li>Confirma y guarda los cambios</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Preguntas de Seguridad
                                    </CardTitle>
                                    <CardDescription>Configurar preguntas de recuperación</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>En <strong>Configuración</strong>, haz clic en <Badge variant="outline">Cambiar Preguntas de Seguridad</Badge></li>
                                        <li>Selecciona dos preguntas diferentes del listado</li>
                                        <li>Escribe las respuestas y guarda</li>
                                        <li className="text-muted-foreground italic">Las preguntas se usan para recuperar tu contraseña en caso de olvido</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Eliminar Cuenta
                                    </CardTitle>
                                    <CardDescription>Solicitar la eliminación de tu cuenta</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">En Configuración puedes solicitar la eliminación de tu cuenta. Esta acción requiere confirmación y desactivará tu acceso al sistema.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: RESPALDO BASE DE DATOS */}
                {/* ============================================================ */}
                <AccordionItem value="respaldo" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Respaldo de Base de Datos</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="h-4 w-4" />
                                        Realizar Respaldos
                                    </CardTitle>
                                    <CardDescription>Generar copias de seguridad de la base de datos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>La sección <strong>Respaldo Base de Datos</strong> permite generar copias de seguridad completas de la base de datos MySQL.</p>
                                        <ol className="list-decimal list-inside space-y-2 ml-4">
                                            <li>Haz clic en <Badge>Generar Respaldo</Badge></li>
                                            <li>Se creará un archivo .sql con toda la información del sistema</li>
                                            <li>El archivo se descargará automáticamente</li>
                                        </ol>
                                        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                            <p className="text-xs text-amber-900 dark:text-amber-100">
                                                ⚠️ Solo disponible para usuarios con rol de administrador. Se recomienda realizar respaldos periódicamente.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ============================================================ */}
                {/* SECCIÓN: CONSEJOS Y MEJORES PRÁCTICAS */}
                {/* ============================================================ */}
                <AccordionItem value="consejos" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Consejos y Mejores Prácticas</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Organización del Inventario</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>Usa nombres descriptivos y consistentes para facilitar las búsquedas</li>
                                        <li>Mantén actualizado el estado de los elementos para reflejar su condición real</li>
                                        <li>Registra la ubicación física de cada elemento (escritorio asignado)</li>
                                        <li>Los códigos son únicos y no se pueden modificar después de crear el elemento</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Canibalización</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>Usa la bitácora para gestionar el ciclo de vida: Dañado → Reconstruido/Reincorporado</li>
                                        <li>Revisa la pestaña Faltantes para identificar qué necesita cada computador</li>
                                        <li>Los movimientos de canibalización quedan registrados automáticamente en la trazabilidad</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Búsqueda Eficiente</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>Utiliza la barra de búsqueda para encontrar elementos rápidamente</li>
                                        <li>Combina búsqueda con filtros para resultados más precisos</li>
                                        <li>Usa la paginación para navegar grandes listas de elementos</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Reportes y Exportación</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>Genera reportes periódicos para mantener un registro del inventario</li>
                                        <li>Exporta reportes antes de realizar cambios masivos como respaldo</li>
                                        <li>Usa filtros de fecha para generar reportes mensuales o trimestrales</li>
                                        <li>El reporte de trazabilidad unifica cambios de estado, asignaciones y canibalizaciones</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Respaldo y Seguridad</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>Realiza respaldos de la base de datos regularmente</li>
                                        <li>Configura preguntas de seguridad para poder recuperar tu contraseña</li>
                                        <li>Los usuarios visualizadores (viewer) no pueden modificar datos — ideales para consultas</li>
                                        <li>Revisa el Dashboard para ver los movimientos recientes del inventario</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
}
