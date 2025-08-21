'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Users, Search, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { EditUserDialog, useEditUser, User, PaginatedUsers, Language, UserColumnVisibility } from '@/users';

// GraphQL Queries and Mutations
const GET_USERS_PAGINATED = `
  query GetUsersPaginated($search: String, $page: Int, $limit: Int, $roles: [ValidRoles!], $assignedLanguageId: ID) {
    usersPaginated(search: $search, page: $page, limit: $limit, roles: $roles, assignedLanguageId: $assignedLanguageId) {
      users {
        id
        fullName
        email
        roles
        isActive
        assignedLanguageId
        assignedLanguage {
          id
          name
        }
        assignedLanguages {
          id
          name
        }
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

const GET_LANGUAGES = `
  query GetLanguages {
    lenguagesActivate {
      id
      name
    }
  }
`;

const UPDATE_USER = `
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      fullName
      email
      roles
      isActive
      assignedLanguageId
      assignedLanguage {
        id
        name
      }
    }
  }
`;

const UPDATE_USER_ROLES = `
  mutation UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
    updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
      id
      fullName
      email
      roles
      isActive
      assignedLanguageId
      assignedLanguage {
        id
        name
      }
    }
  }
`;

const DELETE_USER = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      fullName
      email
    }
  }
`;

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

// Toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 p-4 rounded-md text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};

// GraphQL fetch function
const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    return result.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

// Types are now imported from the users component

