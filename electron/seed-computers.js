import { initDatabase, Computer } from './database.js';

const computersData = [
    { code: 'COMP-011', serial: 'SN-ABC-2001', computerType: 'Escritorio', brand: 'DELL', model: 'OptiPlex 3000', state: 'Bueno', cpu: 'Intel Core i5-12500', ramMemory: '16 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel UHD Graphics 770' },
    { code: 'COMP-012', serial: 'SN-ABC-2002', computerType: 'Laptop', brand: 'HP', model: 'ProBook 450 G9', state: 'Bueno', cpu: 'Intel Core i5-1235U', ramMemory: '16 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel Iris Xe Graphics' },
    { code: 'COMP-013', serial: 'SN-ABC-2003', computerType: 'Escritorio', brand: 'Lenovo', model: 'ThinkCentre M80q', state: 'Bueno', cpu: 'Intel Core i3-12100T', ramMemory: '8 GB', storage: '256 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel UHD Graphics 730' },
    { code: 'COMP-014', serial: 'SN-ABC-2004', computerType: 'Laptop', brand: 'Dell', model: 'Latitude 5430', state: 'Bueno', cpu: 'Intel Core i5-1245U', ramMemory: '16 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel Iris Xe Graphics' },
    { code: 'COMP-015', serial: 'SN-ABC-2005', computerType: 'Escritorio', brand: 'HP', model: 'EliteDesk 805 G8', state: 'Bueno', cpu: 'AMD Ryzen 7 5800G', ramMemory: '32 GB', storage: '1 TB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'AMD Radeon Graphics' },
    { code: 'COMP-016', serial: 'SN-ABC-2006', computerType: 'Escritorio', brand: 'DELL', model: 'Precision 3660', state: 'Bueno', cpu: 'Intel Core i7-12700K', ramMemory: '64 GB', storage: '1 TB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'NVIDIA RTX A2000' },
    { code: 'COMP-017', serial: 'SN-ABC-2007', computerType: 'Laptop', brand: 'Lenovo', model: 'ThinkPad X13 Gen 3', state: 'Bueno', cpu: 'Intel Core i5-1245U', ramMemory: '16 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel Iris Xe Graphics' },
    { code: 'COMP-018', serial: 'SN-ABC-2008', computerType: 'Escritorio', brand: 'HP', model: 'ProDesk 405 G8', state: 'Dañado', cpu: 'AMD Ryzen 5 5600G', ramMemory: '8 GB', storage: '256 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'AMD Radeon Graphics' },
    { code: 'COMP-019', serial: 'SN-ABC-2009', computerType: 'Escritorio', brand: 'DELL', model: 'OptiPlex 7090', state: 'Repuesto', cpu: 'Intel Core i5-11500', ramMemory: '16 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 10 Pro 64-bit', graphicCard: 'Intel UHD Graphics 750' },
    { code: 'COMP-020', serial: 'SN-ABC-2010', computerType: 'Laptop', brand: 'HP', model: 'EliteBook 860 G9', state: 'Bueno', cpu: 'Intel Core i7-1265U', ramMemory: '32 GB', storage: '1 TB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel Iris Xe Graphics' },
];

async function seedComputers() {
    console.log('Inicializando base de datos...');
    const initialized = await initDatabase();
    if (!initialized) {
        console.error('Error al conectar a la base de datos');
        process.exit(1);
    }

    try {
        console.log('Creando computadores de prueba...');
        let created = 0;
        for (const comp of computersData) {
            const [, isNew] = await Computer.findOrCreate({
                where: { code: comp.code },
                defaults: comp,
            });
            if (isNew) {
                console.log(`  Creado: ${comp.code} — ${comp.brand} ${comp.model}`);
                created++;
            } else {
                console.log(`  Ya existe: ${comp.code}`);
            }
        }

        console.log(`\n¡Seed completado! ${created} computadores creados de ${computersData.length} totales.`);
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

seedComputers();
