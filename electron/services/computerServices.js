import { Op } from 'sequelize';
import { Computer, DeskTable, Peripheral, Component } from '../database.js';

import { logActivity } from './activityLogServices.js';
import { logItemMovement } from './itemTraceServices.js';

export const getAllComputers = async () => {
    const items = await Computer.findAll({
        include: [
            { model: Peripheral, as: 'peripherals' },
            { model: Component, as: 'components' },
        ],
        order: [['createdAt', 'ASC']],
    });
    return items.map((item) => item.toJSON());
};

const linkPeripherals = async (computerId, peripherals) => {
    if (!peripherals || peripherals.length === 0) return;
    const ids = peripherals.map((p) => p.id);

    const alreadyAssigned = await Peripheral.findAll({
        where: { id: { [Op.in]: ids }, computerId: { [Op.ne]: computerId } },
    });
    if (alreadyAssigned.length > 0) {
        const codes = alreadyAssigned.map((p) => p.code).join(', ');
        throw new Error(`Los siguientes periféricos ya están asignados a otro computador: ${codes}`);
    }

    const newlyAssigned = await Peripheral.findAll({ where: { id: { [Op.in]: ids } }, attributes: ['id', 'code', 'description'] });
    await Peripheral.update(
        { computerId },
        { where: { id: { [Op.in]: ids } } }
    );
    for (const p of newlyAssigned) {
        await logItemMovement({
            itemType: 'Periféricos', itemCode: p.code, itemId: p.id,
            itemDescription: p.description, previousAssignmentId: null,
            newAssignmentId: computerId, movementReason: 'Asignado a computador',
        }).catch(() => {});
    }
};

const unlinkPeripherals = async (computerId, keepIds = []) => {
    const where = { computerId };
    if (keepIds.length > 0) {
        where.id = { [Op.notIn]: keepIds };
    }
    const unlinked = await Peripheral.findAll({ where, attributes: ['id', 'code', 'description'] });
    await Peripheral.update({ computerId: null }, { where });
    for (const p of unlinked) {
        await logItemMovement({
            itemType: 'Periféricos', itemCode: p.code, itemId: p.id,
            itemDescription: p.description, previousAssignmentId: computerId,
            newAssignmentId: null, movementReason: 'Desasignado de computador',
        }).catch(() => {});
    }
};

const linkComponents = async (computerId, componentIds) => {
    const ids = Object.values(componentIds || {}).filter(Boolean);
    if (ids.length === 0) return;

    const alreadyAssigned = await Component.findAll({
        where: { id: { [Op.in]: ids }, computerId: { [Op.ne]: computerId } },
    });
    if (alreadyAssigned.length > 0) {
        const codes = alreadyAssigned.map((c) => c.code).join(', ');
        throw new Error(`Los siguientes componentes ya están asignados a otro computador: ${codes}`);
    }

    const newlyAssigned = await Component.findAll({ where: { id: { [Op.in]: ids } }, attributes: ['id', 'code', 'specs', 'brand', 'model'] });
    await Component.update(
        { computerId },
        { where: { id: { [Op.in]: ids } } }
    );
    for (const c of newlyAssigned) {
        const desc = `${c.brand || ''} ${c.model || ''}`.trim() || c.specs;
        await logItemMovement({
            itemType: 'Componentes', itemCode: c.code, itemId: c.id,
            itemDescription: desc, previousAssignmentId: null,
            newAssignmentId: computerId, movementReason: 'Asignado a computador',
        }).catch(() => {});
    }
};

const unlinkComponents = async (computerId, keepIds = []) => {
    const where = { computerId };
    if (keepIds.length > 0) {
        where.id = { [Op.notIn]: keepIds };
    }
    const unlinked = await Component.findAll({ where, attributes: ['id', 'code', 'specs', 'brand', 'model'] });
    await Component.update({ computerId: null }, { where });
    for (const c of unlinked) {
        const desc = `${c.brand || ''} ${c.model || ''}`.trim() || c.specs;
        await logItemMovement({
            itemType: 'Componentes', itemCode: c.code, itemId: c.id,
            itemDescription: desc, previousAssignmentId: computerId,
            newAssignmentId: null, movementReason: 'Desasignado de computador',
        }).catch(() => {});
    }
};

