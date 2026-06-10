import { DataTypes } from 'sequelize';

export const ItemTraceModel = (sequelize) => {
    return sequelize.define(
        'ItemTrace',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            itemId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            itemType: {
                type: DataTypes.STRING(30),
                allowNull: false,
                validate: { notEmpty: true },
            },
            itemCode: {
                type: DataTypes.STRING(15),
                allowNull: false,
                validate: { notEmpty: true },
            },
            itemDescription: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            createdBy: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            dateDamaged: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            dateInRepair: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            dateRepaired: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            dateReinstated: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            rebuilt: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            observations: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            movedFrom: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            movedTo: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            movementDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            movementReason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: 'item_traces',
            timestamps: true,
            underscored: true,
        }
    );
};
