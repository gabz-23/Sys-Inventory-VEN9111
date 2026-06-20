import { Employee, DeskTable } from '../database.js';
import { logActivity } from './activityLogServices.js';

const unlinkEmployeeFromDesk = async (employeeId) => {
    await DeskTable.sequelize.query(
        'UPDATE desktables SET employee_id = NULL WHERE employee_id = ?',
        { replacements: [employeeId] }
    );
};

export const getAllEmployees = async () => {
    const employees = await Employee.findAll({
        order: [['createdAt', 'ASC']],
    });

    return employees.map((emp) => emp.toJSON());
};

export const createEmployee = async (data) => {
    const sanitized = {
        ...data,
        correo: data.correo?.trim() || null,
        telefono: data.telefono?.trim() || null,
    };
    const created = await Employee.create(sanitized);

    await logActivity('employee', created.id, 'created', created.nombres, 'Empleado');

    return created.toJSON();
};

export const updateEmployee = async (id, data) => {
    const sanitized = {
        ...data,
        correo: data.correo?.trim() || null,
        telefono: data.telefono?.trim() || null,
    };
    await Employee.update(sanitized, { where: { id } });

    const updated = await Employee.findByPk(id);

    if (!updated) {
        throw new Error('Empleado no encontrado después de la actualización');
    }

    await logActivity('employee', id, 'updated', updated.nombres, 'Empleado');

    return updated.toJSON();
};

export const deleteEmployee = async (id) => {
    const employeeToDelete = await Employee.findByPk(id);

    await unlinkEmployeeFromDesk(id);
    await Employee.destroy({ where: { id } });

    if (employeeToDelete) {
        await logActivity('employee', id, 'deleted', employeeToDelete.nombres, 'Empleado');
    }
};

export const duplicateEmployees = async (ids) => {
    const originals = await Employee.findAll({ where: { id: ids } });

    const duplicated = [];
    for (const original of originals) {
        const created = await Employee.create({
            nombres: `${original.nombres} (Copia)`,
            apellidos: original.apellidos,
            cedula: `${original.cedula}-DUP${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
            telefono: original.telefono,
            correo: original.correo,
            tipoEmpleado: original.tipoEmpleado,
            estado: original.estado,
        });

        await logActivity('employee', created.id, 'created', created.nombres, 'Empleado');
        duplicated.push(created);
    }

    return duplicated;
};

export const deleteManyEmployees = async (ids) => {
    for (const id of ids) {
        await deleteEmployee(id);
    }
    return { success: true };
};
