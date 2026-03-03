import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { MongoDatabase } from '../datasources/mongo/mongo-database';
import { UserModel } from '../datasources/mongo/models/user.model';
import { BusinessModel } from '../datasources/mongo/models/business.model';
import { ServiceModel } from '../datasources/mongo/models/service.model';
import { StaffModel } from '../datasources/mongo/models/staff.model';
import { AppointmentModel } from '../datasources/mongo/models/appointment.model';
import { ClientModel } from '../datasources/mongo/models/client.model';
import { ReviewModel } from '../datasources/mongo/models/review.model';
import { BusinessRepositoryImpl } from '../repositories/business.repository.impl';
import { BusinessMongoDatasource } from '../datasources/business.mongo.datasource';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';
import { UserMongoDatasource } from '../datasources/user.mongo.datasource';
import { ServiceRepositoryImpl } from '../repositories/service.repository.impl';
import { ServiceMongoDatasource } from '../datasources/service.mongo.datasource';
import { StaffRepositoryImpl } from '../repositories/staff.repository.impl';
import { StaffMongoDatasource } from '../datasources/staff.mongo.datasource';
import { ClientRepositoryImpl } from '../repositories/client.repository.impl';
import { ClientMongoDatasource } from '../datasources/client.mongo.datasource';
import { AppointmentRepositoryImpl } from '../repositories/appointment.repository.impl';
import { AppointmentMongoDatasource } from '../datasources/appointment.mongo.datasource';
import { ReviewRepositoryImpl } from '../repositories/review.repository.impl';
import { ReviewMongoDatasource } from '../datasources/review.mongo.datasource';
import { BcryptAdapter } from '../../config/bcrypt.adapter';

const PASSWORD = '123';

// Datos realistas para servicios dentales
const DENTAL_SERVICES = [
  { name: 'Limpieza Dental', duration: 30, price: 500, cost: 150, category: 'Preventiva' },
  { name: 'Consulta General', duration: 20, price: 300, cost: 100, category: 'Consulta' },
  { name: 'Extracción Simple', duration: 45, price: 800, cost: 200, category: 'Cirugía' },
  { name: 'Blanqueamiento Dental', duration: 60, price: 2500, cost: 800, category: 'Estética' },
  { name: 'Endodoncia', duration: 90, price: 3500, cost: 1200, category: 'Especializada' },
  { name: 'Ortodoncia (Revisión)', duration: 15, price: 400, cost: 100, category: 'Ortodoncia' },
];

// Especialidades del staff
const STAFF_SPECIALTIES = [
  { name: 'Dr. Carlos Mendoza', specialty: 'Odontólogo General', services: [0, 1, 2] },
  { name: 'Dra. Ana Martínez', specialty: 'Higienista Dental', services: [0, 1, 5] },
  { name: 'Dr. Roberto Sánchez', specialty: 'Cirujano Maxilofacial', services: [2, 4] },
  { name: 'Dra. Laura Fernández', specialty: 'Ortodoncista', services: [3, 5] },
];

// Horarios laborales variados
const WORKING_SCHEDULES = [
  // Dr. Carlos - Lunes a Viernes 9-17
  [
    { day: 1, startTime: '09:00', endTime: '17:00', isActive: true },
    { day: 2, startTime: '09:00', endTime: '17:00', isActive: true },
    { day: 3, startTime: '09:00', endTime: '17:00', isActive: true },
    { day: 4, startTime: '09:00', endTime: '17:00', isActive: true },
    { day: 5, startTime: '09:00', endTime: '17:00', isActive: true },
  ],
  // Dra. Ana - Lunes a Sábado 10-18
  [
    { day: 1, startTime: '10:00', endTime: '18:00', isActive: true },
    { day: 2, startTime: '10:00', endTime: '18:00', isActive: true },
    { day: 3, startTime: '10:00', endTime: '18:00', isActive: true },
    { day: 4, startTime: '10:00', endTime: '18:00', isActive: true },
    { day: 5, startTime: '10:00', endTime: '18:00', isActive: true },
    { day: 6, startTime: '10:00', endTime: '14:00', isActive: true },
  ],
  // Dr. Roberto - Martes, Jueves, Viernes 14-20
  [
    { day: 2, startTime: '14:00', endTime: '20:00', isActive: true },
    { day: 4, startTime: '14:00', endTime: '20:00', isActive: true },
    { day: 5, startTime: '14:00', endTime: '20:00', isActive: true },
  ],
  // Dra. Laura - Lunes, Miércoles, Viernes 8-16
  [
    { day: 1, startTime: '08:00', endTime: '16:00', isActive: true },
    { day: 3, startTime: '08:00', endTime: '16:00', isActive: true },
    { day: 5, startTime: '08:00', endTime: '16:00', isActive: true },
  ],
];

