import bcrypt from 'bcryptjs';
import { initDatabase, User } from './database.js';

const usersData = [
    {
        firstName: 'Admin',
        username: 'admin',
        cedula: 'V-00000000',
        password: 'Admin123!',
        securityQuestion1Id: 1,
        securityAnswer1: 'admin',
        securityQuestion2Id: 3,
        securityAnswer2: 'admin',
        role: 'admin',
        active: true,
    },
];

async function seedUsers() {
    console.log('Inicializando base de datos...');
    const initialized = await initDatabase();
    if (!initialized) {
        console.error('Error al conectar a la base de datos');
        process.exit(1);
    }

    try {
        const saltRounds = 10;

        for (const usr of usersData) {
            const existing = await User.findOne({ where: { username: usr.username } });
            if (existing) {
                console.log(`  Ya existe: ${usr.username}`);
                console.log(`    └─ Credenciales: usuario="${usr.username}" / contraseña="${usr.password}"`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(usr.password, saltRounds);
            const hashedAnswer1 = await bcrypt.hash(usr.securityAnswer1.toLowerCase().trim(), saltRounds);
            const hashedAnswer2 = await bcrypt.hash(usr.securityAnswer2.toLowerCase().trim(), saltRounds);

            await User.create({
                firstName: usr.firstName,
                username: usr.username,
                cedula: usr.cedula,
                password: hashedPassword,
                securityQuestion1Id: usr.securityQuestion1Id,
                securityAnswer1: hashedAnswer1,
                securityQuestion2Id: usr.securityQuestion2Id,
                securityAnswer2: hashedAnswer2,
                role: usr.role,
                active: usr.active,
            });

            console.log(`  Creado: ${usr.username}`);
            console.log(`    └─ Credenciales: usuario="${usr.username}" / contraseña="${usr.password}"`);
        }

        console.log('\n Seed de usuarios completado exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed de usuarios:', error);
        process.exit(1);
    }
}

seedUsers();
