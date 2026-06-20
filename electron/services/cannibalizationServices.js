import { Cannibalization, CannibalizationMovement, Computer, Component, Peripheral } from '../database.js';
import { logActivity } from './activityLogServices.js';
import { getTemplatesByComputerType } from './computerTemplates.js';

const getModelForItemType = (itemType) => {
    if (itemType === 'Componente') return Component;
    if (itemType === 'Periférico') return Peripheral;
    return null;
};

export const getAllCannibalizationsService = async () => {
    const items = await Cannibalization.findAll({
        include: [
            { model: Computer, as: 'donorComputer', attributes: ['id', 'code', 'brand'] },
            { model: Computer, as: 'receiverComputer', attributes: ['id', 'code', 'brand'] },
        ],
        order: [['createdAt', 'DESC']],
    });
    return items.map((item) => item.toJSON());
};

export const createCannibalizationService = async (data) => {
    const Model = getModelForItemType(data.itemType);
    if (!Model) {
        throw new Error(`Tipo de ítem inválido: ${data.itemType}`);
    }

    const item = await Model.findByPk(data.itemId);
    if (!item) {
        throw new Error(`${data.itemType} con id ${data.itemId} no encontrado`);
    }

    const receiverId = data.receiverComputerId || null;
    item.computerId = receiverId;
    await item.save();

    const created = await Cannibalization.create({
        itemType: data.itemType,
        itemId: data.itemId,
        itemCode: item.code,
        itemDescription: item.description || item.brand || item.type || '',
        donorComputerId: data.donorComputerId || null,
        receiverComputerId: receiverId,
        movementDate: data.movementDate || null,
        observations: data.observations || null,
    });

    await logActivity('cannibalization', created.id, 'created', created.itemCode, created.itemDescription);

    await updateDonorComputerStatus(data.donorComputerId);
    await updateComputerStatus(receiverId);

    const result = await Cannibalization.findByPk(created.id, {
        include: [
            { model: Computer, as: 'donorComputer', attributes: ['id', 'code', 'brand'] },
            { model: Computer, as: 'receiverComputer', attributes: ['id', 'code', 'brand'] },
        ],
    });
    return result.toJSON();
};

export const createBulkCannibalizationService = async (data) => {
    const { items, donorComputerId, receiverComputerId, movementDate, observations } = data;

    if (!items || items.length === 0) {
        throw new Error('No se han seleccionado ítems para transferir');
    }

    const createdRecords = [];

    for (const item of items) {
        const Model = getModelForItemType(item.itemType);
        if (!Model) {
            throw new Error(`Tipo de ítem inválido: ${item.itemType}`);
        }

        const foundItem = await Model.findByPk(item.itemId);
        if (!foundItem) {
            throw new Error(`${item.itemType} con id ${item.itemId} no encontrado`);
        }

        const receiverId = receiverComputerId || null;
        foundItem.computerId = receiverId;
        await foundItem.save();

        const created = await Cannibalization.create({
            itemType: item.itemType,
            itemId: item.itemId,
            itemCode: foundItem.code,
            itemDescription: foundItem.description || foundItem.specs || foundItem.brand || foundItem.type || '',
            donorComputerId: donorComputerId || null,
            receiverComputerId: receiverId,
            movementDate: movementDate || null,
            observations: observations || null,
        });

        await logActivity('cannibalization', created.id, 'created', created.itemCode, created.itemDescription);

        createdRecords.push(created.toJSON());
    }

    await updateDonorComputerStatus(donorComputerId);
    await updateComputerStatus(receiverComputerId);

    return createdRecords;
};

export const createBulkCannibalizationMovementService = async (data) => {
    const { items, donorComputerId, receiverComputerId, movementDate, observations } = data;

    if (!items || items.length === 0) {
        throw new Error('No se han seleccionado ítems para transferir');
    }

    const itemsData = [];

    for (const item of items) {
        const Model = getModelForItemType(item.itemType);
        if (!Model) {
            throw new Error(`Tipo de ítem inválido: ${item.itemType}`);
        }

        const foundItem = await Model.findByPk(item.itemId);
        if (!foundItem) {
            throw new Error(`${item.itemType} con id ${item.itemId} no encontrado`);
        }

        const receiverId = receiverComputerId || null;
        foundItem.computerId = receiverId;
        await foundItem.save();

        itemsData.push({
            itemType: item.itemType,
            itemId: item.itemId,
            itemCode: foundItem.code,
            itemDescription: foundItem.description || foundItem.specs || foundItem.brand || foundItem.type || '',
        });

        await logActivity(
            'cannibalization',
            foundItem.code,
            'assigned',
            foundItem.code,
            `${item.itemType} movido de ${donorComputerId || 'sin asignar'} a ${receiverId || 'sin asignar'}`
        );
    }

    await updateDonorComputerStatus(donorComputerId);
    await updateComputerStatus(receiverComputerId);

    const movement = await CannibalizationMovement.create({
        donorComputerId: donorComputerId || null,
        receiverComputerId: receiverComputerId || null,
        items: JSON.stringify(itemsData),
        movementDate: movementDate || null,
        observations: observations || null,
        createdBy: data.createdBy || null,
    });

    return (await CannibalizationMovement.findByPk(movement.id)).toJSON();
};

