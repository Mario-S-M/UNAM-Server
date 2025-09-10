import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';
import {
  GET_FORM,
  GET_FORMS_BY_CONTENT,
  GET_FORM_RESPONSES,
  CREATE_FORM,
  UPDATE_FORM,
  DELETE_FORM,
  SUBMIT_FORM_RESPONSE,
  type CreateFormInput,
  type UpdateFormInput,
  type CreateFormResponseInput,
  type FormFiltersInput
} from '@/lib/graphql/formsGraphqlSchema';
import type {
  CreateFormFormData,
  UpdateFormFormData,
  CreateFormResponseData,
  FormFiltersData
} from '@/types';

/**
 * Hook para obtener un formulario por ID
 */
export function useGetForm(id: string) {
  return useQuery(GET_FORM, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Error al obtener formulario:', error);
      toast.error('Error al cargar el formulario');
    }
  });
}

/**
 * Hook para obtener formularios por contenido
 */
export function useGetFormsByContent(contentId: string, filters?: FormFiltersData) {
  return useQuery(GET_FORMS_BY_CONTENT, {
    variables: { 
      contentId,
      filters: filters as FormFiltersInput
    },
    skip: !contentId,
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Error al obtener formularios:', error);
      toast.error('Error al cargar los formularios');
    }
  });
}

/**
 * Hook para obtener respuestas de un formulario
 */
export function useGetFormResponses(formId: string) {
  return useQuery(GET_FORM_RESPONSES, {
    variables: { formId },
    skip: !formId,
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Error al obtener respuestas:', error);
      toast.error('Error al cargar las respuestas');
    }
  });
}

/**
 * Hook para crear formularios
 */
