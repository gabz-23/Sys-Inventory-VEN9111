import { DataTypes } from 'sequelize';

export const EmployeeModel = (sequelize) => {
    return sequelize.define(
        'Employee',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            nombres: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            apellidos: {
                type: DataTypes.STRING(100),
                allowNull: false,
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
            telefono: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            tipoEmpleado: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            estado: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'Activo',
            },
            correo: {
                type: DataTypes.STRING(100),
                allowNull: true,
                validate: {
                    isEmail: true,
                },
            },
        },
        {
            tableName: 'employees',
            timestamps: true,
            underscored: true,
        }
    );
};