// Fuentes de adquisición
const CLIENT_SOURCES = ['qr_door', 'web_booking', 'app', 'manual'] as const;

// Estados de citas
const APPOINTMENT_STATUSES = {
  COMPLETED: 30,
  PENDING: 10,
  CANCELLED: 5,
  NO_SHOW: 5,
};

async function runSeed() {
  try {
    console.log('🌱 Iniciando seed MASIVO de Agendly...\n');
    await MongoDatabase.connect();

    console.log('🗑️  Limpiando base de datos...');
    await Promise.all([
      UserModel.deleteMany({}),
      BusinessModel.deleteMany({}),
      ServiceModel.deleteMany({}),
      StaffModel.deleteMany({}),
      AppointmentModel.deleteMany({}),
      ClientModel.deleteMany({}),
      ReviewModel.deleteMany({}),
    ]);
    console.log('   ✓ Base de datos limpia\n');

    // Repositorios
    const businessRepo = new BusinessRepositoryImpl(new BusinessMongoDatasource());
    const userRepo = new UserRepositoryImpl(new UserMongoDatasource());
    const serviceRepo = new ServiceRepositoryImpl(new ServiceMongoDatasource());
    const staffRepo = new StaffRepositoryImpl(new StaffMongoDatasource());
    const clientRepo = new ClientRepositoryImpl(new ClientMongoDatasource());
    const appointmentRepo = new AppointmentRepositoryImpl(new AppointmentMongoDatasource());
    const reviewRepo = new ReviewRepositoryImpl(new ReviewMongoDatasource());

    // ========== 1. BUSINESS ==========
    console.log('🏢 Creando Business...');
    const business = await businessRepo.create({
      name: 'Clínica Dental Élite',
      slug: 'clinica-elite',
      logoUrl: 'https://via.placeholder.com/200x200?text=Clinica+Elite',
      primaryColor: '#0066CC',
      secondaryColor: '#00AAFF',
      subscriptionPlan: 'PRO',
      storageUsed: 0,
      isActive: true,
    });
    console.log(`   ✓ Business creado: ${business.name} (${business.slug})\n`);

    // ========== 2. ADMIN USER ==========
    console.log('👤 Creando Usuario Administrador...');
    const adminUser = await userRepo.create({
      businessId: business.id,
      email: 'adminx@test.com',
      password: await BcryptAdapter.hash(PASSWORD),
      name: 'Super Administrador',
      phone: '+52 55 1111 1111',
      role: 'ADMIN',
      isActive: true,
    });
    console.log(`   ✓ Super Admin creado: ${adminUser.email}`);

    // ========== 2.1. SUSCRIPTOR USER ==========
    const subscriberUser = await userRepo.create({
      businessId: business.id,
      email: 'admin@test.com',
      password: await BcryptAdapter.hash(PASSWORD),
      name: 'Administrador Suscriptor',
      phone: '+52 55 2222 2222',
      role: 'ADMIN',
      isActive: true,
    });
    console.log(`   ✓ Suscriptor creado: ${subscriberUser.email}\n`);

    // ========== 3. SERVICIOS ==========
    console.log('🔧 Creando Servicios...');
    const services = await Promise.all(
      DENTAL_SERVICES.map((service) =>
        serviceRepo.create({
          businessId: business.id,
          name: service.name,
          description: `Servicio profesional de ${service.name.toLowerCase()}`,
          duration: service.duration,
          price: service.price,
          costOfService: service.cost,
          category: service.category,
          isActive: true,
        })
      )
    );
    console.log(`   ✓ ${services.length} servicios creados\n`);

    // ========== 4. STAFF (4 empleados) ==========
    console.log('👔 Creando Staff...');
    const staffMembers = await Promise.all(
      STAFF_SPECIALTIES.map(async (staffData, index) => {
        const staffUser = await userRepo.create({
          businessId: business.id,
          email: `${staffData.name.toLowerCase().replace(/\s+/g, '.')}@clinica-elite.com`,
          password: await BcryptAdapter.hash(PASSWORD),
          name: staffData.name,
          phone: `+52 55 ${2000 + index}000${index}`,
          role: 'STAFF',
          isActive: true,
        });

        const serviceIds = staffData.services.map((idx) => services[idx].id);

        return staffRepo.create({
          businessId: business.id,
          userId: staffUser.id,
          name: staffData.name,
          workingHours: WORKING_SCHEDULES[index],
          averageRating: 0,
          totalReviews: 0,
          services: serviceIds,
          isActive: true,
        });
      })
    );
    console.log(`   ✓ ${staffMembers.length} miembros del staff creados\n`);

    // ========== 5. CLIENTES (50) ==========
    console.log('👥 Creando 50 Clientes...');
    const clients = await Promise.all(
      Array.from({ length: 50 }, async (_, index) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        const phone = `+52 ${faker.string.numeric(2)} ${faker.string.numeric(4)} ${faker.string.numeric(4)}`;
        const source = CLIENT_SOURCES[index % CLIENT_SOURCES.length];

        const clientUser = await userRepo.create({
          businessId: business.id,
          email,
          password: await BcryptAdapter.hash(PASSWORD),
          name: `${firstName} ${lastName}`,
          phone,
          role: 'USER',
          isActive: true,
        });

        return clientRepo.create({
          businessId: business.id,
          userId: clientUser.id,
          name: `${firstName} ${lastName}`,
          email,
          phone,
          source,
          birthDate: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
        });
      })
    );
    console.log(`   ✓ ${clients.length} clientes creados\n`);

    // ========== 6. CITAS (50) ==========
    console.log('📅 Creando 50 Citas...');
    
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const oneMonthAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    let appointmentIndex = 0;
    const appointments = [];
    const statusEntries = Object.entries(APPOINTMENT_STATUSES);

    for (const [status, count] of statusEntries) {
      for (let i = 0; i < count; i++) {
        const client = clients[appointmentIndex % clients.length];
        const staff = staffMembers[appointmentIndex % staffMembers.length];
        const service = services[appointmentIndex % services.length];

        // Fecha aleatoria según el estado
        let appointmentDate: Date;
        if (status === 'PENDING') {
          appointmentDate = faker.date.between({ from: now, to: oneMonthAhead });
        } else {
          appointmentDate = faker.date.between({ from: threeMonthsAgo, to: now });
        }

        const startTime = new Date(appointmentDate);
        const endTime = new Date(startTime.getTime() + service.duration * 60 * 1000);

        const appointmentData: any = {
          businessId: business.id,
          customerId: client.id,
          staffId: staff.id,
          serviceId: service.id,
          startTime,
          endTime,
          status,
          isFirstTime: Math.random() > 0.3,
          clientDevice: ['web', 'ios', 'android', 'unknown'][Math.floor(Math.random() * 4)],
        };

        // Para citas completadas, agregar check-in/check-out con variaciones
        if (status === 'COMPLETED') {
          const checkInVariation = faker.number.int({ min: -10, max: 15 }) * 60 * 1000;
          const checkOutVariation = faker.number.int({ min: -5, max: 20 }) * 60 * 1000;
          
          appointmentData.checkInTime = new Date(startTime.getTime() + checkInVariation);
          appointmentData.checkOutTime = new Date(endTime.getTime() + checkOutVariation);
        }

        if (status === 'CANCELLED') {
          appointmentData.cancellationReason = faker.helpers.arrayElement([
            'Emergencia personal',
            'Cambio de horario',
            'Problemas de salud',
            'Duplicado por error',
          ]);
        }

        // 10 citas con multimedia
        if (appointmentIndex < 10) {
          appointmentData.multimedia = [
            `https://via.placeholder.com/800x600?text=Foto+${appointmentIndex + 1}`,
          ];
        }

        const appointment = await appointmentRepo.create(appointmentData);
        appointments.push(appointment);
        appointmentIndex++;
      }
    }
    console.log(`   ✓ ${appointments.length} citas creadas (30 completadas, 10 pendientes, 5 canceladas, 5 no show)\n`);

    // ========== 7. REVIEWS (30 para citas completadas) ==========
    console.log('⭐ Creando Reviews...');
    const completedAppointments = appointments.filter((apt) => apt.status === 'COMPLETED');
    
    const reviews = await Promise.all(
      completedAppointments.map((appointment) =>
        reviewRepo.create({
          businessId: business.id,
          appointmentId: appointment.id,
          staffId: appointment.staffId,
          clientId: appointment.customerId,
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.helpers.arrayElement([
            'Excelente atención, muy profesional',
            'Muy satisfecho con el servicio',
            'Buen trabajo, lo recomiendo',
            'Atención de calidad',
            'Servicio rápido y eficiente',
            'Muy buena experiencia',
            'Personal amable y capacitado',
          ]),
        })
      )
    );
    console.log(`   ✓ ${reviews.length} reviews creadas\n`);

    // ========== 8. ACTUALIZAR RATINGS DEL STAFF ==========
    console.log('📊 Actualizando ratings del staff...');
    for (const staff of staffMembers) {
      const staffReviews = reviews.filter((r) => r.staffId === staff.id);
      
      if (staffReviews.length > 0) {
        const avgRating = staffReviews.reduce((sum, r) => sum + r.rating, 0) / staffReviews.length;
        
        await StaffModel.updateOne(
          { _id: staff.id },
          {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: staffReviews.length,
          }
        );
      }
    }
    console.log('   ✓ Ratings actualizados\n');

    // ========== RESUMEN FINAL ==========
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ SEED MASIVO COMPLETADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📊 RESUMEN DE DATOS GENERADOS:');
    console.log(`   🏢 Business: 1 (${business.name})`);
    console.log(`   👤 Usuarios: ${1 + staffMembers.length + clients.length} (1 admin, ${staffMembers.length} staff, ${clients.length} clientes)`);
    console.log(`   🔧 Servicios: ${services.length}`);
    console.log(`   👔 Staff: ${staffMembers.length}`);
    console.log(`   👥 Clientes: ${clients.length}`);
    console.log(`   📅 Citas: ${appointments.length}`);
    console.log(`      - Completadas: ${APPOINTMENT_STATUSES.COMPLETED}`);
    console.log(`      - Pendientes: ${APPOINTMENT_STATUSES.PENDING}`);
    console.log(`      - Canceladas: ${APPOINTMENT_STATUSES.CANCELLED}`);
    console.log(`      - No Show: ${APPOINTMENT_STATUSES.NO_SHOW}`);
    console.log(`   ⭐ Reviews: ${reviews.length}`);
    console.log(`   📸 Citas con multimedia: 10\n`);

    console.log('🔑 CREDENCIALES DE ACCESO:');
    console.log(`   Super Admin:  adminx@test.com / ${PASSWORD}`);
    console.log(`   Suscriptor:   admin@test.com / ${PASSWORD}`);
    console.log(`   Staff:        dr.carlos.mendoza@clinica-elite.com / ${PASSWORD}`);
    console.log(`   Cliente:      ${clients[0].email} / ${PASSWORD}`);
    console.log(`   Business ID:  ${business.id}`);
    console.log(`   Slug:         ${business.slug}\n`);

    console.log('🎯 DATOS PARA PRUEBAS DE ANALÍTICA:');
    console.log('   ✓ Distribución de fuentes de clientes (25% cada una)');
    console.log('   ✓ Citas con variaciones de puntualidad para reportes');
    console.log('   ✓ Ratings variados (3-5 estrellas) para análisis de staff');
    console.log('   ✓ Servicios con costos para cálculo de utilidad neta');
    console.log('   ✓ Horarios de staff variados para Smart Calendar\n');

    console.log('═══════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  } finally {
    await MongoDatabase.disconnect();
    process.exit(0);
  }
}

runSeed();
