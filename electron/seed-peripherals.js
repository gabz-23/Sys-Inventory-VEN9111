import { initDatabase, Peripheral } from './database.js';

const peripheralsData = [
    { code: 'TEC-011', serial: 'TECSN-0011', description: 'Teclado USB Logitech K120', brand: 'Logitech', model: 'K120', type: 'Teclado', connectionType: 'USB', state: 'Bueno' },
    { code: 'TEC-012', serial: 'TECSN-0012', description: 'Teclado inalámbrico Logitech K270', brand: 'Logitech', model: 'K270', type: 'Teclado', connectionType: 'Bluetooth', state: 'Bueno' },
    { code: 'MOU-011', serial: 'MOUSN-0011', description: 'Mouse USB Logitech B100', brand: 'Logitech', model: 'B100', type: 'Mouse', connectionType: 'USB', state: 'Bueno' },
    { code: 'MOU-012', serial: 'MOUSN-0012', description: 'Mouse inalámbrico Logitech M185', brand: 'Logitech', model: 'M185', type: 'Mouse', connectionType: 'Bluetooth', state: 'Bueno' },
    { code: 'MON-008', serial: 'MONSN-0008', description: 'Monitor Samsung 22 pulgadas', brand: 'Samsung', model: 'LF22T350FHLX', type: 'Monitor', connectionType: 'HDMI', state: 'Bueno' },
    { code: 'MON-009', serial: 'MONSN-0009', description: 'Monitor Samsung 24 pulgadas', brand: 'Samsung', model: 'LF24T450FQLX', type: 'Monitor', connectionType: 'VGA', state: 'Bueno' },
    { code: 'MON-010', serial: 'MONSN-0010', description: 'Monitor LG 27 pulgadas', brand: 'LG', model: '27UP600', type: 'Monitor', connectionType: 'HDMI', state: 'Bueno' },
    { code: 'IMP-003', serial: 'IMPSN-0003', description: 'Impresora HP LaserJet M404dn', brand: 'HP', model: 'M404dn', type: 'Impresora', connectionType: 'USB', state: 'Bueno' },
    { code: 'IMP-004', serial: 'IMPSN-0004', description: 'Impresora Epson EcoTank L3250', brand: 'Epson', model: 'L3250', type: 'Impresora', connectionType: 'USB', state: 'Bueno' },
    { code: 'IMP-005', serial: 'IMPSN-0005', description: 'Impresora HP Neverstop 1200w', brand: 'HP', model: '1200w', type: 'Impresora', connectionType: 'USB', state: 'Dañado' },
];

async function seedPeripherals() {
    console.log('Inicializando base de datos...');
    const initialized = await initDatabase();
    if (!initialized) {
        console.error('Error al conectar a la base de datos');
        process.exit(1);
    }

    try {
        console.log('Creando periféricos de prueba...');
        let created = 0;
        for (const per of peripheralsData) {
            const existing = await Peripheral.findOne({ where: { code: per.code } });
            if (!existing) {
                await Peripheral.create(per);
                console.log(`  Creado: ${per.code} — ${per.description}`);
                created++;
            } else {
                console.log(`  Ya existe: ${per.code}`);
            }
        }

        console.log(`\n¡Seed completado! ${created} periféricos creados de ${peripheralsData.length} totales.`);
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

seedPeripherals();
