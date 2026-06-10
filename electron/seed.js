import { initDatabase, Employee, Computer, DeskTable, Component, DeskAccessory, Peripheral } from './database.js';

const employeesData = [
    { nombres: 'María', apellidos: 'González', cedula: 'V-12345678', telefono: '0412-1234567', tipoEmpleado: 'Operador', estado: 'Activo', correo: 'maria.gonzalez@ven911.gob.ve' },
    { nombres: 'Pedro', apellidos: 'Ramírez', cedula: 'V-23456789', telefono: '0414-2345678', tipoEmpleado: 'Supervisor', estado: 'Activo', correo: 'pedro.ramirez@ven911.gob.ve' },
    { nombres: 'Ana', apellidos: 'Martínez', cedula: 'V-34567890', telefono: '0426-3456789', tipoEmpleado: 'Analista', estado: 'Activo', correo: 'ana.martinez@ven911.gob.ve' },
    { nombres: 'Luis', apellidos: 'Hernández', cedula: 'V-45678901', telefono: '0416-4567890', tipoEmpleado: 'Técnico', estado: 'Activo', correo: 'luis.hernandez@ven911.gob.ve' },
    { nombres: 'Carmen', apellidos: 'López', cedula: 'V-56789012', telefono: '0424-5678901', tipoEmpleado: 'Coordinador', estado: 'Activo', correo: 'carmen.lopez@ven911.gob.ve' },
    { nombres: 'José', apellidos: 'Rodríguez', cedula: 'V-67890123', telefono: '0412-6789012', tipoEmpleado: 'Operador', estado: 'Activo', correo: 'jose.rodriguez@ven911.gob.ve' },
    { nombres: 'Laura', apellidos: 'Fernández', cedula: 'V-78901234', telefono: '0414-7890123', tipoEmpleado: 'Analista', estado: 'Activo', correo: 'laura.fernandez@ven911.gob.ve' },
    { nombres: 'Carlos', apellidos: 'Torres', cedula: 'V-89012345', telefono: '0426-8901234', tipoEmpleado: 'Técnico', estado: 'Activo', correo: 'carlos.torres@ven911.gob.ve' },
    { nombres: 'Diana', apellidos: 'Mendoza', cedula: 'V-90123456', telefono: '0416-9012345', tipoEmpleado: 'Supervisor', estado: 'Activo', correo: 'diana.mendoza@ven911.gob.ve' },
    { nombres: 'Roberto', apellidos: 'Silva', cedula: 'V-01234567', telefono: '0424-0123456', tipoEmpleado: 'Operador', estado: 'Activo', correo: 'roberto.silva@ven911.gob.ve' },
];

