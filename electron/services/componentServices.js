import { Component } from '../database.js';
import { logActivity } from './activityLogServices.js';
import { logItemMovement } from './itemTraceServices.js';

export const getAllComponents = async () => {
    const items = await Component.findAll({ order: [['createdAt', 'ASC']] });
    return items.map((item) => item.toJSON());
};

export const createComponent = async (data) => {
    const created = await Component.create(data);
    const title = created.specs || `${created.brand} ${created.model}`.trim() || created.code;
    await logActivity('component', created.id, 'created', created.code, title);
    return created.toJSON();
};

export const updateComponent = async (id, data) => {
    const old = await Component.findByPk(id);
    await Component.update(data, { where: { id } });
    const updated = await Component.findByPk(id);
    if (!updated) throw new Error('Componente no encontrado');

    if (old && data.computerId !== undefined && old.computerId !== data.computerId) {
        await logItemMovement({
            itemType: 'Componentes',
            itemCode: updated.code,
            itemId: id,
            itemDescription: `${updated.brand || ''} ${updated.model || ''}`.trim() || updated.specs,
            previousAssignmentId: old.computerId,
            newAssignmentId: data.computerId,
            movementReason: data.computerId ? 'Asignado a computador' : 'Desasignado de computador',
        });
    }

    const title = updated.specs || `${updated.brand} ${updated.model}`.trim() || updated.code;
    await logActivity('component', id, 'updated', updated.code, title);
    return updated.toJSON();
};

export const deleteComponent = async (id) => {
    const item = await Component.findByPk(id);
    await Component.destroy({ where: { id } });
    if (item) {
        const title = item.specs || `${item.brand} ${item.model}`.trim() || item.code;
        await logActivity('component', id, 'deleted', item.code, title);
    }
};

export const duplicateComponents = async (ids) => {
    const originals = await Component.findAll({ where: { id: ids } });
    const duplicated = [];
    for (const original of originals) {
        const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
        const baseCode = original.code.slice(0, 8);
        const newCode = `${baseCode}-DUP${suffix}`.slice(0, 15);
        const newSerial = original.serial
            ? `${original.serial.slice(0, 23)}-DUP${suffix}`.slice(0, 30)
            : null;
        const created = await Component.create({
            code: newCode,
            serial: newSerial,
            brand: original.brand,
            model: original.model,
            specs: `${original.specs || ''} (Copia)`.trim(),
            type: original.type,
            state: original.state,
            computerId: null,
        });
        const title = created.specs || `${created.brand} ${created.model}`.trim() || created.code;
        await logActivity('component', created.id, 'created', created.code, title);
        duplicated.push(created.toJSON());
    }
    return duplicated;
};

export const deleteManyComponents = async (ids) => {
    for (const id of ids) {
        await deleteComponent(id);
    }
    return { success: true };
};
