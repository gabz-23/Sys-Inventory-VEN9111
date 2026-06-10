import { ItemTrace, Computer, DeskAccessory, Component, Peripheral, DeskTable } from '../database.js';
import { logActivity } from './activityLogServices.js';

const DAMAGED_STATE = {
    'Computadoras': 'Dañado',
    'Acc. Escritorio': 'Dañado',
    'Componentes': 'Dañado',
    'Periféricos': 'Dañado',
};

const IN_REPAIR_STATE = {
    'Computadoras': 'En reparacion',
    'Acc. Escritorio': 'En reparacion',
    'Componentes': 'En reparacion',
    'Periféricos': 'En reparacion',
};

const REPAIRED_STATE = {
    'Computadoras': 'Reparado',
    'Acc. Escritorio': 'Reparado',
    'Componentes': 'Reparado',
    'Periféricos': 'Reparado',
};

const RECONSTRUCTED_STATE = {
    'Computadoras': 'Reconstruido',
    'Acc. Escritorio': 'Reconstruido',
    'Componentes': 'Reconstruido',
    'Periféricos': 'Reconstruido',
};

const getModelForType = (itemType) => {
    switch (itemType) {
        case 'Computadoras': return Computer;
        case 'Acc. Escritorio': return DeskAccessory;
        case 'Componentes': return Component;
        case 'Periféricos': return Peripheral;
        default: return null;
    }
};

const updateItemState = async (itemType, itemCode, newState) => {
    if (!itemType || !itemCode || !newState) return;
    const Model = getModelForType(itemType);
    if (!Model) return;
    try {
        const item = await Model.findOne({ where: { code: itemCode } });
        if (item) {
            item.state = newState;
            await item.save();
        }
    } catch (error) {
        console.error(`Error al actualizar estado del ${itemType} ${itemCode}:`, error.message);
    }
};

export const getAllItemTraces = async () => {
    const items = await ItemTrace.findAll({ order: [['createdAt', 'ASC']] });
    return items.map((item) => item.toJSON());
};

const sanitizeDates = (data) => {
    const dateFields = ['dateDamaged', 'dateInRepair', 'dateRepaired', 'dateReinstated', 'movementDate'];
    const sanitized = { ...data };
    for (const field of dateFields) {
        if (sanitized[field] === '' || sanitized[field] === 'Invalid date') {
            sanitized[field] = null;
        }
    }
    return sanitized;
};

const shouldSetDamaged = (data) => {
    return data.dateDamaged && !data.dateRepaired;
};

const shouldSetRepaired = (data) => {
    return data.dateRepaired;
};

const shouldSetInRepair = (data) => {
    return data.dateInRepair;
};

const updateItemStateByTrace = async (sanitized, itemType, itemCode) => {
    if (sanitized.markAvailable) {
        await updateItemState(itemType, itemCode, 'Bueno');
    } else if (sanitized.rebuilt) {
        await updateItemState(itemType, itemCode, RECONSTRUCTED_STATE[itemType]);
    } else if (shouldSetRepaired(sanitized)) {
        await updateItemState(itemType, itemCode, REPAIRED_STATE[itemType]);
    } else if (shouldSetInRepair(sanitized)) {
        await updateItemState(itemType, itemCode, IN_REPAIR_STATE[itemType]);
    } else if (shouldSetDamaged(sanitized)) {
        await updateItemState(itemType, itemCode, DAMAGED_STATE[itemType]);
    }
};

export const createItemTrace = async (data) => {
    const sanitized = sanitizeDates(data);
    const created = await ItemTrace.create(sanitized);
    await logActivity('item_trace', created.id, 'created', created.itemCode, created.itemDescription || created.itemType);
    await updateItemStateByTrace(sanitized, created.itemType, created.itemCode);
    return created.toJSON();
};

export const updateItemTrace = async (id, data) => {
    const sanitized = sanitizeDates(data);
    await ItemTrace.update(sanitized, { where: { id } });
    const updated = await ItemTrace.findByPk(id);
    if (!updated) throw new Error('Trazabilidad no encontrada');
    await logActivity('item_trace', id, 'updated', updated.itemCode, updated.itemDescription || updated.itemType);
    await updateItemStateByTrace(sanitized, updated.itemType, updated.itemCode);
    return updated.toJSON();
};

export const deleteItemTrace = async (id) => {
    const item = await ItemTrace.findByPk(id);
    await ItemTrace.destroy({ where: { id } });
    if (item) {
        await logActivity('item_trace', id, 'deleted', item.itemCode, item.itemDescription || item.itemType);
    }
};

export const deleteManyItemTraces = async (ids) => {
    for (const id of ids) {
        await deleteItemTrace(id);
    }
    return { success: true };
};

const getAssignmentLabel = async (itemType, foreignId) => {
    if (!foreignId) return null;
    if (itemType === 'Computadoras') {
        const desk = await DeskTable.findByPk(foreignId, { attributes: ['code'] });
        return desk ? `Escritorio ${desk.code}` : null;
    }
    if (itemType === 'Componentes' || itemType === 'Periféricos') {
        const comp = await Computer.findByPk(foreignId, { attributes: ['code'] });
        return comp ? `Computador ${comp.code}` : null;
    }
    if (itemType === 'Acc. Escritorio') {
        const desk = await DeskTable.findByPk(foreignId, { attributes: ['code'] });
        return desk ? `Escritorio ${desk.code}` : null;
    }
    return null;
};

export const logItemMovement = async ({
    itemType, itemCode, itemId, itemDescription,
    previousAssignmentId, newAssignmentId,
    movementReason, createdBy,
}) => {
    const today = new Date().toISOString().split('T')[0];
    const movedFrom = previousAssignmentId
        ? await getAssignmentLabel(itemType, previousAssignmentId)
        : null;
    const movedTo = newAssignmentId
        ? await getAssignmentLabel(itemType, newAssignmentId)
        : null;

    await ItemTrace.create({
        itemType,
        itemCode,
        itemId,
        itemDescription: itemDescription || '',
        movementDate: today,
        movedFrom,
        movedTo,
        movementReason: movementReason || 'Cambio de asignación',
        createdBy: createdBy || 'Sistema',
    });
};
