'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useContentManagement } from '../hooks/useContentManagement';
import {
  ContentHeader,
  ContentTable,
  ContentPagination,
  ContentModal
} from './index';

export function ContentManagement() {
  const {
    // State
    search,
    pageSize,
    activeFilter,
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
    meta,
    
    // Loading states
    contentsLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    
    // Actions
    setSearch,
    setPageSize,
    setActiveFilter,
    toggleColumnVisibility,
    handleSearchChange,
    formatDate,
    setIsCreateModalOpen,
    setFormData,
    handleEdit,
    handleDelete,
    handlePageChange,
    handleModalClose,
    handleModalSubmit
  } = useContentManagement();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Gestión de Contenido
              </CardTitle>
              <CardDescription>
                Administra el contenido educativo de la plataforma
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ContentHeader
            search={search}
            pageSize={pageSize}
            activeFilter={activeFilter}
            columnVisibility={columnVisibility}
            onSearchChange={handleSearchChange}
            onPageSizeChange={setPageSize}
            onActiveFilterChange={setActiveFilter}
            onToggleColumnVisibility={toggleColumnVisibility}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
          
          <ContentTable
            contents={contents}
            columnVisibility={columnVisibility}
            contentsLoading={contentsLoading}
            deleteLoading={deleteLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            formatDate={formatDate}
          />
          
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
        isLoading={createLoading || updateLoading}
      />
    </div>
  );
}