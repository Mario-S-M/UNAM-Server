import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { ValidationStatusOption } from '../types';

export const VALIDATION_STATUS_OPTIONS: ValidationStatusOption[] = [
  { value: 'PENDING', label: 'Pendiente', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'APPROVED', label: 'Aprobado', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Rechazado', icon: XCircle, color: 'bg-red-100 text-red-800' },
];