export const getAllCannibalizationMovementsService = async () => {
    const movements = await CannibalizationMovement.findAll({
        order: [['createdAt', 'DESC']],
    });

    const result = [];
    for (const m of movements) {
        const data = m.toJSON();
        data.items = JSON.parse(data.items);

        if (data.donorComputerId) {
            const donor = await Computer.findByPk(data.donorComputerId, {
                attributes: ['id', 'code', 'brand', 'model'],
            });
            data.donorComputer = donor ? donor.toJSON() : null;
        } else {
            data.donorComputer = null;
        }

        if (data.receiverComputerId) {
            const receiver = await Computer.findByPk(data.receiverComputerId, {
                attributes: ['id', 'code', 'brand', 'model'],
            });
            data.receiverComputer = receiver ? receiver.toJSON() : null;
        } else {
            data.receiverComputer = null;
        }

        result.push(data);
    }

    return result;
};

export const deleteCannibalizationService = async (id) => {
    const item = await Cannibalization.findByPk(id);
    if (!item) throw new Error('Registro de canibalización no encontrado');

    await Cannibalization.destroy({ where: { id } });
    await logActivity('cannibalization', id, 'deleted', item.itemCode, item.itemDescription);
};

export const deleteCannibalizationMovementService = async (ids) => {
    if (!ids || ids.length === 0) {
        throw new Error('No se proporcionaron IDs para eliminar');
    }
    const count = await CannibalizationMovement.destroy({ where: { id: ids } });
    return { deleted: count };
};

async function updateComputerStatus(computerId) {
    if (!computerId) return;

    const computer = await Computer.findByPk(computerId);
    if (!computer) return;

    const templates = getTemplatesByComputerType(computer.computerType);
    if (!templates || templates.length === 0) return;

    const missingItems = await getMissingItemsByComputer(computerId);
    const allPresent = missingItems.every((item) => item.present);

    if (allPresent) {
        computer.state = 'Bueno';
        await computer.save();
    }
}

async function updateDonorComputerStatus(computerId) {
    if (!computerId) return;

    const computer = await Computer.findByPk(computerId);
    if (!computer) return;

    const templates = getTemplatesByComputerType(computer.computerType);
    if (!templates || templates.length === 0) return;

    const missingItems = await getMissingItemsByComputer(computerId);
    const allPresent = missingItems.every((item) => item.present);

    if (allPresent) {
        computer.state = 'Bueno';
    } else {
        computer.state = 'Dañado';
    }
    await computer.save();
}

export const getMissingItemsByComputer = async (computerId) => {
    const computer = await Computer.findByPk(computerId);
    if (!computer) throw new Error('Computador no encontrado');

    const templates = getTemplatesByComputerType(computer.computerType);

    const peripherals = await Peripheral.findAll({
        where: { computerId },
        attributes: ['id', 'code', 'type', 'state'],
    });

    const components = await Component.findAll({
        where: { computerId },
        attributes: ['id', 'code', 'type', 'state', 'specs'],
    });

    const result = templates.map((template) => {
        if (template.itemType === 'Componente') {
            const found = components.find(
                (item) => item.type.toLowerCase() === template.itemCategory.toLowerCase()
            );
            return {
                itemCategory: template.itemCategory,
                itemType: template.itemType,
                present: !!found,
                itemCode: found ? found.code : null,
                itemState: found ? found.state : null,
            };
        }

        const found = peripherals.find(
            (item) => item.type.toLowerCase() === template.itemCategory.toLowerCase()
        );
        return {
            itemCategory: template.itemCategory,
            itemType: template.itemType,
            present: !!found,
            itemCode: found ? found.code : null,
            itemState: found ? found.state : null,
        };
    });

    return result;
};
