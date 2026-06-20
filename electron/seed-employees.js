import { initDatabase, Employee } from './database.js';

const employeesData = [
    { nombres: 'Carlos', apellidos: 'Mendoza', cedula: 'V-11111111', telefono: '0412-1111111', tipoEmpleado: 'Operador', estado: 'Activo', correo: 'carlos.mendoza@ven911.gob.ve' },
    { nombres: 'Sofia', apellidos: 'Pérez', cedula: 'V-22222222', telefono: '0414-2222222', tipoEmpleado: 'Supervisor', estado: 'Activo', correo: 'sofia.perez@ven911.gob.ve' },
    { nombres: 'Andrés', apellidos: 'García', cedula: 'V-33333333', telefono: '0426-3333333', tipoEmpleado: 'Analista', estado: 'Activo', correo: 'andres.garcia@ven911.gob.ve' },
    { nombres: 'Valentina', apellidos: 'Rojas', cedula: 'V-44444444', telefono: '0416-4444444', tipoEmpleado: 'Técnico', estado: 'Activo', correo: 'valentina.rojas@ven911.gob.ve' },
    { nombres: 'Diego', apellidos: 'Contreras', cedula: 'V-55555555', telefono: '0424-5555555', tipoEmpleado: 'Coordinador', estado: 'Activo', correo: 'diego.contreras@ven911.gob.ve' },
    { nombres: 'Gabriela', apellidos: 'Morales', cedula: 'V-66666666', telefono: '0412-6666666', tipoEmpleado: 'Operador', estado: 'Activo', correo: 'gabriela.morales@ven911.gob.ve' },
    { nombres: 'Fernando', apellidos: 'Castro', cedula: 'V-77777777', telefono: '0414-7777777', tipoEmpleado: 'Analista', estado: 'Inactivo', correo: 'fernando.castro@ven911.gob.ve' },
    { nombres: 'Isabella', apellidos: 'Medina', cedula: 'V-88888888', telefono: '0426-8888888', tipoEmpleado: 'Técnico', estado: 'Activo', correo: 'isabella.medina@ven911.gob.ve' },
    { nombres: 'Javier', apellidos: 'Ortega', cedula: 'V-99999999', telefono: '0416-9999999', tipoEmpleado: 'Operador', estado: 'Activo', correo: 'javier.ortega@ven911.gob.ve' },
    { nombres: 'Camila', apellidos: 'Delgado', cedula: 'V-10101010', telefono: '0424-1010101', tipoEmpleado: 'Supervisor', estado: 'Activo', correo: 'camila.delgado@ven911.gob.ve' },
];

async function seedEmployees() {
    console.log('Inicializando base de datos...');
    const initialized = await initDatabase();
    if (!initialized) {
        console.error('Error al conectar a la base de datos');
        process.exit(1);
    }

    try {
        console.log('Creando empleados de prueba...');
        let created = 0;
        for (const emp of employeesData) {
            const [, isNew] = await Employee.findOrCreate({
                where: { cedula: emp.cedula },
                defaults: emp,
            });
            if (isNew) {
                console.log(`  Creado: ${emp.nombres} ${emp.apellidos} — ${emp.cedula}`);
                created++;
            } else {
                console.log(`  Ya existe: ${emp.cedula} — ${emp.nombres} ${emp.apellidos}`);
            }
        }

        console.log(`\n¡Seed completado! ${created} empleados creados de ${employeesData.length} totales.`);
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

seedEmployees();
