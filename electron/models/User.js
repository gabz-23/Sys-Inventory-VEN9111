import { DataTypes } from 'sequelize';

export const UserModel = (sequelize) => {
    return sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            cedula: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            securityQuestion1Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            securityAnswer1: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            securityQuestion2Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            securityAnswer2: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            // Campo para el rol del usuario: admin (acceso completo) o viewer (solo lectura)
            role: {
                type: DataTypes.ENUM('admin', 'viewer'),
                allowNull: false,
                defaultValue: 'admin',
            },
            // Campo para habilitar/deshabilitar la cuenta del usuario
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            tableName: 'users',
            timestamps: true,
            underscored: true,
        }
    );
};
