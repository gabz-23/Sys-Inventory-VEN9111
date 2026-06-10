import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Shield, ShieldOff, Trash2, KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CreateUserDialog } from './dialogs/CreateUserDialog';
import { ResetPasswordDialog } from './dialogs/ResetPasswordDialog';
import { ConfirmDeleteDialog } from './dialogs/ConfirmDeleteDialog';

const ITEMS_PER_PAGE = 10;

export const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [resetPasswordUser, setResetPasswordUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [updatingUsers, setUpdatingUsers] = useState({});

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await window.electronAPI.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        const query = searchQuery.toLowerCase().trim();
        return users.filter(
            (u) =>
                u.firstName?.toLowerCase().includes(query) ||
                u.username?.toLowerCase().includes(query) ||
                u.cedula?.includes(query)
        );
    }, [users, searchQuery]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleToggleActive = async (user) => {
        setUpdatingUsers((prev) => ({ ...prev, [user.id]: true }));
        try {
            await window.electronAPI.adminUpdateUser({
                userId: user.id,
                data: { active: !user.active },
            });
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, active: !u.active } : u))
            );
        } catch (err) {
            console.error('Error al cambiar estado:', err);
        } finally {
            setUpdatingUsers((prev) => ({ ...prev, [user.id]: false }));
        }
    };

    const handleChangeRole = async (user, newRole) => {
        setUpdatingUsers((prev) => ({ ...prev, [user.id]: true }));
        try {
            await window.electronAPI.adminUpdateUser({
                userId: user.id,
                data: { role: newRole },
            });
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            console.error('Error al cambiar rol:', err);
        } finally {
            setUpdatingUsers((prev) => ({ ...prev, [user.id]: false }));
        }
    };

    const handlePasswordResetSuccess = () => {
        setResetPasswordUser(null);
    };

    const handleDeleteSuccess = () => {
        setDeleteUser(null);
        loadUsers();
    };

    const handleCreateSuccess = () => {
        loadUsers();
    };

    const roleBadgeVariant = (role) => (role === 'admin' ? 'default' : 'secondary');
    const roleLabel = (role) => (role === 'admin' ? 'Admin' : 'Visualizador');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h2>
                    <p className="text-muted-foreground">
                        Administra los usuarios del sistema. Puedes crear, modificar roles, restablecer contraseñas y
                        eliminar cuentas.
                    </p>
                </div>
                <div className="shrink-0">
                    <CreateUserDialog
                        open={createDialogOpen}
                        onOpenChange={setCreateDialogOpen}
                        onSuccess={handleCreateSuccess}
                    />
                    {!createDialogOpen && (
                        <Button onClick={() => setCreateDialogOpen(true)} className="cursor-pointer">
                            <Plus className="mr-1 h-4 w-4" />
                            Crear Usuario
                        </Button>
                    )}
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Buscar por nombre, usuario o cédula..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-[350px] pl-9"
                />
            </div>

            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Cédula</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Cargando usuarios...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginatedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    {searchQuery
                                        ? 'No se encontraron usuarios con ese criterio de búsqueda.'
                                        : 'No hay usuarios registrados.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedUsers.map((user) => (
                                <TableRow key={user.id} className={!user.active ? 'opacity-60' : ''}>
                                    <TableCell className="font-medium">{user.firstName}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.cedula}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.role}
                                            onValueChange={(value) => handleChangeRole(user, value)}
                                            disabled={updatingUsers[user.id]}
                                        >
                                            <SelectTrigger className="w-[140px] h-8 cursor-pointer">
                                                <SelectValue>
                                                    <Badge variant={roleBadgeVariant(user.role)}>
                                                        {roleLabel(user.role)}
                                                    </Badge>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem className="cursor-pointer" value="admin">
                                                    Administrador
                                                </SelectItem>
                                                <SelectItem className="cursor-pointer" value="viewer">
                                                    Visualizador
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={user.active}
                                                onCheckedChange={() => handleToggleActive(user)}
                                                disabled={updatingUsers[user.id]}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {user.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="cursor-pointer"
                                                title="Restablecer contraseña"
                                                onClick={() => setResetPasswordUser(user)}
                                            >
                                                <KeyRound className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="cursor-pointer text-destructive hover:text-destructive"
                                                title="Eliminar usuario"
                                                onClick={() => setDeleteUser(user)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Mostrando {paginatedUsers.length} de {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="cursor-pointer"
                        >
                            Anterior
                        </Button>
                        <span className="text-sm text-muted-foreground px-2">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="cursor-pointer"
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            )}

            <ResetPasswordDialog
                open={!!resetPasswordUser}
                onOpenChange={() => setResetPasswordUser(null)}
                user={resetPasswordUser}
                onSuccess={handlePasswordResetSuccess}
            />

            <ConfirmDeleteDialog
                open={!!deleteUser}
                onOpenChange={() => setDeleteUser(null)}
                user={deleteUser}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
};