import { Sequelize } from 'sequelize';
import { ComputerModel } from './models/Computer.js';
import { DeskDataTableModel } from './models/DeskTable.js';
import { ActivityLogModel } from './models/ActivityLog.js';
import { UserModel } from './models/User.js';
import { EmployeeModel } from './models/Employee.js';
import { DeskAccessoryModel } from './models/DeskAccessory.js';
import { ComponentModel } from './models/Component.js';
import { PeripheralModel } from './models/Peripheral.js';
import { ItemTraceModel } from './models/ItemTrace.js';

let sequelize;

export let Computer = null;
export let DeskTable = null;
export let ActivityLog = null;
export let User = null;
export let Employee = null;
export let DeskAccessory = null;
export let Component = null;
export let Peripheral = null;
export let ItemTrace = null;

export const initDatabase = async () => {
    try {
        sequelize = new Sequelize({
            dialect: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'dbpass901',
            database: 'sys_ven911',
            logging: false,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        });

        // Inicializar modelos
        Computer = ComputerModel(sequelize);
        DeskTable = DeskDataTableModel(sequelize);
        ActivityLog = ActivityLogModel(sequelize);
        User = UserModel(sequelize);
        Employee = EmployeeModel(sequelize);
        DeskAccessory = DeskAccessoryModel(sequelize);
        Component = ComponentModel(sequelize);
        Peripheral = PeripheralModel(sequelize);
        ItemTrace = ItemTraceModel(sequelize);

        // IMPORTANTE: El orden debe respetar las dependencias de foreign keys
        // 1º - Tablas sin FK dependencies
        await ActivityLog.sync();
        await User.sync();
        await Computer.sync();
        await Employee.sync();
        // 2º - Tablas que dependen de Computer y/o Employee
        await DeskTable.sync();     // FK -> computers, employees
        await Component.sync();     // FK -> computers
        await Peripheral.sync();    // FK -> computers
        // 3º - Tablas que dependen de DeskTable
        await DeskAccessory.sync(); // FK -> desktables
        // 4º - Tablas sin FK dependencies (trazabilidad)
        await ItemTrace.sync();

        // Migraciones manuales (agregar columnas nuevas sin alter: true)
        try {
            const tableInfo = await sequelize.getQueryInterface().describeTable('desk_accessories');
            if (!tableInfo.state) {
                await sequelize.query(
                    "ALTER TABLE desk_accessories ADD COLUMN state VARCHAR(20) NOT NULL DEFAULT 'Bueno'"
                );
                console.log('Migración: columna state agregada a desk_accessories');
            }
        } catch (err) {
            console.error('Error en migración:', err.message);
        }

        // Migración: actualizar estados eliminados ('Reparación' con acento)
        try {
            await sequelize.query(
                "UPDATE computers SET state = 'Dañado' WHERE state = 'Reparación'"
            );
            await sequelize.query(
                "UPDATE components SET state = 'Dañado' WHERE state = 'Reparación'"
            );
            await sequelize.query(
                "UPDATE peripherals SET state = 'Dañado' WHERE state = 'Reparación'"
            );
        } catch (err) {
            console.error('Error en migración de estados eliminados:', err.message);
        }

        // Migración: actualizar estados en minúscula a mayúscula inicial en desk_accessories
        try {
            await sequelize.query(
                "UPDATE desk_accessories SET state = 'Bueno' WHERE state = 'bueno'"
            );
            await sequelize.query(
                "UPDATE desk_accessories SET state = 'Dañado' WHERE state = 'dañado'"
            );
            await sequelize.query(
                "UPDATE desk_accessories SET state = 'Repuesto' WHERE state = 'repuesto'"
            );
            await sequelize.query(
                "UPDATE desk_accessories SET state = 'Reparado' WHERE state = 'reparado'"
            );
            await sequelize.query(
                "UPDATE desk_accessories SET state = 'Reconstruido' WHERE state = 'reconstruido'"
            );
        } catch (err) {
            console.error('Error en migración de estados a mayúscula:', err.message);
        }

        try {
            const computerColumns = await sequelize.getQueryInterface().describeTable('computers');
            if (!computerColumns.power_supply) {
                await sequelize.query(
                    "ALTER TABLE computers ADD COLUMN power_supply VARCHAR(100) DEFAULT ''"
                );
                console.log('Migración: columna power_supply agregada a computers');
            }
            if (!computerColumns.motherboard) {
                await sequelize.query(
                    "ALTER TABLE computers ADD COLUMN motherboard VARCHAR(100) DEFAULT ''"
                );
                console.log('Migración: columna motherboard agregada a computers');
            }
            if (!computerColumns.cooler) {
                await sequelize.query(
                    "ALTER TABLE computers ADD COLUMN cooler VARCHAR(100) DEFAULT ''"
                );
                console.log('Migración: columna cooler agregada a computers');
            }

            if (!computerColumns.cd_dvd) {
                await sequelize.query(
                    "ALTER TABLE computers ADD COLUMN cd_dvd VARCHAR(100) DEFAULT ''"
                );
                console.log('Migración: columna cd_dvd agregada a computers');
            }
        } catch (err) {
            console.error('Error en migración de columnas de computadores:', err.message);
        }

        // Migración: agregar columna state a components
        try {
            const componentColumns = await sequelize.getQueryInterface().describeTable('components');
            if (!componentColumns.state) {
                await sequelize.query(
                    "ALTER TABLE components ADD COLUMN state VARCHAR(30) NOT NULL DEFAULT 'Bueno'"
                );
                console.log('Migración: columna state agregada a components');
            }
        } catch (err) {
            console.error('Error en migración de columna state:', err.message);
        }

        // Migración: agregar columna state a peripherals
        try {
            const peripheralColumns = await sequelize.getQueryInterface().describeTable('peripherals');
            if (!peripheralColumns.state) {
                await sequelize.query(
                    "ALTER TABLE peripherals ADD COLUMN state VARCHAR(30) NOT NULL DEFAULT 'Bueno'"
                );
                console.log('Migración: columna state agregada a peripherals');
            }
        } catch (err) {
            console.error('Error en migración de columna state:', err.message);
        }

        // Migración: eliminar columna description de components
        try {
            const componentColumns = await sequelize.getQueryInterface().describeTable('components');
            if (componentColumns.description) {
                await sequelize.query(
                    "ALTER TABLE components DROP COLUMN description"
                );
                console.log('Migración: columna description eliminada de components');
            }
        } catch (err) {
            console.error('Error en migración de columna description:', err.message);
        }

        // Migración: cambiar serial de desk_accessories de VARCHAR(30) a VARCHAR(255)
        try {
            const accColumns = await sequelize.getQueryInterface().describeTable('desk_accessories');
            if (accColumns.serial && accColumns.serial.type === 'VARCHAR(30)') {
                await sequelize.query(
                    'ALTER TABLE desk_accessories MODIFY COLUMN serial VARCHAR(255)'
                );
                console.log('Migración: columna serial de desk_accessories cambiada a VARCHAR(255)');
            }
        } catch (err) {
            console.error('Error en migración de serial de desk_accessories:', err.message);
        }

        // Migración: asegurar columnas correctas en item_traces
        try {
            const traceColumns = await sequelize.getQueryInterface().describeTable('item_traces');
            if (!traceColumns.moved_from) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN moved_from VARCHAR(100) DEFAULT NULL");
                console.log('Migración: columna moved_from agregada a item_traces');
            }
            if (!traceColumns.moved_to) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN moved_to VARCHAR(100) DEFAULT NULL");
                console.log('Migración: columna moved_to agregada a item_traces');
            }
            if (!traceColumns.movement_date) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN movement_date DATE DEFAULT NULL");
                console.log('Migración: columna movement_date agregada a item_traces');
            }
            if (!traceColumns.movement_reason) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN movement_reason TEXT DEFAULT NULL");
                console.log('Migración: columna movement_reason agregada a item_traces');
            }
            if (!traceColumns.date_in_repair) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN date_in_repair DATE DEFAULT NULL");
                console.log('Migración: columna date_in_repair agregada a item_traces');
            }
            if (!traceColumns.created_by) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN created_by VARCHAR(100) DEFAULT NULL");
                console.log('Migración: columna created_by agregada a item_traces');
            }
            if (!traceColumns.date_damaged) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN date_damaged DATE DEFAULT NULL");
                console.log('Migración: columna date_damaged agregada a item_traces');
            }
            if (!traceColumns.date_repaired) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN date_repaired DATE DEFAULT NULL");
                console.log('Migración: columna date_repaired agregada a item_traces');
            }
            if (!traceColumns.date_reinstated) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN date_reinstated DATE DEFAULT NULL");
                console.log('Migración: columna date_reinstated agregada a item_traces');
            }
            if (!traceColumns.rebuilt) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN rebuilt TINYINT(1) NOT NULL DEFAULT 0");
                console.log('Migración: columna rebuilt agregada a item_traces');
            }
            if (!traceColumns.observations) {
                await sequelize.query("ALTER TABLE item_traces ADD COLUMN observations TEXT DEFAULT NULL");
                console.log('Migración: columna observations agregada a item_traces');
            }
            // Modificar columnas existentes que fueron creadas con NOT NULL
            const nullableDateColumns = ['date_damaged', 'date_repaired', 'date_reinstated', 'movement_date'];
            for (const col of nullableDateColumns) {
                if (traceColumns[col] && traceColumns[col].allowNull === false) {
                    await sequelize.query(`ALTER TABLE item_traces MODIFY COLUMN \`${col}\` DATE DEFAULT NULL`);
                    console.log(`Migración: columna ${col} modificada a nullable`);
                }
            }
            if (traceColumns.movement_reason && traceColumns.movement_reason.allowNull === false) {
                await sequelize.query("ALTER TABLE item_traces MODIFY COLUMN movement_reason TEXT DEFAULT NULL");
                console.log('Migración: columna movement_reason modificada a nullable');
            }
            if (traceColumns.observations && traceColumns.observations.allowNull === false) {
                await sequelize.query("ALTER TABLE item_traces MODIFY COLUMN observations TEXT DEFAULT NULL");
                console.log('Migración: columna observations modificada a nullable');
            }
            if (traceColumns.moved_from && traceColumns.moved_from.allowNull === false) {
                await sequelize.query("ALTER TABLE item_traces MODIFY COLUMN moved_from VARCHAR(100) DEFAULT NULL");
                console.log('Migración: columna moved_from modificada a nullable');
            }
            if (traceColumns.moved_to && traceColumns.moved_to.allowNull === false) {
                await sequelize.query("ALTER TABLE item_traces MODIFY COLUMN moved_to VARCHAR(100) DEFAULT NULL");
                console.log('Migración: columna moved_to modificada a nullable');
            }
        } catch (err) {
            if (!err.message.includes("doesn't exist")) {
                console.error('Error en migración de item_traces:', err.message);
            }
        }

        // Migración: eliminar unique constraints de code y serial en todas las tablas
        const uniqueTables = [
            { name: 'computers',      columns: ['code', 'serial'] },
            { name: 'peripherals',    columns: ['code', 'serial'] },
            { name: 'components',     columns: ['code', 'serial'] },
            { name: 'desktables',     columns: ['code'] },
            { name: 'desk_accessories', columns: ['code', 'serial'] },
        ];
        for (const table of uniqueTables) {
            try {
                const [indexes] = await sequelize.query(`SHOW INDEX FROM \`${table.name}\``);
                const uniqueIndexes = indexes.filter((idx) => !idx.Non_unique);
                for (const idx of uniqueIndexes) {
                    if (table.columns.includes(idx.Column_name)) {
                        await sequelize.query(
                            `ALTER TABLE \`${table.name}\` DROP INDEX \`${idx.Key_name}\``
                        );
                        console.log(`Migración: unique index ${idx.Key_name} eliminado de ${table.name}.${idx.Column_name}`);
                    }
                }
            } catch (err) {
                console.error(`Error en migración de unique indexes de ${table.name}:`, err.message);
            }
        }

        // Relaciones
        DeskTable.belongsTo(Computer, { foreignKey: 'computerId', as: 'computer' });
        Computer.hasOne(DeskTable, { foreignKey: 'computerId', as: 'deskTable' });

        DeskTable.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee', onDelete: 'SET NULL' });
        Employee.hasOne(DeskTable, { foreignKey: 'employeeId', as: 'deskTable' });

        DeskAccessory.belongsTo(DeskTable, { foreignKey: 'deskTableId', as: 'deskTable' });
        DeskTable.hasMany(DeskAccessory, { foreignKey: 'deskTableId', as: 'deskAccessories' });

        Component.belongsTo(Computer, { foreignKey: 'computerId', as: 'computer' });
        Computer.hasMany(Component, { foreignKey: 'computerId', as: 'components' });

        Peripheral.belongsTo(Computer, { foreignKey: 'computerId', as: 'computer' });
        Computer.hasMany(Peripheral, { foreignKey: 'computerId', as: 'peripherals' });

        // Autenticar la conexión a la base de datos
        await sequelize.authenticate();

        return true;
    } catch (error) {
        console.error('Error al conectar a MySQL:', error);
        return false;
    }
};
