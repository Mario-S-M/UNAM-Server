'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useContentManagement } from '../hooks/useContentManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Content } from '../types';
import {
  ContentHeader,
  ContentTable,
  ContentPagination,
  ContentModal,
  CommentModal
} from './index';

export function ContentManagement() {
  const [commentingContent, setCommentingContent] = React.useState<any>(null);
  const { user } = useAuth();

  // Verificar si el usuario tiene permisos para ver comentarios
  const canViewComments = user && (user.roles.includes('admin') || user.roles.includes('docente') || user.roles.includes('superUser'));
  
  const {
    // State
    search,
    pageSize,
    activeFilter,
    selectedLanguageId,
    selectedSkillId,
    selectedLevelId,
    columnVisibility,
    isCreateModalOpen,
    editingContent,
    currentPage,
    formData,
    
    // Data
    contents,
    levels,
    skills,
    teachers,
    languages,
    meta,
    totalPages,
    totalItems,
    
    // Loading states
    contentsLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    
    // Computed values
    visibleColumnsCount,
    
    // Actions
    setSearch,
    setPageSize,
    setActiveFilter,
    toggleColumnVisibility,
    handleSearchChange,
    handleLanguageFilterChange,
    handleSkillFilterChange,
    handleLevelFilterChange,
    formatDate,
    setIsCreateModalOpen,
    setFormData,
    handleEdit,
    handleDelete,
    handlePageChange,
    handleModalClose,
    handleModalSubmit
  } = useContentManagement();

  const handleComment = (content: any) => {
    setCommentingContent(content);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestión de Contenidos
          </CardTitle>
          <CardDescription>
            Administra y organiza todos los contenidos educativos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentHeader
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={activeFilter}
        onStatusFilterChange={(value) => {
          if (value === 'all' || value === 'PENDING' || value === 'APPROVED' || value === 'REJECTED') {
            setActiveFilter(value);
          }
        }}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        columnVisibility={{
          title: columnVisibility.name,
          description: columnVisibility.description,
          status: columnVisibility.status,
          createdAt: columnVisibility.createdAt,
          updatedAt: columnVisibility.updatedAt,
          actions: columnVisibility.actions
        }}
        onColumnVisibilityChange={(column, visible) => {
          const columnMap: { [key: string]: keyof typeof columnVisibility } = {
            'title': 'name',
            'description': 'description',
            'status': 'status',
            'createdAt': 'createdAt',
            'updatedAt': 'updatedAt',
            'actions': 'actions'
          };
          const mappedColumn = columnMap[column];
          if (mappedColumn) {
            toggleColumnVisibility(mappedColumn);
          }
        }}
        onCreateClick={() => setIsCreateModalOpen(true)}
        selectedLanguageId={selectedLanguageId}
        onLanguageFilterChange={handleLanguageFilterChange}
        selectedSkillId={selectedSkillId}
        onSkillFilterChange={handleSkillFilterChange}
        selectedLevelId={selectedLevelId}
        onLevelFilterChange={handleLevelFilterChange}
        languages={languages}
        skills={skills}
        levels={levels}
        visibleColumnsCount={visibleColumnsCount}
      >
        <ContentTable
          contents={contents}
          columnVisibility={columnVisibility}
          contentsLoading={contentsLoading}
          deleteLoading={deleteLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onComment={canViewComments ? handleComment : undefined}
          formatDate={formatDate}
        />
      </ContentHeader>
      
      {/* Pagination */}
      <ContentPagination
        meta={meta}
        contentsCount={contents.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
        </CardContent>
      </Card>
      
      <ContentModal
        isOpen={isCreateModalOpen || !!editingContent}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        formData={formData}
        onFormDataChange={setFormData}
        editingContent={editingContent}
        levels={levels}
        skills={skills}
        teachers={teachers}
        languages={languages}
        isLoading={createLoading || updateLoading}
      />
      
      <CommentModal
        isOpen={!!commentingContent}
        onClose={() => setCommentingContent(null)}
        content={commentingContent}
      />
    </div>
  );
}