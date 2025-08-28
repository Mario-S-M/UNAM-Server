'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Search, Settings, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    return result;
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    throw error;
  }
};

interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
  assignedLanguageId?: string;
}

interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

type UserFormData = {
  email: string;
  fullName: string;
  password?: string;
  roles: string[];
  isActive: boolean;
};

interface UserColumnVisibility {
  email: boolean;
  fullName: boolean;
  roles: boolean;
  isActive: boolean;
  assignedLanguageId: boolean;
  actions: boolean;
}

const ROLES = [
  { value: 'superUser', label: 'Super Usuario' },
  { value: 'admin', label: 'Administrador' },
  { value: 'docente', label: 'Profesor' },
  { value: 'alumno', label: 'Estudiante' },
  { value: 'mortal', label: 'Usuario' },
];

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<PaginatedUsers>({
    users: [],
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    fullName: '',
    password: '',
    roles: ['mortal'],
    isActive: true,
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = useState<UserColumnVisibility>({
    email: true,
    fullName: true,
    roles: true,
    isActive: true,
    assignedLanguageId: false,
    actions: true,
  });

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const query = `
        query GetUsersPaginated($search: String, $page: Int, $limit: Int, $roles: [ValidRoles!], $isActive: Boolean) {
          usersPaginated(search: $search, page: $page, limit: $limit, roles: $roles, isActive: $isActive) {
            users {
              id
              email
              fullName
              roles
              isActive
              assignedLanguageId
            }
            total
            page
            limit
            totalPages
            hasNextPage
            hasPreviousPage
          }
        }
      `;
      
      const variables = {
        search: search || undefined,
        page: currentPage,
        limit: pageSize,
        roles: roleFilter ? [roleFilter] : undefined,
        isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
      };
      
      const response = await fetchGraphQL(query, variables, token);
      setUsers(response.data?.usersPaginated || {
        users: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [token, search, currentPage, pageSize, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const toggleColumnVisibility = (column: keyof UserColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      fullName: '',
      password: '',
      roles: ['alumno'],
      isActive: true,
    });
    setEditingUser(null);
  };

  const handleCreateUser = async () => {
    if (!token) return;
    
    try {
      const mutation = `
        mutation CreateUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            id
            email
            fullName
            roles
            isActive
          }
        }
      `;
      
      await fetchGraphQL(mutation, {
        createUserInput: {
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          roles: formData.roles,
          isActive: formData.isActive,
        }
      }, token);
      
      toast.success('Usuario creado exitosamente');
      setIsDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear usuario');
    }
  };

  const handleUpdateUser = async () => {
    if (!token || !editingUser) return;
    
    try {
      // 1. Actualizar campos básicos (email, fullName)
      if (formData.email !== editingUser.email || formData.fullName !== editingUser.fullName) {
        const updateUserMutation = `
          mutation UpdateUser($updateUserInput: UpdateUserInput!) {
            updateUser(updateUserInput: $updateUserInput) {
              id
              email
              fullName
              roles
              isActive
            }
          }
        `;
        
        await fetchGraphQL(updateUserMutation, {
          updateUserInput: {
            id: editingUser.id,
            email: formData.email,
            fullName: formData.fullName,
          }
        }, token);
      }

      // 2. Actualizar roles si han cambiado
      if (JSON.stringify(formData.roles) !== JSON.stringify(editingUser.roles)) {
        const updateRolesMutation = `
          mutation UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
            updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
              id
              email
              fullName
              roles
              isActive
            }
          }
        `;
        
        await fetchGraphQL(updateRolesMutation, {
          updateUserRolesInput: {
            id: editingUser.id,
            roles: formData.roles,
          }
        }, token);
      }

      // 3. Actualizar estado activo si ha cambiado
      if (formData.isActive !== editingUser.isActive) {
        const blockUserMutation = `
          mutation BlockUser($id: ID!) {
            blockUser(id: $id) {
              id
              email
              fullName
              roles
              isActive
            }
          }
        `;
        
        await fetchGraphQL(blockUserMutation, {
          id: editingUser.id,
        }, token);
      }
      
      toast.success('Usuario actualizado exitosamente');
      setIsDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    
    try {
      const mutation = `
        mutation RemoveUser($id: ID!) {
          removeUser(id: $id) {
            id
          }
        }
      `;
      
      await fetchGraphQL(mutation, { id: userId }, token);
      toast.success('Usuario eliminado exitosamente');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      fullName: user.fullName,
      roles: user.roles.length > 0 ? user.roles : ['mortal'],
      isActive: user.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.fullName) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    // Asegurar que siempre haya un rol seleccionado, por defecto 'mortal'
    if (formData.roles.length === 0) {
      setFormData(prev => ({ ...prev, roles: ['mortal'] }));
    }

    if (!editingUser && !formData.password) {
      toast.error('La contraseña es requerida para nuevos usuarios');
      return;
    }
    
    if (editingUser) {
      handleUpdateUser();
    } else {
      handleCreateUser();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administra los usuarios del sistema
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser ? 'Modifica los datos del usuario.' : 'Completa los datos para crear un nuevo usuario.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fullName" className="text-right">
                        Nombre Completo
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="col-span-3"
                        required
                      />
                    </div>
                    {!editingUser && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Contraseña
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="col-span-3"
                          required
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">
                        Rol
                      </Label>
                      <div className="col-span-3">
                        <RadioGroup
                          value={formData.roles[0] || 'mortal'}
                          onValueChange={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              roles: [value]
                            }));
                          }}
                        >
                          {ROLES.map((role) => (
                            <div key={role.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={role.value} id={`role-${role.value}`} />
                              <Label htmlFor={`role-${role.value}`} className="text-sm">
                                {role.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="isActive" className="text-right">
                        Estado
                      </Label>
                      <div className="col-span-3 flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="isActive" className="text-sm">
                          {formData.isActive ? 'Activo' : 'Inactivo'}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingUser ? 'Actualizar' : 'Crear'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6 pt-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <div className="p-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Rol</div>
                      <Select value={roleFilter || 'all'} onValueChange={(value) => setRoleFilter(value === 'all' ? undefined : value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los roles</SelectItem>
                          {ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="text-sm font-medium">Estado</div>
                      <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? undefined : value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          <SelectItem value="active">Activos</SelectItem>
                          <SelectItem value="inactive">Inactivos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Select value={pageSize.toString()} onValueChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Columnas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.email}
                    onCheckedChange={() => toggleColumnVisibility('email')}
                  >
                    Email
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.fullName}
                    onCheckedChange={() => toggleColumnVisibility('fullName')}
                  >
                    Nombre Completo
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.roles}
                    onCheckedChange={() => toggleColumnVisibility('roles')}
                  >
                    Roles
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.isActive}
                    onCheckedChange={() => toggleColumnVisibility('isActive')}
                  >
                    Estado
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.assignedLanguageId}
                    onCheckedChange={() => toggleColumnVisibility('assignedLanguageId')}
                  >
                    Idioma Asignado
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columnVisibility.email && <TableHead className="text-center">Email</TableHead>}
                  {columnVisibility.fullName && <TableHead className="text-center">Nombre Completo</TableHead>}
                  {columnVisibility.roles && <TableHead className="text-center">Roles</TableHead>}
                  {columnVisibility.isActive && <TableHead className="text-center">Estado</TableHead>}
                  {columnVisibility.assignedLanguageId && <TableHead className="text-center">Idioma Asignado</TableHead>}
                  {columnVisibility.actions && <TableHead className="text-center">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Cargando usuarios...
                    </TableCell>
                  </TableRow>
                ) : users.users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  users.users.map((user) => (
                    <TableRow key={user.id}>
                      {columnVisibility.email && <TableCell className="text-center">{user.email}</TableCell>}
                      {columnVisibility.fullName && <TableCell className="text-center">{user.fullName}</TableCell>}
                      {columnVisibility.roles && (
                        <TableCell className="text-center">
                          <div className="flex gap-1 justify-center">
                            {user.roles.map((role, index) => (
                              <Badge key={index} variant="secondary">
                                {ROLES.find(r => r.value === role)?.label || role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.isActive && (
                        <TableCell className="text-center">
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.assignedLanguageId && (
                        <TableCell className="text-center">{user.assignedLanguageId || 'N/A'}</TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el usuario.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {((users.page - 1) * users.limit) + 1} a{' '}
              {Math.min(users.page * users.limit, users.total)} de {users.total} usuarios
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(users.page - 1)}
                disabled={!users.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: users.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const current = users.page;
                    return page === 1 || page === users.totalPages || (page >= current - 1 && page <= current + 1);
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2">...</span>}
                        <Button
                          variant={page === users.page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(users.page + 1)}
                disabled={!users.hasNextPage}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}