import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Monitor,
    Armchair,
    Mouse,
    LayoutTemplate,
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
} from 'lucide-react';

export function HelpPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Centro de Ayuda</h2>
                <p className="text-muted-foreground">
                    Guía completa para gestionar el inventario, categorías y reportes del sistema
                </p>
            </div>

            <Accordion collapsible className="w-full space-y-4 mb-10">
                {/* Sección: Diccionario de Prefijos */}
                <AccordionItem value="prefijos" className=" border rounded-lg px-4">
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
                                        Los prefijos son códigos cortos que identifican el tipo de item en el sistema
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>
                                            Cada item en el inventario tiene un código único que comienza con un
                                            prefijo. Este prefijo identifica el tipo de item y se usa para generar
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
                                            <Badge variant="outline" className="font-mono text-base px-3 py-1">
                                                COMP
                                            </Badge>
                                            <span className="text-muted-foreground">= Computador</span>
                                        </div>
                                        <p>
                                            El prefijo <strong>COMP</strong> se utiliza para identificar todos los
                                            computadores en el inventario, ya sean laptops o computadores de escritorio.
                                        </p>
                                        <div className="bg-muted/50 p-3 rounded-lg mt-3">
                                            <p className="text-xs font-medium mb-2">Ejemplos de códigos:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                                <li>
                                                    <code className="bg-background px-1 py-0.5 rounded">
                                                        COMP-A3B2C
                                                    </code>{' '}
                                                    - Un computador
                                                </li>
                                                <li>
                                                    <code className="bg-background px-1 py-0.5 rounded">
                                                        COMP-X9Y8Z
                                                    </code>{' '}
                                                    - Otro computador
                                                </li>
                                            </ul>
                                        </div>
                                        <p className="text-muted-foreground italic text-xs mt-3">
                                            💡 <strong>Nota:</strong> Todos los computadores en el sistema tienen
                                            códigos que comienzan con "COMP-", seguido de un identificador único de 5
                                            caracteres alfanuméricos.
                                        </p>
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
                                        Prefijo utilizado para identificar escritorios en el sistema
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="outline" className="font-mono text-base px-3 py-1">
                                                ESC
                                            </Badge>
                                            <span className="text-muted-foreground">= Escritorio</span>
                                        </div>
                                        <p>
                                            El prefijo <strong>ESC</strong> se utiliza para identificar todos los
                                            escritorios o mesas de trabajo en el inventario.
                                        </p>
                                        <div className="bg-muted/50 p-3 rounded-lg mt-3">
                                            <p className="text-xs font-medium mb-2">Ejemplos de códigos:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                                                <li>
                                                    <code className="bg-background px-1 py-0.5 rounded">ESC-M5N4O</code>{' '}
                                                    - Un escritorio
                                                </li>
                                                <li>
                                                    <code className="bg-background px-1 py-0.5 rounded">ESC-P2Q1R</code>{' '}
                                                    - Otro escritorio
                                                </li>
                                            </ul>
                                        </div>
                                        <p className="text-muted-foreground italic text-xs mt-3">
                                            💡 <strong>Nota:</strong> Todos los escritorios en el sistema tienen códigos
                                            que comienzan con "ESC-", seguido de un identificador único de 5 caracteres
                                            alfanuméricos. Un escritorio puede tener asignado un computador y varios
                                            accesorios.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        Prefijos de Accesorios
                                    </CardTitle>
                                    <CardDescription>
                                        Los accesorios usan prefijos definidos por sus categorías
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>
                                            A diferencia de los computadores y escritorios, los accesorios no tienen un
                                            prefijo fijo. En su lugar, cada accesorio usa el prefijo de su categoría
                                            asociada.
                                        </p>
                                        <p>
                                            Por ejemplo, si una categoría tiene el prefijo{' '}
                                            <code className="bg-muted px-1 py-0.5 rounded">MON</code> (para Monitores),
                                            todos los accesorios de esa categoría tendrán códigos que comienzan con{' '}
                                            <code className="bg-muted px-1 py-0.5 rounded">MON-</code>.
                                        </p>
                                        <p className="text-muted-foreground italic text-xs mt-3">
                                            💡 <strong>Tip:</strong> Puedes ver y gestionar los prefijos de las
                                            categorías en la sección <strong>Categorías</strong> del menú lateral.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sección: Dashboard */}
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
                                            <li>
                                                <strong>Tarjetas de Resumen:</strong> Muestra el total de computadores,
                                                escritorios y accesorios en el inventario
                                            </li>
                                            <li>
                                                <strong>Gráfico de Distribución:</strong> Visualización de la
                                                distribución de items por estado
                                            </li>
                                            <li>
                                                <strong>Movimientos Recientes:</strong> Registro de actividades de la
                                                última semana
                                            </li>
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
                                        <p>
                                            El sistema registra automáticamente todas las actividades realizadas en el
                                            inventario:
                                        </p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>
                                                <strong>Creaciones:</strong> Cuando se agrega un nuevo computador,
                                                escritorio, accesorio o categoría
                                            </li>
                                            <li>
                                                <strong>Actualizaciones:</strong> Cuando se modifica la información de
                                                cualquier item
                                            </li>
                                            <li>
                                                <strong>Eliminaciones:</strong> Cuando se elimina un item del inventario
                                            </li>
                                        </ul>
                                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                            <p className="text-xs text-muted-foreground">
                                                💡 <strong>Nota:</strong> El registro de actividades muestra las
                                                operaciones de los últimos 7 días. Cada actividad incluye el tipo de
                                                item, la acción realizada, el código y la fecha/hora de la operación.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Interpretar las Actividades Recientes
                                    </CardTitle>
                                    <CardDescription>
                                        Cómo leer y entender el registro de movimientos en el Dashboard
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>Cada actividad en el registro muestra:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>
                                                <strong>Ícono y Color:</strong> Indica el tipo de item (computador,
                                                escritorio, accesorio o categoría)
                                            </li>
                                            <li>
                                                <strong>Acción:</strong> Muestra si fue creado, actualizado o eliminado
                                            </li>
                                            <li>
                                                <strong>Código:</strong> El código único del item afectado
                                            </li>
                                            <li>
                                                <strong>Nombre:</strong> El nombre o título del item
                                            </li>
                                            <li>
                                                <strong>Fecha y Hora:</strong> Cuándo se realizó la operación
                                            </li>
                                        </ul>
                                        <p className="mt-3 text-muted-foreground italic">
                                            Este registro te permite mantener un historial completo de todos los cambios
                                            realizados en el sistema.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sección: Inventario - Computadores */}
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
                                    <CardDescription>
                                        Pasos para agregar un nuevo computador al inventario
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>
                                            Navega a la sección <strong>Inventario → Computadores</strong>
                                        </li>
                                        <li>
                                            Haz clic en el botón <Badge variant="outline">Agregar Computador</Badge>{' '}
                                            ubicado en la esquina superior derecha
                                        </li>
                                        <li>
                                            Completa el formulario con la información requerida:
                                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                                                <li>
                                                    <strong>Pestaña General:</strong> Nombre, código, estado, ubicación,
                                                    etc.
                                                </li>
                                                <li>
                                                    <strong>Pestaña Especificaciones:</strong> Procesador, RAM,
                                                    almacenamiento, etc.
                                                </li>
                                                <li>
                                                    <strong>Pestaña Accesorios:</strong> Asigna accesorios relacionados
                                                    si es necesario
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            Verifica que todos los campos obligatorios estén completos (marcados con{' '}
                                            <span className="text-destructive">*</span>)
                                        </li>
                                        <li>
                                            Haz clic en <Badge>Guardar</Badge> para agregar el computador al inventario
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Actualizar un Computador
                                    </CardTitle>
                                    <CardDescription>
                                        Cómo modificar la información de un computador existente
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>En la tabla de computadores, localiza el registro que deseas modificar</li>
                                        <li>
                                            Haz clic en el botón{' '}
                                            <Badge variant="outline" className="gap-1">
                                                <Pencil className="h-3 w-3" /> Editar
                                            </Badge>{' '}
                                            en la columna de acciones
                                        </li>
                                        <li>Modifica los campos que necesites actualizar</li>
                                        <li>
                                            Haz clic en <Badge>Guardar Cambios</Badge> para aplicar las modificaciones
                                        </li>
                                        <li className="text-muted-foreground italic">
                                            Nota: El código del computador no puede ser modificado una vez creado
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Eliminar un Computador
                                    </CardTitle>
                                    <CardDescription>
                                        Proceso para eliminar un computador del inventario
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Localiza el computador en la tabla</li>
                                        <li>
                                            Haz clic en el botón{' '}
                                            <Badge variant="destructive" className="gap-1">
                                                <Trash2 className="h-3 w-3" /> Eliminar
                                            </Badge>
                                        </li>
                                        <li>Confirma la eliminación en el diálogo de confirmación</li>
                                        <li className="text-destructive font-medium">
                                            ⚠️ Advertencia: Esta acción no se puede deshacer
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Ver Detalles de un Computador
                                    </CardTitle>
                                    <CardDescription>Consulta la información completa de un computador</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>
                                            En la tabla, haz clic en el botón{' '}
                                            <Badge variant="outline" className="gap-1">
                                                <Eye className="h-3 w-3" /> Ver
                                            </Badge>
                                        </li>
                                        <li>Se abrirá un diálogo con toda la información del computador</li>
                                        <li>
                                            Puedes revisar todas las especificaciones, accesorios asignados y estado
                                            actual
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Search className="h-4 w-4" />
                                        Buscar y Filtrar Computadores
                                    </CardTitle>
                                    <CardDescription>
                                        Herramientas para encontrar computadores específicos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>
                                            Usa la barra de búsqueda para buscar por nombre, código o cualquier campo
                                        </li>
                                        <li>
                                            Aplica filtros por estado, ubicación o categoría usando los controles de
                                            filtrado
                                        </li>
                                        <li>Ordena la tabla haciendo clic en los encabezados de las columnas</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sección: Inventario - Escritorios */}
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
                                    <CardDescription>
                                        Pasos para agregar un nuevo escritorio al inventario
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>
                                            Navega a la sección <strong>Inventario → Escritorios</strong>
                                        </li>
                                        <li>
                                            Haz clic en el botón <Badge variant="outline">Agregar Escritorio</Badge>
                                        </li>
                                        <li>
                                            Completa el formulario con la información del escritorio:
                                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                                                <li>Nombre o descripción del escritorio</li>
                                                <li>Código único (se genera automáticamente si no se especifica)</li>
                                                <li>Estado (Bueno, Repuesto, Dañado)</li>
                                                <li>Ubicación física</li>
                                                <li>Fecha de registro</li>
                                            </ul>
                                        </li>
                                        <li>
                                            Haz clic en <Badge>Guardar</Badge> para agregar el escritorio
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Actualizar un Escritorio
                                    </CardTitle>
                                    <CardDescription>Modificar información de un escritorio existente</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Localiza el escritorio en la tabla</li>
                                        <li>
                                            Haz clic en{' '}
                                            <Badge variant="outline" className="gap-1">
                                                <Pencil className="h-3 w-3" /> Editar
                                            </Badge>
                                        </li>
                                        <li>Modifica los campos necesarios</li>
                                        <li>
                                            Guarda los cambios con <Badge>Guardar Cambios</Badge>
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Eliminar un Escritorio
                                    </CardTitle>
                                    <CardDescription>Eliminar un escritorio del inventario</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Encuentra el escritorio en la tabla</li>
                                        <li>
                                            Haz clic en{' '}
                                            <Badge variant="destructive" className="gap-1">
                                                <Trash2 className="h-3 w-3" /> Eliminar
                                            </Badge>
                                        </li>
                                        <li>Confirma la eliminación</li>
                                        <li className="text-destructive font-medium">⚠️ Esta acción es permanente</li>
                                    </ol>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sección: Inventario - Accesorios */}
                <AccordionItem value="accesorios" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Mouse className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Gestión de Accesorios</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear un Accesorio
                                    </CardTitle>
                                    <CardDescription>Agregar un nuevo accesorio al catálogo</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>
                                            Ve a <strong>Inventario → Accesorios</strong>
                                        </li>
                                        <li>
                                            Haz clic en <Badge variant="outline">Agregar Accesorio</Badge>
                                        </li>
                                        <li>
                                            Completa el formulario:
                                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                                                <li>Nombre del accesorio</li>
                                                <li>Categoría (debe existir previamente)</li>
                                                <li>Estado (Disponible, Asignado, etc.)</li>
                                                <li>Ubicación</li>
                                                <li>Fecha de registro</li>
                                            </ul>
                                        </li>
                                        <li>El código se generará automáticamente basado en la categoría</li>
                                        <li>
                                            Guarda el accesorio con <Badge>Guardar</Badge>
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Actualizar un Accesorio
                                    </CardTitle>
                                    <CardDescription>Modificar información de accesorios</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Busca el accesorio en la tabla</li>
                                        <li>
                                            Haz clic en{' '}
                                            <Badge variant="outline" className="gap-1">
                                                <Pencil className="h-3 w-3" /> Editar
                                            </Badge>
                                        </li>
                                        <li>Actualiza los campos necesarios</li>
                                        <li>Guarda los cambios</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Eliminar un Accesorio
                                    </CardTitle>
                                    <CardDescription>Eliminar accesorios del inventario</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Localiza el accesorio a eliminar</li>
                                        <li>
                                            Haz clic en{' '}
                                            <Badge variant="destructive" className="gap-1">
                                                <Trash2 className="h-3 w-3" /> Eliminar
                                            </Badge>
                                        </li>
                                        <li>Confirma la eliminación</li>
                                    </ol>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sección: Categorías */}
                <AccordionItem value="categorias" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline cursor-pointer">
                        <div className="flex items-center gap-3">
                            <LayoutTemplate className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">Gestión de Categorías</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear una Categoría
                                    </CardTitle>
                                    <CardDescription>Pasos para crear una nueva categoría</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>
                                            Navega a la sección <strong>Categorías</strong> en el menú lateral
                                        </li>
                                        <li>
                                            Haz clic en el botón <Badge variant="outline">Agregar Categoría</Badge>
                                        </li>
                                        <li>
                                            Completa el formulario:
                                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                                                <li>
                                                    <strong>Nombre:</strong> Nombre descriptivo de la categoría (ej:
                                                    "Computadoras", "Monitores")
                                                </li>
                                                <li>
                                                    <strong>Prefijo:</strong> Código corto de hasta 5 caracteres (ej:
                                                    "COMP", "MON")
                                                </li>
                                            </ul>
                                        </li>
                                        <li>Verifica que el nombre y prefijo no existan ya en el sistema</li>
                                        <li>
                                            Haz clic en <Badge>Guardar Categoría</Badge>
                                        </li>
                                        <li className="text-muted-foreground italic">
                                            💡 Tip: El prefijo se usará para generar códigos automáticos de los
                                            accesorios
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Actualizar una Categoría
                                    </CardTitle>
                                    <CardDescription>Modificar información de categorías existentes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>En la vista de categorías, localiza la categoría que deseas editar</li>
                                        <li>
                                            Haz clic en el botón de editar (ícono de lápiz) en la tarjeta de la
                                            categoría
                                        </li>
                                        <li>Modifica el nombre o prefijo según sea necesario</li>
                                        <li>
                                            Haz clic en <Badge>Guardar Cambios</Badge>
                                        </li>
                                        <li className="text-muted-foreground italic">
                                            Nota: Asegúrate de que el nuevo nombre/prefijo no esté en uso
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        Actualizar Prefijo de Categoría
                                    </CardTitle>
                                    <CardDescription>
                                        Proceso especial cuando se modifica el prefijo de una categoría con accesorios
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>
                                            Cuando actualizas el prefijo de una categoría que tiene accesorios
                                            asociados, el sistema te mostrará un diálogo de confirmación especial:
                                        </p>
                                        <ol className="list-decimal list-inside space-y-2 ml-4">
                                            <li>
                                                Al intentar guardar un cambio de prefijo, el sistema detecta
                                                automáticamente si hay accesorios relacionados
                                            </li>
                                            <li>
                                                Se muestra un diálogo informativo que indica:
                                                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                                                    <li>El prefijo anterior y el nuevo prefijo</li>
                                                    <li>La cantidad de accesorios que se verán afectados</li>
                                                    <li>
                                                        Cómo cambiarán los códigos (de{' '}
                                                        <code className="bg-muted px-1 rounded">PREFIJO-XXXXX</code> a{' '}
                                                        <code className="bg-muted px-1 rounded">NUEVO-XXXXX</code>)
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                Puedes elegir:
                                                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                                                    <li>
                                                        <strong>Actualizar prefijos:</strong> Confirma y actualiza todos
                                                        los códigos de los accesorios relacionados
                                                    </li>
                                                    <li>
                                                        <strong>Cancelar:</strong> Vuelve al formulario sin realizar
                                                        cambios
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                Si confirmas, todos los códigos de los accesorios de esa categoría se
                                                actualizarán automáticamente con el nuevo prefijo
                                            </li>
                                        </ol>
                                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                            <p className="text-xs text-blue-900 dark:text-blue-100">
                                                ⚠️ <strong>Importante:</strong> Esta acción actualiza los códigos de
                                                todos los accesorios relacionados. Asegúrate de que el nuevo prefijo sea
                                                el correcto antes de confirmar.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Eliminar una Categoría
                                    </CardTitle>
                                    <CardDescription>Eliminar categorías del sistema</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>Localiza la categoría en la lista</li>
                                        <li>Haz clic en el botón de eliminar (ícono de papelera)</li>
                                        <li>Confirma la eliminación en el diálogo</li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Ver Detalles de una Categoría
                                    </CardTitle>
                                    <CardDescription>Consultar información de categorías</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>
                                            Haz clic en el botón de ver detalles (ícono de ojo) en la tarjeta de la
                                            categoría
                                        </li>
                                        <li>Se mostrará un diálogo con toda la información de la categoría</li>
                                        <li>Puedes ver el nombre, prefijo y estadísticas relacionadas</li>
                                    </ol>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sección: Reportes */}
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
                                        <Filter className="h-4 w-4" />
                                        Filtrar Reportes
                                    </CardTitle>
                                    <CardDescription>Usar filtros para personalizar tus reportes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <p>Puedes aplicar múltiples filtros para obtener reportes específicos:</p>
                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>
                                                <strong>Rango de Fechas:</strong> Selecciona un período (Hoy, Semana,
                                                Mes, Trimestre, Año, o Todos)
                                            </li>
                                            <li>
                                                <strong>Tipo de Item:</strong> Filtra por Computadores, Escritorios,
                                                Accesorios o Todos
                                            </li>
                                            <li>
                                                <strong>Estado:</strong> Filtra por estado específico (Bueno,
                                                Repuesto, Dañado, Disponible, Asignado)
                                            </li>
                                            <li>
                                                <strong>Categoría:</strong> Para accesorios, filtra por categoría
                                                específica
                                            </li>
                                            <li>
                                                <strong>Ordenar por:</strong> Ordena los resultados por Fecha, Nombre,
                                                Código o Estado
                                            </li>
                                        </ul>
                                        <p className="mt-3 text-muted-foreground italic">
                                            💡 Tip: Puedes combinar múltiples filtros para obtener reportes muy
                                            específicos
                                        </p>
                                    </div>
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
                                        <li>Aplica los filtros deseados para tu reporte</li>
                                        <li>Revisa las estadísticas y la tabla de resultados</li>
                                        <li>
                                            Haz clic en el botón{' '}
                                            <Badge className="gap-2">
                                                <Download className="h-4 w-4" /> Exportar PDF
                                            </Badge>
                                        </li>
                                        <li>
                                            El archivo PDF se descargará automáticamente con:
                                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                                                <li>Resumen de estadísticas</li>
                                                <li>Tabla completa con todos los items filtrados</li>
                                                <li>Información de los filtros aplicados</li>
                                                <li>Fecha y hora de generación</li>
                                            </ul>
                                        </li>
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
                                        <li>
                                            Haz clic en el botón{' '}
                                            <Badge variant="outline" className="gap-2">
                                                <FileSpreadsheet className="h-4 w-4" /> Exportar Excel
                                            </Badge>
                                        </li>
                                        <li>
                                            Se descargará un archivo Excel (.xlsx) con:
                                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-muted-foreground">
                                                <li>Todos los items filtrados en formato de tabla</li>
                                                <li>Columnas organizadas y formateadas</li>
                                                <li>Listo para análisis adicionales en Excel</li>
                                            </ul>
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Ver Estadísticas
                                    </CardTitle>
                                    <CardDescription>Consultar estadísticas en tiempo real</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            Las estadísticas se actualizan automáticamente según los filtros aplicados:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                                            <li>Total de items en el reporte</li>
                                            <li>Distribución por estado</li>
                                            <li>Distribución por tipo de item</li>
                                            <li>Items por categoría (para accesorios)</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        Limpiar Filtros
                                    </CardTitle>
                                    <CardDescription>
                                        Restablecer todos los filtros a valores por defecto
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        <li>
                                            Haz clic en el botón <Badge variant="outline">Limpiar Filtros</Badge>
                                        </li>
                                        <li>Todos los filtros volverán a sus valores por defecto</li>
                                        <li>El reporte mostrará todos los items sin filtros aplicados</li>
                                    </ol>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sección: Consejos Generales */}
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
                                        <li>
                                            Crea categorías antes de agregar accesorios para mantener una organización
                                            clara
                                        </li>
                                        <li>Usa nombres descriptivos y consistentes para facilitar las búsquedas</li>
                                        <li>
                                            Mantén actualizado el estado de los items para reflejar su condición real
                                        </li>
                                        <li>
                                            Registra la ubicación física de cada item para facilitar su localización
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Gestión de Códigos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>Los códigos se generan automáticamente basados en las categorías</li>
                                        <li>El prefijo de la categoría determina el código de los accesorios</li>
                                        <li>Los códigos son únicos y no pueden modificarse después de crear el item</li>
                                        <li>Usa prefijos cortos y significativos (máximo 5 caracteres)</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Búsqueda Eficiente</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>Utiliza la barra de búsqueda para encontrar items rápidamente</li>
                                        <li>Combina búsqueda con filtros para resultados más precisos</li>
                                        <li>
                                            Los filtros se pueden aplicar en cualquier momento sin perder la búsqueda
                                        </li>
                                        <li>Usa la paginación para navegar grandes listas de items</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Reportes Regulares</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>Genera reportes periódicos para mantener un registro del inventario</li>
                                        <li>Exporta reportes antes de realizar cambios masivos como respaldo</li>
                                        <li>Usa filtros de fecha para generar reportes mensuales o trimestrales</li>
                                        <li>Comparte los reportes PDF o Excel con tu equipo según sea necesario</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Sistema de Registro de Actividades</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        <li>
                                            Todas las operaciones (crear, actualizar, eliminar) se registran
                                            automáticamente en el sistema
                                        </li>
                                        <li>
                                            Revisa el Dashboard regularmente para ver los movimientos recientes del
                                            inventario
                                        </li>
                                        <li>
                                            El registro de actividades muestra las operaciones de los últimos 7 días
                                        </li>
                                        <li>
                                            Usa este registro para rastrear cambios y mantener un historial completo de
                                            las operaciones
                                        </li>
                                        <li>
                                            El registro incluye información detallada: tipo de item, acción realizada,
                                            código y fecha/hora
                                        </li>
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
