import { toast } from 'sonner';
import { GraphQLVariables } from '../../types';

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'error') {
    toast.error(message);
  } else {
    toast.success(message);
  }
};

export const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';
  
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusConfig = (status: string) => {
  const statusConfig = {
    PENDING: { label: 'Pendiente', variant: 'secondary' as const },
    APPROVED: { label: 'Aprobado', variant: 'default' as const },
    REJECTED: { label: 'Rechazado', variant: 'destructive' as const }
  };
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
};