import bcrypt from 'bcryptjs';
import { User } from '../database.js';

export const registerUser = async (userData) => {
    const {
        firstName,
        username,
        cedula,
        password,
        securityQuestion1Id,
        securityAnswer1,
        securityQuestion2Id,
        securityAnswer2,
        // Extraer el rol del usuario (por defecto 'admin' si no se especifica)
        role = 'admin',
    } = userData;

    // Verificar que las preguntas sean diferentes
    if (securityQuestion1Id === securityQuestion2Id) {
        throw new Error('Las preguntas de seguridad deben ser diferentes');
    }

    // Verificar si el usuario ya existe (username único)
    const existingUserByUsername = await User.findOne({
        where: {
            username: username.trim(),
        },
    });
    if (existingUserByUsername) {
        throw new Error('El nombre de usuario ya está en uso');
    }

    // Verificar si la cédula ya existe (cédula única)
    const existingUserByCedula = await User.findOne({
        where: {
            cedula: cedula.trim(),
        },
    });
    if (existingUserByCedula) {
        throw new Error('El número de cédula ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hashear las respuestas de seguridad
    const hashedAnswer1 = await bcrypt.hash(securityAnswer1.toLowerCase().trim(), 10);
    const hashedAnswer2 = await bcrypt.hash(securityAnswer2.toLowerCase().trim(), 10);

    // Crear el usuario con todos sus campos incluyendo el rol
    const newUser = await User.create({
        firstName: firstName.trim(),
        username: username.trim(),
        cedula: cedula.trim(),
        password: hashedPassword,
        securityQuestion1Id,
        securityAnswer1: hashedAnswer1,
        securityQuestion2Id,
        securityAnswer2: hashedAnswer2,
        role, // Guardar el rol asignado al usuario
    });

    // Retornar usuario sin información sensible
    return {
        id: newUser.id,
        firstName: newUser.firstName,
        username: newUser.username,
        cedula: newUser.cedula,
        role: newUser.role, // Incluir el rol en la respuesta
        createdAt: newUser.createdAt,
    };
};

export const loginUser = async (username, password) => {
    // Buscar usuario por username
    const user = await User.findOne({
        where: {
            username: username.trim(),
        },
    });
    if (!user) {
        throw new Error('El nombre de usuario no existe. Verifica que esté escrito correctamente.');
    }

    // Verificar si la cuenta está activa
    if (!user.active) {
        throw new Error('Esta cuenta está deshabilitada. Contacta a un administrador.');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('La contraseña es incorrecta. Intenta nuevamente.');
    }

    // Retornar usuario sin información sensible incluyendo el rol
    return {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
        cedula: user.cedula,
        role: user.role, // Incluir el rol para que el frontend sepa qué permisos tiene
        createdAt: user.createdAt,
    };
};

export const verifySecurityQuestions = async (username, answer1, answer2) => {
    const user = await User.findOne({
        where: {
            username: username.trim(),
        },
    });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Verificar respuestas de seguridad
    const isAnswer1Valid = await bcrypt.compare(answer1.toLowerCase().trim(), user.securityAnswer1);
    const isAnswer2Valid = await bcrypt.compare(answer2.toLowerCase().trim(), user.securityAnswer2);

    if (!isAnswer1Valid || !isAnswer2Valid) {
        throw new Error('Las respuestas de seguridad no coinciden');
    }

    return {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
    };
};

export const resetPassword = async (username, newPassword) => {
    const user = await User.findOne({
        where: {
            username: username.trim(),
        },
    });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await user.update({ password: hashedPassword });

    return {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
    };
};

export const getSecurityQuestions = async (username) => {
    const user = await User.findOne({
        where: {
            username: username.trim(),
        },
    });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    return {
        securityQuestion1Id: user.securityQuestion1Id,
        securityQuestion2Id: user.securityQuestion2Id,
    };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    // Buscar usuario por ID
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new Error('La contraseña actual no es correcta');
    }

    // Verificar que la nueva contraseña sea diferente a la actual
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await user.update({ password: hashedPassword });

    return {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
    };
};

export const changeSecurityQuestions = async (
    userId,
    currentPassword,
    securityQuestion1Id,
    securityAnswer1,
    securityQuestion2Id,
    securityAnswer2
) => {
    // Buscar usuario por ID
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new Error('La contraseña actual no es correcta');
    }

    // Verificar que las preguntas sean diferentes
    if (securityQuestion1Id === securityQuestion2Id) {
        throw new Error('Las preguntas de seguridad deben ser diferentes');
    }

    // Hashear las nuevas respuestas de seguridad
    const hashedAnswer1 = await bcrypt.hash(securityAnswer1.toLowerCase().trim(), 10);
    const hashedAnswer2 = await bcrypt.hash(securityAnswer2.toLowerCase().trim(), 10);

    // Actualizar preguntas y respuestas de seguridad
    await user.update({
        securityQuestion1Id,
        securityAnswer1: hashedAnswer1,
        securityQuestion2Id,
        securityAnswer2: hashedAnswer2,
    });

    return {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
    };
};

export const getUserByCedula = async (cedula) => {
    // Buscar usuario por cédula
    const user = await User.findOne({
        where: {
            cedula: cedula.trim(),
        },
    });
    if (!user) {
        throw new Error('No se encontró un usuario con esa cédula');
    }

    // Retornar solo el nombre de usuario
    return {
        username: user.username,
    };
};

export const getCurrentUser = async (userId) => {
    // Buscar usuario por ID
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Retornar usuario sin información sensible incluyendo el rol
    return {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
        cedula: user.cedula,
        role: user.role, // Incluir el rol del usuario
        createdAt: user.createdAt,
    };
};

export const updateUserInfo = async (userId, firstName, username, cedula) => {
    // Buscar usuario por ID
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Si el username cambió, verificar que no esté en uso por otro usuario
    if (username.trim() !== user.username.trim()) {
        const existingUser = await User.findOne({
            where: {
                username: username.trim(),
            },
        });
        if (existingUser && existingUser.id !== userId) {
            throw new Error('El nombre de usuario ya está en uso');
        }
    }

    // Si la cédula cambió, verificar que no esté en uso por otro usuario
    if (cedula.trim() !== user.cedula.trim()) {
        const existingUserByCedula = await User.findOne({
            where: {
                cedula: cedula.trim(),
            },
        });
        if (existingUserByCedula && existingUserByCedula.id !== userId) {
            throw new Error('El número de cédula ya está registrado');
        }
    }

    // Actualizar información del usuario
    await user.update({
        firstName: firstName.trim(),
        username: username.trim(),
        cedula: cedula.trim(),
    });

    // Retornar usuario actualizado
    return {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
        cedula: user.cedula,
        createdAt: user.createdAt,
    };
};

export const deleteUser = async (userId, password) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('La contraseña es incorrecta');
    }

    await user.destroy();

    return { success: true };
};

export const hasUsers = async () => {
    const userCount = await User.count();
    return userCount > 0;
};

export const getAllUsers = async () => {
    const users = await User.findAll({
        attributes: { exclude: ['password', 'securityAnswer1', 'securityAnswer2'] },
        order: [['createdAt', 'DESC']],
    });
    return users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        username: user.username,
        cedula: user.cedula,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
    }));
};

export const adminUpdateUser = async (userId, { role, active }) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (active !== undefined) updateData.active = active;

    await user.update(updateData);

    return {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
        cedula: user.cedula,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
    };
};

export const adminResetPassword = async (userId, newPassword) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return { success: true };
};

export const adminDeleteUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    await user.destroy();
    return { success: true };
};