import { Op } from 'sequelize';
import { DeskTable, Computer, Employee, DeskAccessory } from '../database.js';
import { logActivity } from './activityLogServices.js';
import { logItemMovement } from './itemTraceServices.js';

const accessoryTypeMap = {
    silla: 'chair',
    lampara: 'lamp',
    papelera: 'bin',
    archivero: 'archive',
    telefono: 'phone',
};

const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const attachAccessories = async (deskData) => {
    const accessories = await DeskAccessory.findAll({
        where: { deskTableId: deskData.id },
    });
    const accList = accessories.map((a) => a.toJSON());
    accList.forEach((acc) => {
        const key = accessoryTypeMap[normalize(acc.type)];
        if (key) {
            deskData[key] = acc;
        }
    });
    deskData.accessories = accList;
    return deskData;
};

const getDeskInclude = () => [
    {
        model: Computer,
        as: 'computer',
        attributes: ['id', 'code'],
        required: false,
    },
    {
        model: Employee,
        as: 'employee',
        attributes: ['id', 'nombres', 'apellidos'],
        required: false,
    },
];

const assignAccessories = async (deskId, accessories) => {
    if (accessories && Array.isArray(accessories) && accessories.length > 0) {
        const accessoryIds = accessories.map((acc) => acc.id || acc);
        await DeskAccessory.update(
            { deskTableId: deskId },
            { where: { id: accessoryIds } }
        );
    }
};

const unassignAccessories = async (deskId, keepIds) => {
    const where = { deskTableId: deskId };
    if (keepIds && keepIds.length > 0) {
        await DeskAccessory.update(
            { deskTableId: null },
            { where: { ...where, id: { [Op.notIn]: keepIds } } }
        );
    } else {
        await DeskAccessory.update(
            { deskTableId: null },
            { where }
        );
    }
};

export const getAllDeskTables = async () => {
    let deskTables = await DeskTable.findAll({
        include: getDeskInclude(),
        order: [['createdAt', 'ASC']],
    });

    const result = [];
    for (const desk of deskTables) {
        const deskData = desk.toJSON();
        if (deskData.computer) {
            deskData.computer = deskData.computer.code;
        } else {
            deskData.computer = null;
        }
        if (deskData.employee) {
            deskData.employeeName = `${deskData.employee.nombres} ${deskData.employee.apellidos}`;
        } else {
            deskData.employeeName = null;
        }
        result.push(await attachAccessories(deskData));
    }
    return result;
};

export const createDeskTable = async (data) => {
    const { computer, employee, accessories, ...deskData } = data;
    let deskDataWithRelations = { ...deskData };
    if (computer) deskDataWithRelations.computerId = computer;
    if (employee) deskDataWithRelations.employeeId = employee;

    const createDesk = await DeskTable.create(deskDataWithRelations);

    await assignAccessories(createDesk.id, accessories);

    const deskWithRelations = await DeskTable.findByPk(createDesk.id, {
        include: getDeskInclude(),
    });

    const deskDataFormatted = deskWithRelations.toJSON();
    if (deskDataFormatted.computer) {
        deskDataFormatted.computer = deskDataFormatted.computer.code;
    } else {
        deskDataFormatted.computer = null;
    }
    if (deskDataFormatted.employee) {
        deskDataFormatted.employeeName = `${deskDataFormatted.employee.nombres} ${deskDataFormatted.employee.apellidos}`;
    } else {
        deskDataFormatted.employeeName = null;
    }
    await attachAccessories(deskDataFormatted);

    await logActivity('desk', createDesk.id, 'created', createDesk.code, 'Escritorio');

    return deskDataFormatted;
};

export const updateDeskTable = async (id, data) => {
    const old = await DeskTable.findByPk(id);
    const { computer, employee, accessories, ...deskData } = data;
    let deskDataWithRelations = { ...deskData };
    if (computer !== undefined) deskDataWithRelations.computerId = computer || null;
    if (employee !== undefined) deskDataWithRelations.employeeId = employee || null;

    await DeskTable.update(deskDataWithRelations, { where: { id } });

    if (accessories !== undefined) {
        const keepIds = accessories.map((acc) => acc.id || acc);
        await unassignAccessories(id, keepIds);
        await assignAccessories(id, keepIds);
    }

    const updatedDesk = await DeskTable.findByPk(id, {
        include: getDeskInclude(),
    });

    if (!updatedDesk) {
        throw new Error('Escritorio no encontrado después de la actualización');
    }

    if (old && computer !== undefined && old.computerId !== deskDataWithRelations.computerId) {
        const computerItem = deskDataWithRelations.computerId
            ? await Computer.findByPk(deskDataWithRelations.computerId, { attributes: ['code'] })
            : null;
        await logItemMovement({
            itemType: 'Computadoras',
            itemCode: computerItem?.code || 'Desconocido',
            itemId: deskDataWithRelations.computerId || old.computerId,
            itemDescription: 'Computador',
            previousAssignmentId: old.computerId,
            newAssignmentId: deskDataWithRelations.computerId,
            movementReason: deskDataWithRelations.computerId
                ? `Asignado a escritorio ${updatedDesk.code}`
                : `Desasignado de escritorio ${updatedDesk.code}`,
        });
    }

    const deskDataFormatted = updatedDesk.toJSON();
    if (deskDataFormatted.computer) {
        deskDataFormatted.computer = deskDataFormatted.computer.code;
    } else {
        deskDataFormatted.computer = null;
    }
    if (deskDataFormatted.employee) {
        deskDataFormatted.employeeName = `${deskDataFormatted.employee.nombres} ${deskDataFormatted.employee.apellidos}`;
    } else {
        deskDataFormatted.employeeName = null;
    }
    await attachAccessories(deskDataFormatted);

    await logActivity('desk', id, 'updated', deskDataFormatted.code, 'Escritorio');

    return deskDataFormatted;
};

export const deleteDeskTable = async (id) => {
    const deskToDelete = await DeskTable.findByPk(id);

    await unassignAccessories(id);
    await DeskTable.destroy({ where: { id } });

    if (deskToDelete) {
        await logActivity('desk', id, 'deleted', deskToDelete.code, 'Escritorio');
    }

    return;
};

export const duplicateDeskTables = async (ids) => {
    const originals = await DeskTable.findAll({ where: { id: ids } });

    const duplicated = [];
    for (const original of originals) {
        const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
        const baseCode = original.code.slice(0, 7);
        const newCode = `${baseCode}-DUP${suffix}`.slice(0, 15);
        const created = await DeskTable.create({ code: newCode });

        await logActivity('desk', created.id, 'created', created.code, 'Escritorio');
        duplicated.push(created);
    }

    return duplicated;
};

export const deleteManyDeskTables = async (ids) => {
    for (const id of ids) {
        await deleteDeskTable(id);
    }
    return { success: true };
};