export const createComputer = async (data) => {
    try {
        const { peripherals, componentIds, assignedComponents: _assignedComponents, ...computerData } = data;

        const createdComputer = await Computer.create(computerData);
        const title = `${createdComputer.brand || ''} ${createdComputer.model || ''}`.trim() || 'Computador';

        if (peripherals && peripherals.length > 0) {
            await linkPeripherals(createdComputer.id, peripherals);
            for (const per of peripherals) {
                await logActivity('peripheral', per.id, 'assigned', per.code, `Asignado a ${createdComputer.code} - ${title}`);
            }
        }

        if (componentIds) {
            await linkComponents(createdComputer.id, componentIds);
            const compIds = Object.values(componentIds).filter(Boolean);
            if (compIds.length > 0) {
                const linkedComponents = await Component.findAll({ where: { id: compIds } });
                for (const comp of linkedComponents) {
                    await logActivity('component', comp.id, 'assigned', comp.code, `Asignado a ${createdComputer.code} - ${title}`);
                }
            }
        }

        await logActivity('computer', createdComputer.id, 'created', createdComputer.code, title);

        // Retornar el computador con sus relaciones incluidas
        const result = await Computer.findByPk(createdComputer.id, {
            include: [
                { model: Peripheral, as: 'peripherals' },
                { model: Component, as: 'components' },
            ],
        });
        return result.toJSON();
    } catch (error) {
        if (error instanceof Error && error.message && !error.message.includes('Sequelize')) {
            throw error;
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors && error.errors[0] ? error.errors[0].path : 'campo';
            if (field === 'serial') {
                throw new Error('El número de serie ya está registrado. Por favor, verifique el serial del computador.');
            } else if (field === 'code') {
                throw new Error('El código ya está registrado. Por favor, verifique el código del computador.');
            } else {
                throw new Error(`El ${field} ya está registrado. Por favor, verifique los datos ingresados.`);
            }
        }

        if (error.name && error.name.includes('Sequelize')) {
            throw new Error('Error de validación en la base de datos. Por favor, verifique los datos ingresados.');
        }

        throw error;
    }
};

export const updateComputer = async (id, data) => {
    try {
        const { peripherals, componentIds, assignedComponents: _assignedComponents, ...computerData } = data;

        // Obtener estado actual antes de cambios para detectar asignaciones/desasignaciones
        const before = await Computer.findByPk(id, {
            include: [
                { model: Peripheral, as: 'peripherals' },
                { model: Component, as: 'components' },
            ],
        });
        const compTitle = `${before?.brand || ''} ${before?.model || ''}`.trim() || 'Computador';

        await Computer.update(computerData, { where: { id } });

        if (peripherals) {
            const keepIds = peripherals.map((p) => p.id);
            const prevIds = new Set((before?.peripherals || []).map((p) => p.id));

            const removedPeripherals = (before?.peripherals || []).filter((p) => !keepIds.includes(p.id));
            const addedPeripherals = peripherals.filter((p) => !prevIds.has(p.id));

            await unlinkPeripherals(id, keepIds);
            await linkPeripherals(id, peripherals);

            for (const per of removedPeripherals) {
                await logActivity('peripheral', per.id, 'unassigned', per.code, `Desasignado de ${before.code} - ${compTitle}`);
            }
            for (const per of addedPeripherals) {
                await logActivity('peripheral', per.id, 'assigned', per.code, `Asignado a ${before.code} - ${compTitle}`);
            }
        }

        if (componentIds) {
            const newCompIds = Object.values(componentIds || {}).filter(Boolean);
            const prevCompIds = new Set((before?.components || []).map((c) => c.id));

            const removedComponents = (before?.components || []).filter((c) => !newCompIds.includes(c.id));
            const addedCompIds = newCompIds.filter((id) => !prevCompIds.has(id));

            await unlinkComponents(id, newCompIds);
            await linkComponents(id, componentIds);

            for (const comp of removedComponents) {
                await logActivity('component', comp.id, 'unassigned', comp.code, `Desasignado de ${before.code} - ${compTitle}`);
            }
            if (addedCompIds.length > 0) {
                const addedComponents = await Component.findAll({ where: { id: addedCompIds } });
                for (const comp of addedComponents) {
                    await logActivity('component', comp.id, 'assigned', comp.code, `Asignado a ${before.code} - ${compTitle}`);
                }
            }
        }

        const updatedComp = await Computer.findByPk(id, {
            include: [
                { model: Peripheral, as: 'peripherals' },
                { model: Component, as: 'components' },
            ],
        });
        if (updatedComp) {
            const hasComputerFieldChanges = Object.keys(computerData).length > 0;
            if (hasComputerFieldChanges) {
                const title = `${updatedComp.brand || ''} ${updatedComp.model || ''}`.trim() || 'Computador';
                await logActivity('computer', id, 'updated', updatedComp.code, title);
            }
            return updatedComp.toJSON();
        }

        return { success: true };
    } catch (error) {
        if (error instanceof Error && error.message && !error.message.includes('Sequelize')) {
            throw error;
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors && error.errors[0] ? error.errors[0].path : 'campo';
            if (field === 'serial') {
                throw new Error('El número de serie ya está registrado en otro computador. Por favor, verifique el serial.');
            } else {
                throw new Error(`El ${field} ya está registrado. Por favor, verifique los datos ingresados.`);
            }
        }

        if (error.name && error.name.includes('Sequelize')) {
            throw new Error('Error de validación en la base de datos. Por favor, verifique los datos ingresados.');
        }

        throw error;
    }
};

