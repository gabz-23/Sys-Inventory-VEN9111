import { DataTypes } from 'sequelize';

export const CannibalizationMovementModel = (sequelize) => {
    return sequelize.define(
        'CannibalizationMovement',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            donorComputerId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            receiverComputerId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            items: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            movementDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            createdBy: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            observations: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: 'cannibalization_movements',
            timestamps: true,
            underscored: true,
        }
    );
};
