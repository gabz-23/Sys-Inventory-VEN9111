import { Op } from 'sequelize';
import { DeskAccessory, DeskTable } from '../database.js';
import { logActivity } from './activityLogServices.js';
import { logItemMovement } from './itemTraceServices.js';
import { generateCode, generateUniqueSerial } from '../helpers/generateCode.js';

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

const validateUniqueCodeAndSerial = async (data, excludeId = null) => {
    const whereExclude = excludeId ? { id: { [Op.ne]: excludeId } } : {};

    if (data.code) {
        const existing = await DeskAccessory.findOne({ where: { ...whereExclude, code: data.code } });
        if (existing) {
            throw new Error(`VALIDATION_ERROR:code:El código "${data.code}" ya está registrado`);
        }
    }

    if (data.serial) {
        const existing = await DeskAccessory.findOne({ where: { ...whereExclude, serial: data.serial } });
        if (existing) {
            throw new Error(`VALIDATION_ERROR:serial:El serial "${data.serial}" ya está registrado`);
        }
    }
};

export const createDeskAccessory = async (data) => {
    await validateUniqueCodeAndSerial(data);

    const created = await DeskAccessory.create(data);
    await logActivity('desk_accessory', created.id, 'created', created.code, created.description);
    return created.toJSON();
};

export const updateDeskAccessory = async (id, data) => {
    const old = await DeskAccessory.findByPk(id);

    await validateUniqueCodeAndSerial(data, id);

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
    for (const _original of originals) {
        let newCode;
        let retries = 0;
        do {
            newCode = generateCode({ tag: 'ACC' });
            retries++;
        } while (await DeskAccessory.findOne({ where: { code: newCode } }) && retries < 20);

        let newSerial;
        retries = 0;
        do {
            newSerial = generateUniqueSerial(null);
            retries++;
        } while (await DeskAccessory.findOne({ where: { serial: newSerial } }) && retries < 20);

        const created = await DeskAccessory.create({
            code: newCode,
            serial: newSerial,
            description: _original.description,
            type: _original.type,
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