export const deleteComputer = async (id) => {
    const computerToDelete = await Computer.findByPk(id, {
        include: [
            { model: Peripheral, as: 'peripherals' },
            { model: Component, as: 'components' },
        ],
    });

    if (computerToDelete) {
        const title = `${computerToDelete.brand || ''} ${computerToDelete.model || ''}`.trim() || 'Computador';
        for (const per of computerToDelete.peripherals || []) {
            await logActivity('peripheral', per.id, 'unassigned', per.code, `Desasignado de ${computerToDelete.code} - ${title}`);
        }
        for (const comp of computerToDelete.components || []) {
            await logActivity('component', comp.id, 'unassigned', comp.code, `Desasignado de ${computerToDelete.code} - ${title}`);
        }
    }

    await DeskTable.update({ computerId: null }, { where: { computerId: id } });

    // Desvincular componentes y periféricos antes de eliminar el computador
    await Component.update({ computerId: null }, { where: { computerId: id } });
    await Peripheral.update({ computerId: null }, { where: { computerId: id } });

    await Computer.destroy({ where: { id } });

    if (computerToDelete) {
        const title = `${computerToDelete.brand || ''} ${computerToDelete.model || ''}`.trim() || 'Computador';
        await logActivity('computer', id, 'deleted', computerToDelete.code, title);
    }

    return;
};

export const duplicateComputers = async (ids) => {
    const originals = await Computer.findAll({ where: { id: ids } });
    const duplicated = [];

    for (const comp of originals) {
        const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
        const baseCode = comp.code.slice(0, 8);
        const newCode = `${baseCode}-DUP${suffix}`.slice(0, 15);
        const newSerial = comp.serial
            ? `${comp.serial.slice(0, 23)}-DUP${suffix}`.slice(0, 30)
            : null;

        const created = await Computer.create({
            code: newCode,
            serial: newSerial,
            computerType: comp.computerType,
            brand: comp.brand,
            model: comp.model,
            state: comp.state,
            ramMemory: '',
            cpu: '',
            storage: '',
            graphicCard: '',
        });

        const title = `${created.brand || ''} ${created.model || ''}`.trim() || 'Computador';
        await logActivity('computer', created.id, 'created', created.code, title);
        duplicated.push(created);
    }

    return duplicated;
};

export const deleteManyComputers = async (ids) => {
    for (const id of ids) {
        await deleteComputer(id);
    }
    return { success: true };
};