export default function UsuariosPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<UserColumnVisibility>({
    fullName: true,
    email: true,
    roles: true,
    assignedLanguage: true,
    isActive: true,
    actions: true,
  });

  // Delete user state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);



  // Load languages
  const loadLanguages = useCallback(async () => {
    if (!token) return;
    
    try {
      const data = await fetchGraphQL(GET_LANGUAGES, {}, token);
      setLanguages(data.lenguagesActivate || []);
    } catch (error) {
      console.error('Error loading languages:', error);
      showToast('Error al cargar idiomas', 'error');
    }
  }, [token]);

  // Load users
  const loadUsers = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const variables: GraphQLVariables = {
        search: searchTerm || undefined,
        page: currentPage,
        limit: itemsPerPage,
        roles: selectedRole !== 'all' ? [selectedRole.toUpperCase()] : undefined,
        assignedLanguageId: selectedLanguage !== 'all' ? selectedLanguage : undefined,
      };

      const data = await fetchGraphQL(GET_USERS_PAGINATED, variables, token);
      const paginatedData = data.usersPaginated as PaginatedUsers;
      
      setUsers(paginatedData.users);
      setTotalPages(paginatedData.totalPages);
      setTotalItems(paginatedData.total);
      setHasNextPage(paginatedData.hasNextPage);
      setHasPreviousPage(paginatedData.hasPreviousPage);
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, searchTerm, currentPage, itemsPerPage, selectedRole, selectedLanguage]);

  // Effects
  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Edit user functionality
  const {
    editingUser,
    editDialogOpen,
    editFormData,
    editLoading,
    handleEditUser,
    handleSaveUser,
    setEditDialogOpen,
    setEditFormData
  } = useEditUser({ 
     onUserUpdated: loadUsers,
     showToast,
     fetchGraphQL,
     token: token || undefined,
     UPDATE_USER,
     UPDATE_USER_ROLES
   });

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle role filter
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  // Handle language filter
  const handleLanguageFilter = (languageId: string) => {
    setSelectedLanguage(languageId);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column: keyof UserColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Get role badge color
  const getRoleBadgeColor = (roles: string[]) => {
    if (roles.includes('superUser')) return 'bg-purple-100 text-purple-800';
    if (roles.includes('admin')) return 'bg-red-100 text-red-800';
    if (roles.includes('docente')) return 'bg-blue-100 text-blue-800';
    if (roles.includes('alumno')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Get role display name
  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      superUser: 'Super Usuario',
      admin: 'Administrador',
      docente: 'Docente',
      alumno: 'Alumno',
      mortal: 'Usuario'
    };
    return roleNames[role] || role;
  };

  // Handle delete user
  const handleDeleteUser = async (userToDelete: User) => {
    if (!token) return;
    
    try {
      await fetchGraphQL(DELETE_USER, { id: userToDelete.id }, token);
      showToast(`Usuario ${userToDelete.fullName} eliminado exitosamente`, 'success');
      setUserToDelete(null);
      loadUsers(); // Reload the user list
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Error al eliminar usuario', 'error');
    }
  };





  if (!user || !['admin', 'superUser'].includes(user.roles[0])) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Usuarios
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {/* Search and Filters */}
          <div className="flex items-center justify-between gap-4 mb-6 pt-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={selectedRole} onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="superUser">Super Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="docente">Docente</SelectItem>
                  <SelectItem value="alumno">Alumno</SelectItem>
                  <SelectItem value="mortal">Usuario</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLanguage} onValueChange={handleLanguageFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los idiomas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los idiomas</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Columnas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(columnVisibility).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={() => toggleColumnVisibility(key as keyof UserColumnVisibility)}
                  >
                    {key === 'fullName' && 'Nombre Completo'}
                    {key === 'email' && 'Email'}
                    {key === 'roles' && 'Roles'}
                    {key === 'assignedLanguage' && 'Idioma Asignado'}
                    {key === 'isActive' && 'Estado'}
                    {key === 'actions' && 'Acciones'}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columnVisibility.fullName && (
                    <TableHead>Nombre Completo</TableHead>
                  )}
                  {columnVisibility.email && (
                    <TableHead>Email</TableHead>
                  )}
                  {columnVisibility.roles && (
                    <TableHead>Roles</TableHead>
                  )}
                  {columnVisibility.assignedLanguage && (
                    <TableHead>Idioma Asignado</TableHead>
                  )}
                  {columnVisibility.isActive && (
                    <TableHead>Estado</TableHead>
                  )}
                  {columnVisibility.actions && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Cargando usuarios...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No se encontraron usuarios</p>
                        <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((tableUser) => (
                    <TableRow key={tableUser.id}>
                      {columnVisibility.fullName && (
                        <TableCell className="font-medium">
                          {tableUser.fullName}
                        </TableCell>
                      )}
                      {columnVisibility.email && (
                        <TableCell>{tableUser.email}</TableCell>
                      )}
                      {columnVisibility.roles && (
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {tableUser.roles.map((role, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className={getRoleBadgeColor(tableUser.roles)}
                              >
                                {getRoleDisplayName(role)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.assignedLanguage && (
                        <TableCell>
                          {tableUser.assignedLanguage ? (
                            <Badge variant="outline">
                              {tableUser.assignedLanguage.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Sin asignar</span>
                          )}
                        </TableCell>
                      )}
                      {columnVisibility.isActive && (
                        <TableCell>
                          <Badge
                            variant={tableUser.isActive ? "default" : "secondary"}
                            className={tableUser.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {tableUser.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(tableUser)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user?.roles?.includes('superUser') && tableUser.id !== user?.id && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => setUserToDelete(tableUser)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario
                                      <strong> {tableUser.fullName}</strong> y todos sus datos asociados.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(tableUser)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
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
          {totalItems > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} usuarios
              </div>
              <div className="flex items-center space-x-2">
                <Button
                   variant="outline"
                   size="sm"
                   onClick={() => handlePageChange(currentPage - 1)}
                   disabled={!hasPreviousPage}
                 >
                   <ChevronLeft className="h-4 w-4" />
                   Anterior
                 </Button>
                 
                 {/* Page numbers */}
                 <div className="flex items-center space-x-1">
                   {Array.from({ length: totalPages }, (_, i) => i + 1)
                     .filter(page => {
                       return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                     })
                     .map((page, index, array) => {
                       const showEllipsis = index > 0 && page - array[index - 1] > 1;
                       return (
                         <React.Fragment key={page}>
                           {showEllipsis && <span className="px-2">...</span>}
                           <Button
                             variant={page === currentPage ? 'default' : 'outline'}
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
                   onClick={() => handlePageChange(currentPage + 1)}
                   disabled={!hasNextPage}
                 >
                   Siguiente
                   <ChevronRight className="h-4 w-4" />
                 </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={editingUser}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        onSave={handleSaveUser}
        loading={editLoading}
      />
    </div>
  );
}