const computersData = [
    { code: 'COMP-001', serial: 'SN-ABC-1001', computerType: 'Escritorio', brand: 'DELL', model: 'OptiPlex 3080', state: 'Bueno', cpu: 'Intel Core i5-10400', ramMemory: '16 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel UHD Graphics 630' },
    { code: 'COMP-002', serial: 'SN-ABC-1002', computerType: 'Laptop', brand: 'HP', model: 'ProBook 450 G8', state: 'Bueno', cpu: 'Intel Core i7-1165G7', ramMemory: '16 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel Iris Xe Graphics' },
    { code: 'COMP-003', serial: 'SN-ABC-1003', computerType: 'Escritorio', brand: 'Lenovo', model: 'ThinkCentre M720', state: 'Bueno', cpu: 'Intel Core i3-9100', ramMemory: '8 GB', storage: '256 GB', storageType: 'SSD', operatingSystem: 'Windows 10 Pro 64-bit', graphicCard: 'Intel UHD Graphics 610' },
    { code: 'COMP-004', serial: 'SN-ABC-1004', computerType: 'Laptop', brand: 'Dell', model: 'Latitude 5420', state: 'Dañado', cpu: 'Intel Core i5-1135G7', ramMemory: '8 GB', storage: '256 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel Iris Xe Graphics' },
    { code: 'COMP-005', serial: 'SN-ABC-1005', computerType: 'Escritorio', brand: 'HP', model: 'EliteDesk 800 G6', state: 'Bueno', cpu: 'Intel Core i7-10700', ramMemory: '32 GB', storage: '1 TB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'NVIDIA GeForce GT 1030' },
    { code: 'COMP-006', serial: 'SN-ABC-1006', computerType: 'Escritorio', brand: 'DELL', model: 'OptiPlex 7080', state: 'Bueno', cpu: 'Intel Core i7-10700', ramMemory: '32 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel UHD Graphics 630' },
    { code: 'COMP-007', serial: 'SN-ABC-1007', computerType: 'Laptop', brand: 'Lenovo', model: 'ThinkPad X1 Carbon', state: 'Bueno', cpu: 'Intel Core i5-1135G7', ramMemory: '16 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel Iris Xe Graphics' },
    { code: 'COMP-008', serial: 'SN-ABC-1008', computerType: 'Escritorio', brand: 'HP', model: 'ProDesk 400 G7', state: 'Repuesto', cpu: 'Intel Core i3-10100', ramMemory: '8 GB', storage: '256 GB', storageType: 'SSD', operatingSystem: 'Windows 10 Pro 64-bit', graphicCard: 'Intel UHD Graphics 610' },
    { code: 'COMP-009', serial: 'SN-ABC-1009', computerType: 'Escritorio', brand: 'DELL', model: 'Precision 3650', state: 'Bueno', cpu: 'Intel Core i9-10900K', ramMemory: '64 GB', storage: '1 TB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'NVIDIA Quadro RTX 4000' },
    { code: 'COMP-010', serial: 'SN-ABC-1010', computerType: 'Laptop', brand: 'HP', model: 'EliteBook 850 G8', state: 'Bueno', cpu: 'Intel Core i7-1185G7', ramMemory: '16 GB', storage: '512 GB', storageType: 'SSD', operatingSystem: 'Windows 11 Pro 64-bit', graphicCard: 'Intel Iris Xe Graphics' },
];

const desksData = [
    { code: 'ESC-001', employeeIndex: 0, computerIndex: 0 },
    { code: 'ESC-002', employeeIndex: 1, computerIndex: 1 },
    { code: 'ESC-003', employeeIndex: 2, computerIndex: 2 },
    { code: 'ESC-004', employeeIndex: 3, computerIndex: 3 },
    { code: 'ESC-005', employeeIndex: 4, computerIndex: 4 },
    { code: 'ESC-006', employeeIndex: 5, computerIndex: 5 },
    { code: 'ESC-007', employeeIndex: 6, computerIndex: 6 },
    { code: 'ESC-008', employeeIndex: 7, computerIndex: 7 },
    { code: 'ESC-009', employeeIndex: 8, computerIndex: 8 },
    { code: 'ESC-010', employeeIndex: 9, computerIndex: 9 },
];

const componentsData = [
    // Computer 0 (DELL OptiPlex 3080)
    { code: 'CPU-001', serial: 'CPUSN-0001', brand: 'Intel', model: 'i5-10400', specs: '6 núcleos / 12 hilos, 2.9GHz', type: 'Procesador', state: 'Bueno', computerIndex: 0 },
    { code: 'RAM-001', serial: 'RAMSN-0001', brand: 'Kingston', model: 'KVR26N19S8/16', specs: '16GB DDR4 2666MHz', type: 'Memoria RAM', state: 'Bueno', computerIndex: 0 },
    { code: 'STO-001', serial: 'STOSN-0001', brand: 'Samsung', model: '870 EVO', specs: '512GB SATA SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 0 },

    // Computer 1 (HP ProBook 450 G8)
    { code: 'CPU-002', serial: 'CPUSN-0002', brand: 'Intel', model: 'i7-1165G7', specs: '4 núcleos / 8 hilos, 2.8GHz', type: 'Procesador', state: 'Bueno', computerIndex: 1 },
    { code: 'RAM-002', serial: 'RAMSN-0002', brand: 'Samsung', model: 'M471A2K43DB1', specs: '16GB DDR4 3200MHz', type: 'Memoria RAM', state: 'Bueno', computerIndex: 1 },
    { code: 'STO-002', serial: 'STOSN-0002', brand: 'WD', model: 'SN730', specs: '512GB NVMe SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 1 },

    // Computer 2 (Lenovo ThinkCentre M720)
    { code: 'CPU-003', serial: 'CPUSN-0003', brand: 'Intel', model: 'i3-9100', specs: '4 núcleos / 4 hilos, 3.6GHz', type: 'Procesador', state: 'Bueno', computerIndex: 2 },
    { code: 'RAM-003', serial: 'RAMSN-0003', brand: 'Corsair', model: 'CMV8GX4M1A2400C16', specs: '8GB DDR4 2400MHz', type: 'Memoria RAM', state: 'Bueno', computerIndex: 2 },
    { code: 'STO-003', serial: 'STOSN-0003', brand: 'Kingston', model: 'A400', specs: '256GB SATA SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 2 },

    // Computer 3 (Dell Latitude 5420)
    { code: 'CPU-004', serial: 'CPUSN-0004', brand: 'Intel', model: 'i5-1135G7', specs: '4 núcleos / 8 hilos, 2.4GHz', type: 'Procesador', state: 'Bueno', computerIndex: 3 },
    { code: 'RAM-004', serial: 'RAMSN-0004', brand: 'Samsung', model: 'M471A1K43DB1', specs: '8GB DDR4 3200MHz', type: 'Memoria RAM', state: 'Bueno', computerIndex: 3 },
    { code: 'STO-004', serial: 'STOSN-0004', brand: 'WD', model: 'SN530', specs: '256GB NVMe SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 3 },

    // Computer 4 (HP EliteDesk 800 G6)
    { code: 'CPU-005', serial: 'CPUSN-0005', brand: 'Intel', model: 'i7-10700', specs: '8 núcleos / 16 hilos, 2.9GHz', type: 'Procesador', state: 'Bueno', computerIndex: 4 },
    { code: 'RAM-005', serial: 'RAMSN-0005', brand: 'Kingston', model: 'KVR32N22D8/32', specs: '32GB DDR4 3200MHz (2x16)', type: 'Memoria RAM', state: 'Bueno', computerIndex: 4 },
    { code: 'STO-005', serial: 'STOSN-0005', brand: 'Samsung', model: '870 EVO', specs: '1TB SATA SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 4 },

    // Computer 5 (DELL OptiPlex 7080)
    { code: 'CPU-006', serial: 'CPUSN-0006', brand: 'Intel', model: 'i7-10700', specs: '8 núcleos / 16 hilos, 2.9GHz', type: 'Procesador', state: 'Bueno', computerIndex: 5 },
    { code: 'RAM-006', serial: 'RAMSN-0006', brand: 'Corsair', model: 'Vengeance LPX 32GB', specs: '32GB DDR4 2666MHz (2x16)', type: 'Memoria RAM', state: 'Bueno', computerIndex: 5 },
    { code: 'STO-006', serial: 'STOSN-0006', brand: 'Samsung', model: '980 Pro', specs: '512GB NVMe SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 5 },

    // Computer 6 (Lenovo ThinkPad X1 Carbon)
    { code: 'CPU-007', serial: 'CPUSN-0007', brand: 'Intel', model: 'i5-1135G7', specs: '4 núcleos / 8 hilos, 2.4GHz', type: 'Procesador', state: 'Bueno', computerIndex: 6 },
    { code: 'RAM-007', serial: 'RAMSN-0007', brand: 'Samsung', model: 'M471A2K43DB1', specs: '16GB DDR4 3200MHz', type: 'Memoria RAM', state: 'Bueno', computerIndex: 6 },
    { code: 'STO-007', serial: 'STOSN-0007', brand: 'Samsung', model: 'PM9A1', specs: '512GB NVMe SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 6 },

    // Computer 7 (HP ProDesk 400 G7) — spare/repuesto computer
    { code: 'CPU-008', serial: 'CPUSN-0008', brand: 'Intel', model: 'i3-10100', specs: '4 núcleos / 8 hilos, 3.6GHz', type: 'Procesador', state: 'Bueno', computerIndex: 7 },
    { code: 'RAM-008', serial: 'RAMSN-0008', brand: 'Kingston', model: 'KVR26N19S8/8', specs: '8GB DDR4 2666MHz', type: 'Memoria RAM', state: 'Bueno', computerIndex: 7 },
    { code: 'STO-008', serial: 'STOSN-0008', brand: 'Kingston', model: 'A400', specs: '256GB SATA SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 7 },

    // Computer 8 (DELL Precision 3650)
    { code: 'CPU-009', serial: 'CPUSN-0009', brand: 'Intel', model: 'i9-10900K', specs: '10 núcleos / 20 hilos, 3.7GHz', type: 'Procesador', state: 'Bueno', computerIndex: 8 },
    { code: 'RAM-009', serial: 'RAMSN-0009', brand: 'Corsair', model: 'Vengeance LPX 64GB', specs: '64GB DDR4 3200MHz (4x16)', type: 'Memoria RAM', state: 'Bueno', computerIndex: 8 },
    { code: 'STO-009', serial: 'STOSN-0009', brand: 'Samsung', model: '980 Pro', specs: '1TB NVMe SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 8 },
    { code: 'GPU-001', serial: 'GPUSN-0001', brand: 'NVIDIA', model: 'Quadro RTX 4000', specs: '8GB GDDR6, 2304 CUDA cores', type: 'Tarjeta Gráfica', state: 'Bueno', computerIndex: 8 },

    // Computer 9 (HP EliteBook 850 G8)
    { code: 'CPU-010', serial: 'CPUSN-0010', brand: 'Intel', model: 'i7-1185G7', specs: '4 núcleos / 8 hilos, 3.0GHz', type: 'Procesador', state: 'Bueno', computerIndex: 9 },
    { code: 'RAM-010', serial: 'RAMSN-0010', brand: 'Samsung', model: 'M471A2K43DB1', specs: '16GB DDR4 3200MHz', type: 'Memoria RAM', state: 'Bueno', computerIndex: 9 },
    { code: 'STO-010', serial: 'STOSN-0010', brand: 'WD', model: 'SN730', specs: '512GB NVMe SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: 9 },

    // Extra spare components (unassigned — available for cannibalization)
    { code: 'RAM-011', serial: 'RAMSN-0011', brand: 'Kingston', model: 'KVR26N19S8/8', specs: '8GB DDR4 2666MHz', type: 'Memoria RAM', state: 'Bueno', computerIndex: null },
    { code: 'RAM-012', serial: 'RAMSN-0012', brand: 'Corsair', model: 'CMV8GX4M1A2400C16', specs: '8GB DDR4 2400MHz', type: 'Memoria RAM', state: 'Repuesto', computerIndex: null },
    { code: 'STO-011', serial: 'STOSN-0011', brand: 'Kingston', model: 'A400', specs: '480GB SATA SSD', type: 'Disco / Almacenamiento', state: 'Bueno', computerIndex: null },
    { code: 'STO-012', serial: 'STOSN-0012', brand: 'Seagate', model: 'Barracuda', specs: '1TB HDD 7200RPM', type: 'Disco / Almacenamiento', state: 'Dañado', computerIndex: null },
];

const peripheralsData = [
    // Computer 0
    { code: 'TEC-001', serial: 'TECSN-0001', description: 'Teclado USB Dell KB216', brand: 'Dell', model: 'KB216', type: 'Teclado', connectionType: 'USB', state: 'Bueno', computerIndex: 0 },
    { code: 'MOU-001', serial: 'MOUSN-0001', description: 'Mouse USB Dell MS116', brand: 'Dell', model: 'MS116', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 0 },
    { code: 'MON-001', serial: 'MONSN-0001', description: 'Monitor Dell 22 pulgadas', brand: 'Dell', model: 'E2223HN', type: 'Monitor', connectionType: 'HDMI', state: 'Bueno', computerIndex: 0 },

    // Computer 1
    { code: 'TEC-002', serial: 'TECSN-0002', description: 'Teclado HP KU-1465', brand: 'HP', model: 'KU-1465', type: 'Teclado', connectionType: 'USB', state: 'Bueno', computerIndex: 1 },
    { code: 'MOU-002', serial: 'MOUSN-0002', description: 'Mouse HP S1500', brand: 'HP', model: 'S1500', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 1 },

    // Computer 2
    { code: 'TEC-003', serial: 'TECSN-0003', description: 'Teclado Lenovo Preferred Pro', brand: 'Lenovo', model: 'Preferred Pro', type: 'Teclado', connectionType: 'USB', state: 'Bueno', computerIndex: 2 },
    { code: 'MOU-003', serial: 'MOUSN-0003', description: 'Mouse Lenovo 150', brand: 'Lenovo', model: '150', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 2 },
    { code: 'MON-002', serial: 'MONSN-0002', description: 'Monitor LG 24 pulgadas', brand: 'LG', model: '24MK430H', type: 'Monitor', connectionType: 'HDMI', state: 'Bueno', computerIndex: 2 },

    // Computer 3
    { code: 'TEC-004', serial: 'TECSN-0004', description: 'Teclado Dell KB216', brand: 'Dell', model: 'KB216', type: 'Teclado', connectionType: 'USB', state: 'Dañado', computerIndex: 3 },
    { code: 'MOU-004', serial: 'MOUSN-0004', description: 'Mouse Dell MS116', brand: 'Dell', model: 'MS116', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 3 },

    // Computer 4
    { code: 'TEC-005', serial: 'TECSN-0005', description: 'Teclado HP Premium', brand: 'HP', model: 'Premium KP-0199', type: 'Teclado', connectionType: 'USB', state: 'Bueno', computerIndex: 4 },
    { code: 'MOU-005', serial: 'MOUSN-0005', description: 'Mouse HP Premium', brand: 'HP', model: 'Premium M-100', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 4 },
    { code: 'MON-003', serial: 'MONSN-0003', description: 'Monitor HP 27 pulgadas', brand: 'HP', model: '27f', type: 'Monitor', connectionType: 'HDMI', state: 'Bueno', computerIndex: 4 },
    { code: 'PAR-001', serial: 'PARSN-0001', description: 'Parlante Logitech Z150', brand: 'Logitech', model: 'Z150', type: 'Parlante', connectionType: 'USB / Audio', state: 'Bueno', computerIndex: 4 },

    // Computer 5
    { code: 'TEC-006', serial: 'TECSN-0006', description: 'Teclado Dell KB216', brand: 'Dell', model: 'KB216', type: 'Teclado', connectionType: 'USB', state: 'Bueno', computerIndex: 5 },
    { code: 'MOU-006', serial: 'MOUSN-0006', description: 'Mouse Dell MS116', brand: 'Dell', model: 'MS116', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 5 },
    { code: 'MON-004', serial: 'MONSN-0004', description: 'Monitor Dell 22 pulgadas', brand: 'Dell', model: 'E2223HN', type: 'Monitor', connectionType: 'HDMI', state: 'Bueno', computerIndex: 5 },

    // Computer 6
    { code: 'TEC-007', serial: 'TECSN-0007', description: 'Teclado Lenovo Preferred Pro', brand: 'Lenovo', model: 'Preferred Pro', type: 'Teclado', connectionType: 'USB', state: 'Bueno', computerIndex: 6 },
    { code: 'MOU-007', serial: 'MOUSN-0007', description: 'Mouse Lenovo 150', brand: 'Lenovo', model: '150', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 6 },

    // Computer 7
    { code: 'TEC-008', serial: 'TECSN-0008', description: 'Teclado HP KU-1465', brand: 'HP', model: 'KU-1465', type: 'Teclado', connectionType: 'USB', state: 'Bueno', computerIndex: 7 },
    { code: 'MOU-008', serial: 'MOUSN-0008', description: 'Mouse HP S1500', brand: 'HP', model: 'S1500', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 7 },
    { code: 'MON-005', serial: 'MONSN-0005', description: 'Monitor HP 22 pulgadas', brand: 'HP', model: 'V22', type: 'Monitor', connectionType: 'HDMI', state: 'Bueno', computerIndex: 7 },

    // Computer 8
    { code: 'TEC-009', serial: 'TECSN-0009', description: 'Teclado Dell Premium KB216', brand: 'Dell', model: 'KB216', type: 'Teclado', connectionType: 'USB', state: 'Bueno', computerIndex: 8 },
    { code: 'MOU-009', serial: 'MOUSN-0009', description: 'Mouse Dell MS116', brand: 'Dell', model: 'MS116', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 8 },
    { code: 'MON-006', serial: 'MONSN-0006', description: 'Monitor Dell 27 pulgadas 4K', brand: 'Dell', model: 'S2721QS', type: 'Monitor', connectionType: 'HDMI / DP', state: 'Bueno', computerIndex: 8 },

    // Computer 9
    { code: 'TEC-010', serial: 'TECSN-0010', description: 'Teclado HP Premium KP-0199', brand: 'HP', model: 'KP-0199', type: 'Teclado', connectionType: 'USB', state: 'Bueno', computerIndex: 9 },
    { code: 'MOU-010', serial: 'MOUSN-0010', description: 'Mouse HP Premium M-100', brand: 'HP', model: 'M-100', type: 'Mouse', connectionType: 'USB', state: 'Bueno', computerIndex: 9 },

    // Extra spare peripherals (unassigned)
    { code: 'MON-007', serial: 'MONSN-0007', description: 'Monitor LG 22 pulgadas', brand: 'LG', model: '22MK400H', type: 'Monitor', connectionType: 'HDMI', state: 'Bueno', computerIndex: null },
    { code: 'IMP-001', serial: 'IMPSN-0001', description: 'Impresora HP LaserJet Pro', brand: 'HP', model: 'M404dn', type: 'Impresora', connectionType: 'USB / Red', state: 'Bueno', computerIndex: null },
    { code: 'IMP-002', serial: 'IMPSN-0002', description: 'Impresora Epson L3250', brand: 'Epson', model: 'L3250', type: 'Impresora', connectionType: 'USB', state: 'Bueno', computerIndex: null },
    { code: 'CAM-001', serial: 'CAMSN-0001', description: 'Cámara Web Logitech C920', brand: 'Logitech', model: 'C920', type: 'Cámara', connectionType: 'USB', state: 'Bueno', computerIndex: null },
    { code: 'PAR-002', serial: 'PARSN-0002', description: 'Parlante Genius SP-HF180', brand: 'Genius', model: 'SP-HF180', type: 'Parlante', connectionType: 'USB / Audio', state: 'Dañado', computerIndex: null },
];

const deskAccessoriesData = [
    // Desk 0 (ESC-001)
    { code: 'SIL-001', serial: 'SILSN-0001', description: 'Silla ergonómica', type: 'silla', deskIndex: 0 },
    { code: 'LAM-001', serial: 'LAMSN-0001', description: 'Lámpara de escritorio LED', type: 'lampara', deskIndex: 0 },
    { code: 'PAP-001', serial: 'PAPSN-0001', description: 'Papelera metálica', type: 'papelera', deskIndex: 0 },

    // Desk 1 (ESC-002)
    { code: 'TEL-001', serial: 'TELSN-0001', description: 'Teléfono IP Cisco 7841', type: 'telefono', deskIndex: 1 },
    { code: 'ARC-001', serial: 'ARCSN-0001', description: 'Archivero metálico 3 gavetas', type: 'archivero', deskIndex: 1 },

    // Desk 2 (ESC-003)
    { code: 'SIL-002', serial: 'SILSN-0002', description: 'Silla ejecutiva', type: 'silla', deskIndex: 2 },
    { code: 'LAM-002', serial: 'LAMSN-0002', description: 'Lámpara fluorescente', type: 'lampara', deskIndex: 2 },

    // Desk 3 (ESC-004)
    { code: 'PAP-002', serial: 'PAPSN-0002', description: 'Papelera plástica', type: 'papelera', deskIndex: 3 },
    { code: 'TEL-002', serial: 'TELSN-0002', description: 'Teléfono IP Grandstream GXP2130', type: 'telefono', deskIndex: 3 },

    // Desk 4 (ESC-005)
    { code: 'SIL-003', serial: 'SILSN-0003', description: 'Silla ergonómica', type: 'silla', deskIndex: 4 },
    { code: 'ARC-002', serial: 'ARCSN-0002', description: 'Archivero metálico 2 gavetas', type: 'archivero', deskIndex: 4 },
    { code: 'LAM-003', serial: 'LAMSN-0003', description: 'Lámpara LED ajustable', type: 'lampara', deskIndex: 4 },

    // Desk 5 (ESC-006)
    { code: 'TEL-003', serial: 'TELSN-0003', description: 'Teléfono IP Cisco 7841', type: 'telefono', deskIndex: 5 },
    { code: 'PAP-003', serial: 'PAPSN-0003', description: 'Papelera metálica', type: 'papelera', deskIndex: 5 },

    // Desk 6 (ESC-007)
    { code: 'SIL-004', serial: 'SILSN-0004', description: 'Silla ejecutiva', type: 'silla', deskIndex: 6 },
    { code: 'LAM-004', serial: 'LAMSN-0004', description: 'Lámpara de escritorio LED', type: 'lampara', deskIndex: 6 },
    { code: 'ARC-003', serial: 'ARCSN-0003', description: 'Archivero metálico 4 gavetas', type: 'archivero', deskIndex: 6 },

    // Desk 7 (ESC-008)
    { code: 'PAP-004', serial: 'PAPSN-0004', description: 'Papelera plástica', type: 'papelera', deskIndex: 7 },

    // Desk 8 (ESC-009)
    { code: 'SIL-005', serial: 'SILSN-0005', description: 'Silla ergonómica', type: 'silla', deskIndex: 8 },
    { code: 'TEL-004', serial: 'TELSN-0004', description: 'Teléfono IP Grandstream GXP2130', type: 'telefono', deskIndex: 8 },
    { code: 'LAM-005', serial: 'LAMSN-0005', description: 'Lámpara fluorescente', type: 'lampara', deskIndex: 8 },

    // Desk 9 (ESC-010)
    { code: 'SIL-006', serial: 'SILSN-0006', description: 'Silla ejecutiva', type: 'silla', deskIndex: 9 },
    { code: 'ARC-004', serial: 'ARCSN-0004', description: 'Archivero metálico 3 gavetas', type: 'archivero', deskIndex: 9 },
    { code: 'PAP-005', serial: 'PAPSN-0005', description: 'Papelera metálica', type: 'papelera', deskIndex: 9 },

    // Extra spare accessories (unassigned)
    { code: 'SIL-007', serial: 'SILSN-0007', description: 'Silla estándar', type: 'silla', deskIndex: null, state: 'repuesto' },
    { code: 'LAM-006', serial: 'LAMSN-0006', description: 'Lámpara LED', type: 'lampara', deskIndex: null },
    { code: 'TEL-005', serial: 'TELSN-0005', description: 'Teléfono IP Cisco 7841', type: 'telefono', deskIndex: null, state: 'Dañado' },
];

async function seed() {
    console.log('Inicializando base de datos...');
    const initialized = await initDatabase();
    if (!initialized) {
        console.error('Error al conectar a la base de datos');
        process.exit(1);
    }

    try {
        // 1. Empleados
        console.log('Creando empleados...');
        const createdEmployees = [];
        for (const emp of employeesData) {
            const [employee, created] = await Employee.findOrCreate({ where: { cedula: emp.cedula }, defaults: emp });
            createdEmployees.push(employee);
            console.log(`  ${created ? 'Creado' : 'Ya existe'}: ${emp.nombres} ${emp.apellidos}`);
        }

        // 2. Computadores
        console.log('Creando computadores...');
        const createdComputers = [];
        for (const comp of computersData) {
            const [computer, created] = await Computer.findOrCreate({ where: { code: comp.code }, defaults: comp });
            createdComputers.push(computer);
            console.log(`  ${created ? 'Creado' : 'Ya existe'}: ${comp.code}`);
        }

        // 3. Escritorios
        console.log('Creando escritorios...');
        const createdDesks = [];
        for (const desk of desksData) {
            const existing = await DeskTable.findOne({ where: { code: desk.code } });
            if (!existing) {
                const d = await DeskTable.create({
                    code: desk.code,
                    employeeId: desk.employeeIndex !== null ? createdEmployees[desk.employeeIndex].id : null,
                    computerId: desk.computerIndex !== null ? createdComputers[desk.computerIndex].id : null,
                });
                createdDesks.push(d);
                console.log(`  Creado: ${desk.code}`);
            } else {
                createdDesks.push(existing);
                console.log(`  Ya existe: ${desk.code}`);
            }
        }

        // 4. Componentes
        console.log('Creando componentes...');
        for (const comp of componentsData) {
            const existing = await Component.findOne({ where: { code: comp.code } });
            if (!existing) {
                await Component.create({
                    code: comp.code,
                    serial: comp.serial,
                    brand: comp.brand,
                    model: comp.model,
                    specs: comp.specs,
                    type: comp.type,
                    state: comp.state,
                    computerId: comp.computerIndex !== null ? createdComputers[comp.computerIndex].id : null,
                });
                console.log(`  Creado: ${comp.code}`);
            } else {
                console.log(`  Ya existe: ${comp.code}`);
            }
        }

        // 5. Accesorios de escritorio
        console.log('Creando accesorios de escritorio...');
        for (const acc of deskAccessoriesData) {
            const existing = await DeskAccessory.findOne({ where: { code: acc.code } });
            if (!existing) {
                await DeskAccessory.create({
                    code: acc.code,
                    serial: acc.serial,
                    description: acc.description,
                    type: acc.type,
                    state: acc.state || 'bueno',
                    deskTableId: acc.deskIndex !== null ? createdDesks[acc.deskIndex].id : null,
                });
                console.log(`  Creado: ${acc.code}`);
            } else {
                console.log(`  Ya existe: ${acc.code}`);
            }
        }

        // 6. Periféricos
        console.log('Creando periféricos...');
        for (const per of peripheralsData) {
            const existing = await Peripheral.findOne({ where: { code: per.code } });
            if (!existing) {
                await Peripheral.create({
                    code: per.code,
                    serial: per.serial,
                    description: per.description,
                    brand: per.brand,
                    model: per.model,
                    type: per.type,
                    connectionType: per.connectionType,
                    state: per.state,
                    computerId: per.computerIndex !== null ? createdComputers[per.computerIndex].id : null,
                });
                console.log(`  Creado: ${per.code}`);
            } else {
                console.log(`  Ya existe: ${per.code}`);
            }
        }

        console.log('\n¡Seed completado exitosamente!');
        console.log(`  ${createdEmployees.length} empleados`);
        console.log(`  ${createdComputers.length} computadores`);
        console.log(`  ${createdDesks.length} escritorios`);
        console.log(`  ${componentsData.length} componentes`);
        console.log(`  ${deskAccessoriesData.length} accesorios de escritorio`);
        console.log(`  ${peripheralsData.length} periféricos`);
        process.exit(0);
    } catch (error) {
        console.error('Error durante el seed:', error);
        process.exit(1);
    }
}

seed();
