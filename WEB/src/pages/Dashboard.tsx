import { useState, useEffect } from 'react';
import { analyticsService, authService } from '../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Star } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const user = authService.getCurrentUser();
  const businessId = user?.businessId;
  
  console.log('Dashboard - User:', user);
  console.log('Dashboard - BusinessId:', businessId);

  useEffect(() => {
    if (businessId) {
      loadDashboard();
    } else {
      // Si no hay businessId, detener el loading
      setLoading(false);
    }
  }, [businessId, dateRange]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      if (!businessId) {
        console.error('No businessId found for user');
        setLoading(false);
        return;
      }
      
      const response = await analyticsService.getDashboard(
        businessId,
        dateRange.startDate,
        dateRange.endDate
      );
      
      if (response.success) {
        setDashboard(response.data);
        setError('');
      }
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Error al cargar el dashboard';
      setError(errorMsg);
      
      // Si no hay datos, crear un dashboard vacío
      setDashboard({
        profitability: { totalRevenue: 0, totalCost: 0, netProfit: 0, profitMargin: 0, topServices: [] },
        efficiency: { staffPerformance: [], overallPunctuality: 0 },
        retention: { totalClients: 0, newClients: 0, returningClients: 0, retentionRate: 0, noShowRate: 0, noShowCount: 0, lostRevenue: 0, clientsBySource: [] },
        heatMap: { heatMap: [], peakHours: [], quietHours: [] }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Business ID no encontrado</h3>
          <p className="text-yellow-700 mb-4">
            El usuario actual no tiene un Business ID asignado. Esto es necesario para ver el dashboard.
          </p>
          <p className="text-sm text-yellow-600">
            Por favor, verifica que el usuario tenga un businessId en la base de datos.
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  const { profitability, efficiency, retention, heatMap } = dashboard || {};
  
  // Si no hay datos, mostrar valores por defecto
  const safeProfit = profitability || { totalRevenue: 0, totalCost: 0, netProfit: 0, profitMargin: 0, topServices: [] };
  const safeEfficiency = efficiency || { staffPerformance: [], overallPunctuality: 0 };
  const safeRetention = retention || { totalClients: 0, newClients: 0, returningClients: 0, retentionRate: 0, noShowRate: 0, noShowCount: 0, lostRevenue: 0, clientsBySource: [] };

  // KPI Cards Data
  const kpis = [
    {
      title: 'Utilidad Neta',
      value: `$${safeProfit.netProfit.toLocaleString()}`,
      change: safeProfit.profitMargin,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Tasa de Retención',
      value: `${safeRetention.retentionRate}%`,
      change: safeRetention.retentionRate > 70 ? 5 : -3,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Puntualidad',
      value: `${safeEfficiency.overallPunctuality}%`,
      change: safeEfficiency.overallPunctuality > 90 ? 2 : -5,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Clientes Totales',
      value: safeRetention.totalClients,
      change: safeRetention.totalClients > 0 ? ((safeRetention.newClients / safeRetention.totalClients) * 100).toFixed(1) : 0,
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  // Prepare chart data
  const profitabilityChartData = (safeProfit.topServices || []).slice(0, 5).map((service: any) => ({
    name: service.serviceName.length > 15 ? service.serviceName.substring(0, 15) + '...' : service.serviceName,
    utilidad: service.netProfit,
    ingresos: service.revenue,
    costos: service.cost,
  }));

  const retentionChartData = [
    { name: 'Nuevos', value: safeRetention.newClients, color: '#0ea5e9' },
    { name: 'Recurrentes', value: safeRetention.returningClients, color: '#10b981' },
  ];

  const sourceChartData = (safeRetention.clientsBySource || []).map((source: any) => ({
    name: source.source.replace('_', ' ').toUpperCase(),
    value: source.count,
  }));

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen de tu negocio</p>
        </div>
        
        <div className="flex gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="input"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="input"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.change > 0;
          
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profitability Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rentabilidad por Servicio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitabilityChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilidad" fill="#10b981" name="Utilidad Neta" />
              <Bar dataKey="ingresos" fill="#0ea5e9" name="Ingresos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Retention Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes Nuevos vs Recurrentes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={retentionChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {retentionChartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Staff Efficiency */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Puntualidad del Staff</h3>
          <div className="space-y-4">
            {(safeEfficiency.staffPerformance || []).slice(0, 5).map((staff: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{staff.staffName}</p>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        staff.punctualityRate > 90 ? 'bg-green-500' : staff.punctualityRate > 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${staff.punctualityRate}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-4 text-sm font-semibold text-gray-900">
                  {staff.punctualityRate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Sources */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuentes de Adquisición</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourceChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceChartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm font-medium text-gray-600">Margen de Ganancia</h4>
          <p className="text-3xl font-bold text-gray-900 mt-2">{safeProfit.profitMargin}%</p>
          <p className="text-sm text-gray-500 mt-1">Promedio general</p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-600">Tasa de No-Show</h4>
          <p className="text-3xl font-bold text-gray-900 mt-2">{safeRetention.noShowRate}%</p>
          <p className="text-sm text-gray-500 mt-1">
            ${safeRetention.lostRevenue.toLocaleString()} perdidos
          </p>
        </div>

        <div className="card">
          <h4 className="text-sm font-medium text-gray-600">Puntualidad General</h4>
          <p className="text-3xl font-bold text-gray-900 mt-2">{safeEfficiency.overallPunctuality}%</p>
          <p className="text-sm text-gray-500 mt-1">Promedio del equipo</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
