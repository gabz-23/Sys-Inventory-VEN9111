import { DataTypes } from 'sequelize';

export const PeripheralModel = (sequelize) => {
    return sequelize.define(
        'Peripheral',
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
            serial: {
                type: DataTypes.STRING(255),
                allowNull: true,
                unique: true,
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            brand: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            model: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            connectionType: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING(30),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            state: {
                type: DataTypes.STRING(30),
                allowNull: false,
                defaultValue: 'Bueno',
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
        },
        {
            tableName: 'peripherals',
            timestamps: true,
            underscored: true,
        }
    );
};
