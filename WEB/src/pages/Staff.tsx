import { useState, useEffect } from 'react';
import { staffService, authService } from '../services/api';
import { Plus, Edit, Star, Clock } from 'lucide-react';
import StaffModal from '../components/StaffModal';

const Staff = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const user = authService.getCurrentUser();
  const businessId = user?.businessId;

  useEffect(() => {
    if (businessId) {
      loadStaff();
    }
  }, [businessId]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAll();
      setStaffList(response.staff || []);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Staff</h1>
          <p className="text-gray-600 mt-1">Administra tu equipo y horarios</p>
        </div>
        <button
          onClick={() => {
            setEditingStaff(null);
            setShowModal(true);
          }}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Staff
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => (
          <div key={staff.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-lg">
                    {staff.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{staff.name}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {staff.averageRating.toFixed(1)} ({staff.totalReviews} reseñas)
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingStaff(staff);
                  setShowModal(true);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>

            {/* Working Hours */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Clock className="w-4 h-4 mr-2" />
                Horario de Trabajo
              </div>
              <div className="space-y-2">
                {staff.workingHours && staff.workingHours.length > 0 ? (
                  staff.workingHours
                    .filter((wh: any) => wh.isActive)
                    .slice(0, 3)
                    .map((wh: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{daysOfWeek[wh.day - 1]}</span>
                        <span className="text-gray-900 font-medium">
                          {wh.startTime} - {wh.endTime}
                        </span>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500">Sin horario configurado</p>
                )}
                {staff.workingHours && staff.workingHours.filter((wh: any) => wh.isActive).length > 3 && (
                  <p className="text-xs text-gray-500 mt-2">
                    +{staff.workingHours.filter((wh: any) => wh.isActive).length - 3} días más
                  </p>
                )}
              </div>
            </div>

            {/* Services */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-sm text-gray-600 mb-2">Servicios</p>
              <div className="flex flex-wrap gap-2">
                {staff.services && staff.services.length > 0 ? (
                  staff.services.slice(0, 3).map((serviceId: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                    >
                      Servicio {index + 1}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Sin servicios asignados</span>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  staff.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {staff.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {staffList.length === 0 && (
        <div className="text-center py-12 card">
          <p className="text-gray-500">No hay miembros del staff registrados</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mt-4"
          >
            Agregar Primer Miembro
          </button>
        </div>
      )}

      {/* Staff Modal */}
      <StaffModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStaff(null);
        }}
        onSuccess={loadStaff}
        editingStaff={editingStaff}
      />
    </div>
  );
};

export default Staff;
