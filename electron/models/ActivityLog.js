import { DataTypes } from 'sequelize';

export const ActivityLogModel = (sequelize) => {
    return sequelize.define(
        'ActivityLog',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            entityType: {
                type: DataTypes.STRING(20),
                allowNull: false,
                validate: {
                    isIn: [['computer', 'desk', 'accessory', 'employee', 'desk_accessory', 'component', 'peripheral', 'item_trace']],
                },
            },
            entityId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            action: {
                type: DataTypes.STRING(20),
                allowNull: false,
                validate: {
                    isIn: [['created', 'updated', 'deleted', 'assigned', 'unassigned']],
                },
            },
            entityCode: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            entityTitle: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
        },
        {
            tableName: 'activity_logs',
            timestamps: true,
            underscored: true,
        }
    );
};
