import { DataTypes } from 'sequelize';

export const CannibalizationModel = (sequelize) => {
    return sequelize.define(
        'Cannibalization',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            itemType: {
                type: DataTypes.STRING(30),
                allowNull: false,
                validate: { notEmpty: true },
            },
            itemId: {
                type: DataTypes.UUID,
                allowNull: true,
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
            donorComputerId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'computers',
                    key: 'id',
                },
            },
            receiverComputerId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'computers',
                    key: 'id',
                },
            },
            movementDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            observations: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: 'cannibalizations',
            timestamps: true,
            underscored: true,
        }
    );
};
