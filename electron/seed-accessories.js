import { initDatabase, DeskAccessory } from './database.js';

const accessoriesData = [
    { code: 'SIL-008', serial: 'SILSN-0008', description: 'Silla ergonómica oficina', type: 'Silla', state: 'Bueno' },
    { code: 'SIL-009', serial: 'SILSN-0009', description: 'Silla ejecutiva tapizada', type: 'Silla', state: 'Bueno' },
    { code: 'LAM-007', serial: 'LAMSN-0007', description: 'Lámpara LED escritorio 12W', type: 'Lampara', state: 'Bueno' },
    { code: 'LAM-008', serial: 'LAMSN-0008', description: 'Lámpara fluorescente doble tubo', type: 'Lampara', state: 'Dañado' },
    { code: 'PAP-006', serial: 'PAPSN-0006', description: 'Papelera metálica negra', type: 'Papelera', state: 'Bueno' },
    { code: 'PAP-007', serial: 'PAPSN-0007', description: 'Papelera plástica color gris', type: 'Papelera', state: 'Bueno' },
    { code: 'ARC-005', serial: 'ARCSN-0005', description: 'Archivero metálico 3 gavetas', type: 'Archivero', state: 'Bueno' },
    { code: 'ARC-006', serial: 'ARCSN-0006', description: 'Archivero metálico 2 gavetas', type: 'Archivero', state: 'Repuesto' },
    { code: 'TEL-006', serial: 'TELSN-0006', description: 'Teléfono IP Cisco 7841', type: 'Telefono', state: 'Bueno' },
    { code: 'TEL-007', serial: 'TELSN-0007', description: 'Teléfono IP Grandstream GXP2130', type: 'Telefono', state: 'Bueno' },
];

async function seedAccessories() {
    console.log('Inicializando base de datos...');
    const initialized = await initDatabase();
    if (!initialized) {
        console.error('Error al conectar a la base de datos');
        process.exit(1);
    }

    try {
        console.log('Creando accesorios de escritorio de prueba...');
        let created = 0;
        for (const acc of accessoriesData) {
            const existing = await DeskAccessory.findOne({ where: { code: acc.code } });
            if (!existing) {
                await DeskAccessory.create(acc);
                console.log(`  Creado: ${acc.code} — ${acc.description}`);
                created++;
            } else {
                console.log(`  Ya existe: ${acc.code}`);
            }
        }

        console.log(`\n¡Seed completado! ${created} accesorios creados de ${accessoriesData.length} totales.`);
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

seedAccessories();
