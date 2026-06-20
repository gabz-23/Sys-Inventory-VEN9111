import { initDatabase, Component } from './database.js';

const componentsData = [
    { code: 'RAM-013', serial: 'RAMSN-0013', brand: 'Kingston', model: 'KVR26N19S8/16', specs: '16GB DDR4 2666MHz', type: 'RAM', state: 'Bueno' },
    { code: 'RAM-014', serial: 'RAMSN-0014', brand: 'Corsair', model: 'Vengeance LPX 32GB', specs: '32GB DDR4 3200MHz', type: 'RAM', state: 'Bueno' },
    { code: 'DIS-001', serial: 'DISCSN-0001', brand: 'Samsung', model: '870 EVO', specs: '512GB SATA SSD', type: 'Discoduro', state: 'Bueno' },
    { code: 'DIS-002', serial: 'DISCSN-0002', brand: 'WD', model: 'SN730', specs: '1TB NVMe SSD', type: 'Discoduro', state: 'Bueno' },
    { code: 'CPU-011', serial: 'CPUSN-0011', brand: 'Intel', model: 'i5-12400', specs: '6 núcleos / 12 hilos, 2.5GHz', type: 'procesador', state: 'Bueno' },
    { code: 'CPU-012', serial: 'CPUSN-0012', brand: 'AMD', model: 'Ryzen 5 5600X', specs: '6 núcleos / 12 hilos, 3.7GHz', type: 'procesador', state: 'Bueno' },
    { code: 'GPU-002', serial: 'GPUSN-0002', brand: 'NVIDIA', model: 'GTX 1650', specs: '4GB GDDR5', type: 'tarjeta grafica', state: 'Bueno' },
    { code: 'WIF-001', serial: 'WIFSN-0001', brand: 'TP-Link', model: 'Archer T4E', specs: 'AC1200 PCIe', type: 'tarjeta wifi', state: 'Bueno' },
    { code: 'FUE-001', serial: 'FUESN-0001', brand: 'Corsair', model: 'CV650', specs: '650W 80 Plus Bronze', type: 'fuente', state: 'Bueno' },
    { code: 'FAN-001', serial: 'FANSN-0001', brand: 'Cooler Master', model: 'Hyper 212', specs: '120mm RGB', type: 'fancooler', state: 'Bueno' },
];

async function seedComponents() {
    console.log('Inicializando base de datos...');
    const initialized = await initDatabase();
    if (!initialized) {
        console.error('Error al conectar a la base de datos');
        process.exit(1);
    }

    try {
        console.log('Creando componentes de prueba...');
        let created = 0;
        for (const comp of componentsData) {
            const existing = await Component.findOne({ where: { code: comp.code } });
            if (!existing) {
                await Component.create(comp);
                console.log(`  Creado: ${comp.code} — ${comp.specs}`);
                created++;
            } else {
                console.log(`  Ya existe: ${comp.code}`);
            }
        }

        console.log(`\n¡Seed completado! ${created} componentes creados de ${componentsData.length} totales.`);
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

seedComponents();
