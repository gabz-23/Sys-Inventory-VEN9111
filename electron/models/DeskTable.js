import { DataTypes } from 'sequelize';

export const DeskDataTableModel = (sequelize) => {
    return sequelize.define(
        'DeskTable',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            code: {
                type: DataTypes.STRING(15),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            computerId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'computers',
                    key: 'id',
                },
            },
            employeeId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'employees',
                    key: 'id',
                },
            },
        },
        {
            tableName: 'desktables',
            timestamps: true,
            underscored: true,
        }
    );
};
