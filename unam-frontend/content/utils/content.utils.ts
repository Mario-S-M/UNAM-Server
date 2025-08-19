import { GraphQLVariables } from '../../types';

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Implementación simple de toast - puedes reemplazar con tu librería de toast preferida
  if (type === 'error') {
    console.error(message);
  } else {
    console.log(message);
  }
};

export const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  const response = await fetch('/api/graphql', {
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