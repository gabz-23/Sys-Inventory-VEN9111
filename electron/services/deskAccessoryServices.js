import { DeskAccessory, DeskTable } from '../database.js';
import { logActivity } from './activityLogServices.js';
import { logItemMovement } from './itemTraceServices.js';

export const getAllDeskAccessories = async () => {
    const items = await DeskAccessory.findAll({ order: [['createdAt', 'ASC']] });
    const desks = await DeskTable.findAll({ attributes: ['id', 'code'] });
    const deskMap = {};
    desks.forEach((d) => {
        const data = d.toJSON();
        deskMap[data.id] = data.code;
    });
    return items.map((item) => {
        const data = item.toJSON();
        if (data.deskTableId && deskMap[data.deskTableId]) {
            data.deskCode = deskMap[data.deskTableId];
        }
        return data;
    });
};

export const createDeskAccessory = async (data) => {
    const created = await DeskAccessory.create(data);
    await logActivity('desk_accessory', created.id, 'created', created.code, created.description);
    return created.toJSON();
};

export const updateDeskAccessory = async (id, data) => {
    const old = await DeskAccessory.findByPk(id);
    await DeskAccessory.update(data, { where: { id } });
    const updated = await DeskAccessory.findByPk(id);
    if (!updated) throw new Error('Accesorio de escritorio no encontrado');

    if (old && data.deskTableId !== undefined && old.deskTableId !== data.deskTableId) {
        await logItemMovement({
            itemType: 'Acc. Escritorio',
            itemCode: updated.code,
            itemId: id,
            itemDescription: updated.description || updated.type,
            previousAssignmentId: old.deskTableId,
            newAssignmentId: data.deskTableId,
            movementReason: data.deskTableId ? 'Asignado a escritorio' : 'Desasignado de escritorio',
        });
    }

    await logActivity('desk_accessory', id, 'updated', updated.code, updated.description);
    return updated.toJSON();
};

export const deleteDeskAccessory = async (id) => {
    const item = await DeskAccessory.findByPk(id);
    await DeskAccessory.destroy({ where: { id } });
    if (item) await logActivity('desk_accessory', id, 'deleted', item.code, item.description);
};

export const duplicateDeskAccessories = async (ids) => {
    const originals = await DeskAccessory.findAll({ where: { id: ids } });
    const duplicated = [];
    for (const original of originals) {
        const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
        const baseCode = original.code.slice(0, 7);
        const newCode = `${baseCode}-DUP${suffix}`.slice(0, 15);
        const newSerial = original.serial
            ? `${original.serial}-DUP${Math.random().toString(36).slice(2, 5).toUpperCase()}`
            : null;
        const created = await DeskAccessory.create({
            code: newCode,
            serial: newSerial,
            description: original.description,
            type: original.type,
        });
        await logActivity('desk_accessory', created.id, 'created', created.code, created.description);
        duplicated.push(created.toJSON());
    }
    return duplicated;
};

export const deleteManyDeskAccessories = async (ids) => {
    for (const id of ids) {
        await deleteDeskAccessory(id);
    }
    return { success: true };
};
