import { Op } from 'sequelize';
import * as db from '../database.js';

const MOVEMENT_TYPE_MAP = {
    cannibalization: 'Canibalización',
    state_change: 'Cambio de estado',
    assignment: 'Asignación / Desasignación',
};

const detectMovementType = (trace) => {
    const reason = (trace.movementReason || '').toLowerCase();
    const movedFrom = (trace.movedFrom || '').toLowerCase();
    const movedTo = (trace.movedTo || '').toLowerCase();

    if (reason.includes('cambio de estado')) return 'state_change';
    if (reason.includes('desasignado') || reason.includes('asignado')) return 'assignment';
    if (movedFrom === 'dañado' || movedTo === 'reincorporado' || movedTo === 'reconstruido') return 'state_change';
    if (movedFrom && movedTo && !movedFrom.includes('asignado') && !movedTo.includes('asignado')) return 'state_change';
    if (reason) return 'state_change';
    return 'assignment';
};

export const getUnifiedTraceability = async (filters = {}) => {
    const { movementTypes, dateStart, dateEnd, itemTypes, users } = filters;
    const results = [];

    // 1. Get ItemTrace records
    const traceWhere = {};
    if (dateStart || dateEnd) {
        traceWhere.movementDate = {};
        if (dateStart) traceWhere.movementDate[Op.gte] = dateStart;
        if (dateEnd) traceWhere.movementDate[Op.lte] = dateEnd;
    }
    if (itemTypes && itemTypes.length > 0) {
        traceWhere.itemType = { [Op.in]: itemTypes };
    }
    if (users && users.length > 0) {
        traceWhere.createdBy = { [Op.in]: users };
    }

    if (db.ItemTrace) {
        try {
            const traces = Object.keys(traceWhere).length > 0
                ? await db.ItemTrace.findAll({ where: traceWhere, order: [['movementDate', 'DESC']] })
                : await db.ItemTrace.findAll({ order: [['movementDate', 'DESC']] });

            for (const t of traces) {
                const data = t.toJSON();
                const mType = detectMovementType(data);
                if (movementTypes && movementTypes.length > 0 && !movementTypes.includes(mType)) continue;

                const stateInfo = [];
                if (data.dateDamaged) stateInfo.push(`Dañado: ${data.dateDamaged}`);
                if (data.dateInRepair) stateInfo.push(`Reparac.: ${data.dateInRepair}`);
                if (data.dateRepaired) stateInfo.push(`Reincorporado: ${data.dateRepaired}`);
                if (data.rebuilt) stateInfo.push('Reconstruido: Sí');

                results.push({
                    id: `trace-${data.id}`,
                    date: data.movementDate,
                    movementType: mType,
                    movementTypeLabel: MOVEMENT_TYPE_MAP[mType],
                    itemType: data.itemType,
                    itemCode: data.itemCode,
                    itemDescription: data.itemDescription || '-',
                    origin: data.movedFrom || '-',
                    destination: data.movedTo || '-',
                    reason: data.movementReason || '-',
                    details: stateInfo.join(' | '),
                    createdBy: data.createdBy || '-',
                    source: 'item_trace',
                });
            }
        } catch (error) {
            console.error('Error al obtener trazabilidad:', error.message);
        }
    }

    // 2. Get CannibalizationMovement records
    if (db.CannibalizationMovement) {
        try {
            let moves = await db.CannibalizationMovement.findAll({
                order: [['movementDate', 'DESC']],
            });

            for (const m of moves) {
                const data = m.toJSON();
                data.items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;

                if (dateStart && data.movementDate && data.movementDate < dateStart) continue;
                if (dateEnd && data.movementDate && data.movementDate > dateEnd) continue;

                let donorCode = '-', receiverCode = '-';
                if (data.donorComputerId && db.Computer) {
                    const donor = await db.Computer.findByPk(data.donorComputerId, { attributes: ['code'] });
                    if (donor) donorCode = donor.code;
                }
                if (data.receiverComputerId && db.Computer) {
                    const receiver = await db.Computer.findByPk(data.receiverComputerId, { attributes: ['code'] });
                    if (receiver) receiverCode = receiver.code;
                }

                if (users && users.length > 0 && data.createdBy && !users.includes(data.createdBy)) continue;

                const itemList = data.items || [];
                if (itemList.length > 0) {
                    for (const item of itemList) {
                        if (itemTypes && itemTypes.length > 0 && !itemTypes.includes(item.itemType)) continue;
                        results.push({
                            id: `cannib-${data.id}-${item.itemCode}`,
                            date: data.movementDate,
                            movementType: 'cannibalization',
                            movementTypeLabel: MOVEMENT_TYPE_MAP.cannibalization,
                            itemType: item.itemType || '-',
                            itemCode: item.itemCode || '-',
                            itemDescription: item.itemDescription || '-',
                            origin: donorCode,
                            destination: receiverCode,
                            reason: data.observations || 'Transferencia entre equipos',
                            details: '',
                            createdBy: data.createdBy || '-',
                            source: 'cannibalization',
                        });
                    }
                } else {
                    if (movementTypes && movementTypes.length > 0 && !movementTypes.includes('cannibalization')) continue;
                    results.push({
                        id: `cannib-${data.id}`,
                        date: data.movementDate,
                        movementType: 'cannibalization',
                        movementTypeLabel: MOVEMENT_TYPE_MAP.cannibalization,
                        itemType: '-',
                        itemCode: '-',
                        itemDescription: 'Movimiento sin ítems detallados',
                        origin: donorCode,
                        destination: receiverCode,
                        reason: data.observations || 'Transferencia entre equipos',
                        details: '',
                        createdBy: data.createdBy || '-',
                        source: 'cannibalization',
                    });
                }
            }
        } catch (error) {
            console.error('Error al obtener movimientos de canibalización:', error.message);
        }
    }

    // Sort by date descending
    results.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
    });

    return results;
};

export const getTraceabilityUsers = async () => {
    const users = new Set();
    if (db.ItemTrace) {
        const traces = await db.ItemTrace.findAll({
            attributes: ['createdBy'],
            where: { createdBy: { [Op.ne]: null } },
            group: ['createdBy'],
        });
        traces.forEach((t) => { if (t.createdBy) users.add(t.createdBy); });
    }
    if (db.CannibalizationMovement) {
        const moves = await db.CannibalizationMovement.findAll({
            attributes: ['createdBy'],
            where: { createdBy: { [Op.ne]: null } },
            group: ['createdBy'],
        });
        moves.forEach((m) => { if (m.createdBy) users.add(m.createdBy); });
    }
    return Array.from(users).sort();
};

export const getTraceabilityItemTypes = async () => {
    const types = new Set();
    if (db.ItemTrace) {
        const traces = await db.ItemTrace.findAll({
            attributes: ['itemType'],
            where: { itemType: { [Op.ne]: null } },
            group: ['itemType'],
        });
        traces.forEach((t) => { if (t.itemType) types.add(t.itemType); });
    }
    return Array.from(types).sort();
};
