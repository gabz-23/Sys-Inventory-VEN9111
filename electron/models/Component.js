import { DataTypes } from 'sequelize';

export const ComponentModel = (sequelize) => {
    return sequelize.define(
        'Component',
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
            brand: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            model: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            specs: {
                type: DataTypes.STRING(255),
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
            tableName: 'components',
            timestamps: true,
            underscored: true,
        }
    );
};
