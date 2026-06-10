import { DataTypes } from 'sequelize';

export const ComputerModel = (sequelize) =>
    sequelize.define(
        'Computer',
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
                type: DataTypes.STRING(30),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            computerType: {
                type: DataTypes.STRING(30),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            brand: {
                type: DataTypes.STRING(30),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            model: {
                type: DataTypes.STRING(30),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            state: {
                type: DataTypes.STRING(30),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            ramMemory: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            cpu: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            storage: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            storageType: {
                type: DataTypes.STRING(30),
                allowNull: true,
                defaultValue: '',
            },
            operatingSystem: {
                type: DataTypes.STRING(100),
                allowNull: true,
                defaultValue: '',
            },
            graphicCard: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            powerSupply: {
                type: DataTypes.STRING(100),
                allowNull: true,
                defaultValue: '',
            },
            motherboard: {
                type: DataTypes.STRING(100),
                allowNull: true,
                defaultValue: '',
            },
            cooler: {
                type: DataTypes.STRING(100),
                allowNull: true,
                defaultValue: '',
            },
            cdDvd: {
                type: DataTypes.STRING(100),
                allowNull: true,
                defaultValue: '',
            },
        },
        {
            tableName: 'computers',
            timestamps: true,
            underscored: true,
        }
    );
