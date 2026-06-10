import { Peripheral, Computer } from '../database.js';
import { logActivity } from './activityLogServices.js';
import { logItemMovement } from './itemTraceServices.js';

export const getAllPeripherals = async () => {
    const items = await Peripheral.findAll({
        include: [{ model: Computer, as: 'computer', attributes: ['code'] }],
        order: [['createdAt', 'ASC']],
    });
    return items.map((item) => item.toJSON());
};

export const createPeripheral = async (data) => {
    const created = await Peripheral.create(data);
    await logActivity('peripheral', created.id, 'created', created.code, created.description);
    return created.toJSON();
};

export const updatePeripheral = async (id, data) => {
    const old = await Peripheral.findByPk(id);
    await Peripheral.update(data, { where: { id } });
    const updated = await Peripheral.findByPk(id);
    if (!updated) throw new Error('Periférico no encontrado');

    if (old && data.computerId !== undefined && old.computerId !== data.computerId) {
        await logItemMovement({
            itemType: 'Periféricos',
            itemCode: updated.code,
            itemId: id,
            itemDescription: updated.description,
            previousAssignmentId: old.computerId,
            newAssignmentId: data.computerId,
            movementReason: data.computerId ? 'Asignado a computador' : 'Desasignado de computador',
        });
    }

    await logActivity('peripheral', id, 'updated', updated.code, updated.description);
    return updated.toJSON();
};

export const deletePeripheral = async (id) => {
    const item = await Peripheral.findByPk(id);
    await Peripheral.destroy({ where: { id } });
    if (item) await logActivity('peripheral', id, 'deleted', item.code, item.description);
};

export const duplicatePeripherals = async (ids) => {
    const originals = await Peripheral.findAll({ where: { id: ids } });
    const duplicated = [];
    for (const original of originals) {
        const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
        const baseCode = original.code.slice(0, 8);
        const newCode = `${baseCode}-DUP${suffix}`.slice(0, 15);
        const newSerial = original.serial
            ? `${original.serial.slice(0, 23)}-DUP${suffix}`.slice(0, 30)
            : null;
        const created = await Peripheral.create({
            code: newCode,
            serial: newSerial,
            description: original.description,
            brand: original.brand,
            model: original.model,
            connectionType: original.connectionType,
            type: original.type,
            state: original.state,
            computerId: null,
        });
        await logActivity('peripheral', created.id, 'created', created.code, created.description);
        duplicated.push(created.toJSON());
    }
    return duplicated;
};

export const deleteManyPeripherals = async (ids) => {
    for (const id of ids) {
        await deletePeripheral(id);
    }
    return { success: true };
};