export function useCreateForm() {
  const [loading, setLoading] = useState(false);
  
  const [createFormMutation] = useMutation(CREATE_FORM, {
    onCompleted: () => {
      toast.success('Formulario creado exitosamente');
    },
    onError: (error) => {
      console.error('Error al crear formulario:', error);
      toast.error('Error al crear el formulario');
    },
    refetchQueries: ['GetFormsByContent']
  });

  const createForm = useCallback(async (formData: CreateFormFormData) => {
    try {
      setLoading(true);
      
      const createFormInput: CreateFormInput = {
        title: formData.title,
        description: formData.description,
        contentId: formData.contentId,
        status: formData.status,
        allowAnonymous: formData.allowAnonymous,
        allowMultipleResponses: formData.allowMultipleResponses,
        successMessage: formData.successMessage,
        primaryColor: formData.primaryColor,
        backgroundColor: formData.backgroundColor,
        fontFamily: formData.fontFamily,
        publishedAt: formData.publishedAt,
        closedAt: formData.closedAt,
        questions: formData.questions.map(question => ({
          questionText: question.questionText,
          questionType: question.questionType,
          orderIndex: question.orderIndex,
          isRequired: question.isRequired,
          allowMultiline: question.allowMultiline,
          description: question.description,
          placeholder: question.placeholder,
          imageUrl: question.imageUrl,
          minValue: question.minValue,
          maxValue: question.maxValue,
          maxLength: question.maxLength,
          options: question.options?.map(option => ({
            optionText: option.optionText,
            optionValue: option.optionValue,
            orderIndex: option.orderIndex,
            imageUrl: option.imageUrl,
            color: option.color
          }))
        }))
      };

      const result = await createFormMutation({
        variables: { createFormInput }
      });

      return result.data?.createForm;
    } catch (error) {
      console.error('Error en createForm:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [createFormMutation]);

  return { createForm, loading };
}

/**
 * Hook para actualizar formularios
 */
export function useUpdateForm() {
  const [loading, setLoading] = useState(false);
  
  const [updateFormMutation] = useMutation(UPDATE_FORM, {
    onCompleted: () => {
      toast.success('Formulario actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Error al actualizar formulario:', error);
      toast.error('Error al actualizar el formulario');
    },
    refetchQueries: ['GetForm', 'GetFormsByContent']
  });

  const updateForm = useCallback(async (formData: UpdateFormFormData) => {
    try {
      setLoading(true);
      
      const updateFormInput: UpdateFormInput = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        allowAnonymous: formData.allowAnonymous,
        allowMultipleResponses: formData.allowMultipleResponses,
        successMessage: formData.successMessage,
        primaryColor: formData.primaryColor,
        backgroundColor: formData.backgroundColor,
        fontFamily: formData.fontFamily,
        publishedAt: formData.publishedAt,
        closedAt: formData.closedAt,
        questions: formData.questions?.map(question => ({
          id: question.id,
          questionText: question.questionText,
          questionType: question.questionType,
          orderIndex: question.orderIndex,
          isRequired: question.isRequired,
          allowMultiline: question.allowMultiline,
          description: question.description,
          placeholder: question.placeholder,
          imageUrl: question.imageUrl,
          minValue: question.minValue,
          maxValue: question.maxValue,
          maxLength: question.maxLength,
          options: question.options?.map(option => ({
            id: option.id,
            optionText: option.optionText,
            optionValue: option.optionValue,
            orderIndex: option.orderIndex,
            imageUrl: option.imageUrl,
            color: option.color
          }))
        }))
      };

      const result = await updateFormMutation({
        variables: { updateFormInput }
      });

      return result.data?.updateForm;
    } catch (error) {
      console.error('Error en updateForm:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [updateFormMutation]);

  return { updateForm, loading };
}

/**
 * Hook para eliminar formularios
 */
export function useDeleteForm() {
  const [loading, setLoading] = useState(false);
  
  const [deleteFormMutation] = useMutation(DELETE_FORM, {
    onCompleted: () => {
      toast.success('Formulario eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error al eliminar formulario:', error);
      toast.error('Error al eliminar el formulario');
    },
    refetchQueries: ['GetFormsByContent']
  });

  const deleteForm = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      const result = await deleteFormMutation({
        variables: { id }
      });

      return result.data?.deleteForm;
    } catch (error) {
      console.error('Error en deleteForm:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [deleteFormMutation]);

  return { deleteForm, loading };
}

/**
 * Hook para enviar respuestas de formulario
 */
export function useSubmitFormResponse() {
  const [loading, setLoading] = useState(false);
  
  const [submitResponseMutation] = useMutation(SUBMIT_FORM_RESPONSE, {
    onCompleted: () => {
      toast.success('Respuesta enviada exitosamente');
    },
    onError: (error) => {
      console.error('Error al enviar respuesta:', error);
      toast.error('Error al enviar la respuesta');
    }
  });

  const submitResponse = useCallback(async (responseData: CreateFormResponseData) => {
    try {
      setLoading(true);
      
      const createFormResponseInput: CreateFormResponseInput = {
        formId: responseData.formId,
        respondentName: responseData.respondentName,
        respondentEmail: responseData.respondentEmail,
        isAnonymous: responseData.isAnonymous,
        answers: responseData.answers.map(answer => ({
          questionId: answer.questionId,
          textAnswer: answer.textAnswer,
          selectedOptionIds: answer.selectedOptionIds,
          numericAnswer: answer.numericAnswer,
          booleanAnswer: answer.booleanAnswer
        }))
      };

      const result = await submitResponseMutation({
        variables: { createFormResponseInput }
      });

      return result.data?.submitFormResponse;
    } catch (error) {
      console.error('Error en submitResponse:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [submitResponseMutation]);

  return { submitResponse, loading };
}

/**
 * Hook combinado para todas las operaciones de formularios
 */
export function useForms() {
  const createFormHook = useCreateForm();
  const updateFormHook = useUpdateForm();
  const deleteFormHook = useDeleteForm();
  const submitResponseHook = useSubmitFormResponse();

  return {
    // Operaciones de formularios
    createForm: createFormHook.createForm,
    updateForm: updateFormHook.updateForm,
    deleteForm: deleteFormHook.deleteForm,
    submitResponse: submitResponseHook.submitResponse,
    
    // Estados de carga
    isCreating: createFormHook.loading,
    isUpdating: updateFormHook.loading,
    isDeleting: deleteFormHook.loading,
    isSubmitting: submitResponseHook.loading,
    
    // Estado general de carga
    loading: createFormHook.loading || updateFormHook.loading || deleteFormHook.loading || submitResponseHook.loading
  };
}