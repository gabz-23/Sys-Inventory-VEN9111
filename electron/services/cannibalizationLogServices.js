import { Op } from 'sequelize';
import * as db from '../database.js';

const getItemModels = () => [
    { type: 'Computadoras', model: db.Computer, codeField: 'code', serialField: 'serial', typeField: 'computerType', computerIdField: null },
    { type: 'Acc. Escritorio', model: db.DeskAccessory, codeField: 'code', serialField: 'serial', typeField: 'type', computerIdField: 'deskTableId' },
    { type: 'Componentes', model: db.Component, codeField: 'code', serialField: 'serial', typeField: 'type', computerIdField: 'computerId' },
    { type: 'Periféricos', model: db.Peripheral, codeField: 'code', serialField: 'serial', typeField: 'type', computerIdField: 'computerId' },
];

const STATE_DATE_MAP = {
    'Dañado': 'dateDamaged',
    'Reconstruido': 'dateRepaired',
    'Reincorporado': 'dateReinstated',
};

export const getItemsByState = async (states) => {
    const results = [];
    const allItemKeys = [];

    for (const { type, model, codeField, serialField, typeField } of getItemModels()) {
        try {
            if (!model) {
                console.error(`Modelo ${type} no inicializado`);
                continue;
            }
            const items = await model.findAll({
                where: { state: { [Op.in]: states } },
                order: [['updatedAt', 'DESC']],
            });
            for (const item of items) {
                const itemData = item.toJSON();
                allItemKeys.push({ itemType: type, itemCode: itemData[codeField], state: itemData.state });
                results.push({
                    id: itemData.id,
                    code: itemData[codeField],
                    serial: itemData[serialField] || '-',
                    itemType: type,
                    type: itemData[typeField] || '-',
                    state: itemData.state,
                    entryDate: null,
                });
            }
        } catch (error) {
            console.error(`Error al obtener ${type}:`, error.message);
        }
    }

    if (allItemKeys.length > 0 && results.length > 0 && db.ItemTrace) {
        const dateFieldMap = {};
        for (const { itemType, itemCode, state } of allItemKeys) {
            const dateField = STATE_DATE_MAP[state];
            if (dateField) {
                if (!dateFieldMap[dateField]) dateFieldMap[dateField] = [];
                dateFieldMap[dateField].push({ itemType, itemCode });
            }
        }
        for (const [dateField, keys] of Object.entries(dateFieldMap)) {
            try {
                const traces = await db.ItemTrace.findAll({
                    where: {
                        [Op.or]: keys.map((k) => ({ itemType: k.itemType, itemCode: k.itemCode })),
                        [dateField]: { [Op.ne]: null },
                    },
                    attributes: ['itemType', 'itemCode', dateField],
                    order: [[dateField, 'DESC']],
                });
                const latestPerItem = {};
                for (const t of traces) {
                    const key = `${t.itemType}|${t.itemCode}`;
                    if (!latestPerItem[key] && t[dateField]) {
                        latestPerItem[key] = t[dateField];
                    }
                }
                for (const r of results) {
                    const key = `${r.itemType}|${r.code}`;
                    if (latestPerItem[key]) {
                        r.entryDate = latestPerItem[key];
                    }
                }
            } catch (error) {
                console.error(`Error al obtener traces para ${dateField}:`, error.message);
            }
        }
    }

    results.sort((a, b) => {
        const dateA = a.entryDate ? new Date(a.entryDate) : new Date(0);
        const dateB = b.entryDate ? new Date(b.entryDate) : new Date(0);
        return dateB - dateA;
    });
    return results;
};

export const transitionItemState = async (itemType, itemCode, targetState, userId) => {
    const config = getItemModels().find((m) => m.type === itemType);
    if (!config) throw new Error(`Tipo de ítem inválido: ${itemType}`);
    if (!config.model) throw new Error(`Modelo ${itemType} no inicializado`);

    const item = await config.model.findOne({ where: { code: itemCode } });
    if (!item) throw new Error(`${itemType} con código ${itemCode} no encontrado`);

    const oldState = item.state;
    item.state = targetState;
    await item.save();

    const today = new Date().toISOString().split('T')[0];

    const traceData = {
        itemType,
        itemCode,
        itemId: item.id,
        itemDescription: item.description || item.specs || item.brand || item.type || '',
        createdBy: userId || 'Sistema',
        movementDate: today,
        movementReason: `Cambio de estado: ${oldState} → ${targetState}`,
        movedFrom: oldState,
        movedTo: targetState,
    };

    if (oldState === 'Dañado' && targetState === 'Reincorporado') {
        traceData.dateDamaged = today;
        traceData.dateRepaired = today;
    } else if (oldState === 'Dañado' && targetState === 'Reconstruido') {
        traceData.dateDamaged = today;
        traceData.dateRepaired = today;
        traceData.rebuilt = true;
    } else if (oldState === 'Reconstruido' && targetState === 'Reincorporado') {
        traceData.dateReinstated = today;
        if (config.computerIdField && item[config.computerIdField]) {
            traceData.movedFrom = config.type === 'Acc. Escritorio' ? 'Escritorio asignado' : 'Computador asignado';
            traceData.movementReason = `Desasignado y cambio de estado: ${oldState} → ${targetState}`;
        }
        item[config.computerIdField] = null;
        await item.save();
    }

    if (db.ItemTrace) {
        await db.ItemTrace.create(traceData);
    }

    return {
        id: item.id,
        code: item[config.codeField],
        itemType: config.type,
        state: item.state,
        serial: item[config.serialField] || '-',
        type: item[config.typeField] || '-',
        entryDate: today,
    };
};

export const getAvailableItems = async () => {
    const results = [];
    for (const { type, model, codeField, serialField, typeField, computerIdField } of getItemModels()) {
        try {
            if (!model) {
                console.error(`Modelo ${type} no inicializado`);
                continue;
            }
            const whereCondition = { state: 'Reincorporado' };
            if (computerIdField) {
                whereCondition[computerIdField] = null;
            }
            const items = await model.findAll({
                where: whereCondition,
                order: [['updatedAt', 'DESC']],
            });
            for (const item of items) {
                const itemData = item.toJSON();
                const entryDate = await findEntryDate(type, itemData[codeField], 'Reincorporado');
                results.push({
                    id: itemData.id,
                    code: itemData[codeField],
                    serial: itemData[serialField] || '-',
                    itemType: type,
                    type: itemData[typeField] || '-',
                    state: 'Reincorporado',
                    entryDate,
                });
            }
        } catch (error) {
            console.error(`Error al obtener ${type} disponibles:`, error.message);
        }
    }
    return results;
};

const findEntryDate = async (itemType, itemCode, state) => {
    const dateField = STATE_DATE_MAP[state];
    if (!dateField || !db.ItemTrace) return null;
    try {
        const trace = await db.ItemTrace.findOne({
            where: { itemType, itemCode, [dateField]: { [Op.ne]: null } },
            attributes: [dateField],
            order: [[dateField, 'DESC']],
        });
        return trace ? trace[dateField] : null;
    } catch {
        return null;
    }
};
