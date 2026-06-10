import { DataTypes } from 'sequelize';

export const DeskAccessoryModel = (sequelize) => {
    return sequelize.define(
        'DeskAccessory',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            code: {
                type: DataTypes.STRING(15),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            serial: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING(40),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            type: {
                type: DataTypes.STRING(30),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            state: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'Bueno',
                validate: {
                    isIn: [['Bueno', 'Dañado', 'Repuesto', 'En reparacion', 'Reparado', 'Reconstruido']],
                },
            },
            deskTableId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'desktables',
                    key: 'id',
                },
            },
        },
        {
            tableName: 'desk_accessories',
            timestamps: true,
            underscored: true,
        }
    );
};
