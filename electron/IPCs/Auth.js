import { ipcMain } from 'electron';
import {
    registerUser,
    loginUser,
    verifySecurityQuestions,
    resetPassword,
    getSecurityQuestions,
    changePassword,
    changeSecurityQuestions,
    updateUserInfo,
    getCurrentUser,
    getUserByCedula,
    deleteUser,
    hasUsers,
    getAllUsers,
    adminUpdateUser,
    adminResetPassword,
    adminDeleteUser,
} from '../services/authServices.js';

export default () => {
    ipcMain.handle('auth:register', async (_, userData) => {
        try {
            return await registerUser(userData);
        } catch (error) {
            throw new Error(error.message || 'Error al registrar usuario');
        }
    });

    ipcMain.handle('auth:login', async (_, { username, password }) => {
        try {
            return await loginUser(username, password);
        } catch (error) {
            throw new Error(error.message || 'Error al iniciar sesión');
        }
    });

    ipcMain.handle('auth:getSecurityQuestions', async (_, username) => {
        try {
            return await getSecurityQuestions(username);
        } catch (error) {
            throw new Error(error.message || 'Error al obtener preguntas de seguridad');
        }
    });

    ipcMain.handle('auth:verifySecurityQuestions', async (_, { username, answer1, answer2 }) => {
        try {
            return await verifySecurityQuestions(username, answer1, answer2);
        } catch (error) {
            throw new Error(error.message || 'Error al verificar preguntas de seguridad');
        }
    });

    ipcMain.handle('auth:resetPassword', async (_, { username, newPassword }) => {
        try {
            return await resetPassword(username, newPassword);
        } catch (error) {
            throw new Error(error.message || 'Error al restablecer contraseña');
        }
    });

    ipcMain.handle('auth:changePassword', async (_, { userId, currentPassword, newPassword }) => {
        try {
            return await changePassword(userId, currentPassword, newPassword);
        } catch (error) {
            throw new Error(error.message || 'Error al cambiar contraseña');
        }
    });

    ipcMain.handle(
        'auth:changeSecurityQuestions',
        async (
            _,
            { userId, currentPassword, securityQuestion1Id, securityAnswer1, securityQuestion2Id, securityAnswer2 }
        ) => {
        try {
                return await changeSecurityQuestions(
                    userId,
                    currentPassword,
                    securityQuestion1Id,
                    securityAnswer1,
                    securityQuestion2Id,
                    securityAnswer2
                );
        } catch (error) {
            throw new Error(error.message || 'Error al cambiar preguntas de seguridad');
            }
        }
    );

    ipcMain.handle('auth:updateUserInfo', async (_, { userId, firstName, username, cedula }) => {
        try {
            return await updateUserInfo(userId, firstName, username, cedula);
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar información del usuario');
        }
    });

    ipcMain.handle('auth:getCurrentUser', async (_, userId) => {
        try {
            return await getCurrentUser(userId);
        } catch (error) {
            throw new Error(error.message || 'Error al obtener información del usuario');
        }
    });

    ipcMain.handle('auth:getUserByCedula', async (_, cedula) => {
        try {
            return await getUserByCedula(cedula);
        } catch (error) {
            throw new Error(error.message || 'Error al buscar usuario por cédula');
        }
    });

    ipcMain.handle('auth:deleteUser', async (_, { userId, password }) => {
        try {
            return await deleteUser(userId, password);
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar usuario');
        }
    });

    ipcMain.handle('auth:hasUsers', async () => {
        try {
            return await hasUsers();
        } catch (error) {
            throw new Error(error.message || 'Error al verificar usuarios');
        }
    });

    // ---- Handlers de administración de usuarios (solo admin) ----

    ipcMain.handle('auth:getAllUsers', async () => {
        try {
            return await getAllUsers();
        } catch (error) {
            throw new Error(error.message || 'Error al obtener usuarios');
        }
    });

    ipcMain.handle('auth:adminUpdateUser', async (_, { userId, data }) => {
        try {
            return await adminUpdateUser(userId, data);
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar usuario');
        }
    });

    ipcMain.handle('auth:adminResetPassword', async (_, { userId, newPassword }) => {
        try {
            return await adminResetPassword(userId, newPassword);
        } catch (error) {
            throw new Error(error.message || 'Error al restablecer contraseña');
        }
    });

    ipcMain.handle('auth:adminDeleteUser', async (_, userId) => {
        try {
            return await adminDeleteUser(userId);
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar usuario');
        }
    });
};
