import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreateContentFormData as ContentFormData, Level, Skill, Teacher } from '../../types';
import { VALIDATION_STATUS_OPTIONS } from '../constants';

interface ContentFormProps {
  formData: ContentFormData;
  onFormDataChange: (data: ContentFormData) => void;
  levels: Level[];
  skills: Skill[];
  teachers: Teacher[];
}

export function ContentForm({ formData, onFormDataChange, levels, skills, teachers }: ContentFormProps) {
  const updateFormData = (updates: Partial<ContentFormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData({ name: e.target.value })}
            placeholder="Nombre del contenido"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="validationStatus">Estado de Validación</Label>
          <Select
            value={formData.validationStatus}
            onValueChange={(value: 'PENDING' | 'APPROVED' | 'REJECTED') => updateFormData({ validationStatus: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              {VALIDATION_STATUS_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData({ description: e.target.value })}
          placeholder="Descripción del contenido"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="level">Nivel</Label>
          <Select
            value={formData.levelId}
            onValueChange={(value: string) => updateFormData({ levelId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar nivel" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name} (Dificultad: {level.difficulty})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skill">Skill</Label>
          <Select
            value={formData.skillId}
            onValueChange={(value: string) => updateFormData({ skillId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar skill" />
            </SelectTrigger>
            <SelectContent>
              {skills.map((skill) => (
                <SelectItem key={skill.id} value={skill.id}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: skill.color || '#6B7280' }}
                    />
                    <span>{skill.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Profesores Asignados</Label>
        <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
          {teachers.length === 0 ? (
            <p className="text-sm text-gray-500">No hay profesores disponibles</p>
          ) : (
            <div className="space-y-2">
              {teachers.map((teacher) => (
                <label key={teacher.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.teacherIds.includes(teacher.id)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        updateFormData({
                          teacherIds: [...formData.teacherIds, teacher.id]
                        });
                      } else {
                        updateFormData({
                          teacherIds: formData.teacherIds.filter(id => id !== teacher.id)
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{teacher.fullName}</div>
                    <div className="text-xs text-gray-500">{teacher.email}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}