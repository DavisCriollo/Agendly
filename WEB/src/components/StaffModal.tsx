import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { staffService, serviceService, authService } from '../services/api';

interface WorkingHour {
  day: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingStaff?: any;
}

const StaffModal = ({ isOpen, onClose, onSuccess, editingStaff }: StaffModalProps) => {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    services: [] as string[],
    workingHours: [] as WorkingHour[],
  });
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = authService.getCurrentUser();
  const businessId = user?.businessId;

  const daysOfWeek = [
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' },
    { id: 7, name: 'Domingo' },
  ];

  useEffect(() => {
    if (isOpen && businessId) {
      loadServices();
      if (editingStaff) {
        setFormData({
          userId: editingStaff.userId || '',
          name: editingStaff.name || '',
          services: editingStaff.services || [],
          workingHours: editingStaff.workingHours || [],
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, editingStaff, businessId]);

  const loadServices = async () => {
    try {
      const response = await serviceService.getAll(businessId);
      setAvailableServices(response.services || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: user?.id || '',
      name: '',
      services: [],
      workingHours: [],
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!businessId) {
        throw new Error('No se encontró el businessId');
      }

      const dataToSend = {
        ...formData,
        businessId,
        userId: formData.userId || user?.id,
      };

      if (editingStaff) {
        await staffService.update(editingStaff.id, dataToSend);
      } else {
        await staffService.create(dataToSend);
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error('Error saving staff:', err);
      setError(err.response?.data?.message || 'Error al guardar el miembro del staff');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const addWorkingHour = () => {
    setFormData(prev => ({
      ...prev,
      workingHours: [
        ...prev.workingHours,
        { day: 1, startTime: '09:00', endTime: '18:00', isActive: true },
      ],
    }));
  };

  const removeWorkingHour = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workingHours: prev.workingHours.filter((_, i) => i !== index),
    }));
  };

  const updateWorkingHour = (index: number, field: keyof WorkingHour, value: any) => {
    setFormData(prev => ({
      ...prev,
      workingHours: prev.workingHours.map((wh, i) =>
        i === index ? { ...wh, [field]: value } : wh
      ),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingStaff ? 'Editar Staff' : 'Agregar Staff'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servicios *
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {availableServices.length === 0 ? (
                <p className="text-sm text-gray-500">No hay servicios disponibles</p>
              ) : (
                availableServices.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{service.name}</span>
                  </label>
                ))
              )}
            </div>
            {formData.services.length === 0 && (
              <p className="text-xs text-red-600 mt-1">Selecciona al menos un servicio</p>
            )}
          </div>

          {/* Working Hours */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Horarios de Trabajo
              </label>
              <button
                type="button"
                onClick={addWorkingHour}
                className="flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar Horario
              </button>
            </div>
            <div className="space-y-3">
              {formData.workingHours.map((wh, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <select
                    value={wh.day}
                    onChange={(e) => updateWorkingHour(index, 'day', Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day.id} value={day.id}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={wh.startTime}
                    onChange={(e) => updateWorkingHour(index, 'startTime', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="time"
                    value={wh.endTime}
                    onChange={(e) => updateWorkingHour(index, 'endTime', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeWorkingHour(index)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {formData.workingHours.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay horarios configurados
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || formData.services.length === 0}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : editingStaff ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;
