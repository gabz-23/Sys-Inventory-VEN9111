import { contextBridge, ipcRenderer } from 'electron';

// Exponer API segura al frontend
contextBridge.exposeInMainWorld('electronAPI', {
    // Operaciones CRUD del computador
    getAllComputers: () => ipcRenderer.invoke('db:getAllComputers'),
    createComputer: (data) => ipcRenderer.invoke('db:createComputer', data),
    updateComputer: (id, data) => ipcRenderer.invoke('db:updateComputer', { id, data }),
    deleteComputer: (id) => ipcRenderer.invoke('db:deleteComputer', id),

    // Operaciones CRUD de escritorios
    getAllDeskTables: () => ipcRenderer.invoke('db:getAllDeskTables'),
    createDeskTable: (data) => ipcRenderer.invoke('db:createDeskTable', data),
    updateDeskTable: (id, data) => ipcRenderer.invoke('db:updateDeskTable', { id, data }),
    deleteDeskTable: (id) => ipcRenderer.invoke('db:deleteDeskTable', id),

    // Operaciones CRUD de accesorios de escritorio
    getAllDeskAccessories: () => ipcRenderer.invoke('db:getAllDeskAccessories'),
    createDeskAccessory: (data) => ipcRenderer.invoke('db:createDeskAccessory', data),
    updateDeskAccessory: (id, data) => ipcRenderer.invoke('db:updateDeskAccessory', { id, data }),
    deleteDeskAccessory: (id) => ipcRenderer.invoke('db:deleteDeskAccessory', id),

    // Operaciones CRUD de componentes
    getAllComponents: () => ipcRenderer.invoke('db:getAllComponents'),
    createComponent: (data) => ipcRenderer.invoke('db:createComponent', data),
    updateComponent: (id, data) => ipcRenderer.invoke('db:updateComponent', { id, data }),
    deleteComponent: (id) => ipcRenderer.invoke('db:deleteComponent', id),

    // Operaciones CRUD de periféricos
    getAllPeripherals: () => ipcRenderer.invoke('db:getAllPeripherals'),
    createPeripheral: (data) => ipcRenderer.invoke('db:createPeripheral', data),
    updatePeripheral: (id, data) => ipcRenderer.invoke('db:updatePeripheral', { id, data }),
    deletePeripheral: (id) => ipcRenderer.invoke('db:deletePeripheral', id),

    // Operaciones de selección múltiple
    duplicateComputers: (ids) => ipcRenderer.invoke('db:duplicateComputers', ids),
    deleteManyComputers: (ids) => ipcRenderer.invoke('db:deleteManyComputers', ids),
    duplicateDeskTables: (ids) => ipcRenderer.invoke('db:duplicateDeskTables', ids),
    deleteManyDeskTables: (ids) => ipcRenderer.invoke('db:deleteManyDeskTables', ids),
    duplicateDeskAccessories: (ids) => ipcRenderer.invoke('db:duplicateDeskAccessories', ids),
    deleteManyDeskAccessories: (ids) => ipcRenderer.invoke('db:deleteManyDeskAccessories', ids),
    duplicateComponents: (ids) => ipcRenderer.invoke('db:duplicateComponents', ids),
    deleteManyComponents: (ids) => ipcRenderer.invoke('db:deleteManyComponents', ids),
    duplicatePeripherals: (ids) => ipcRenderer.invoke('db:duplicatePeripherals', ids),
    deleteManyPeripherals: (ids) => ipcRenderer.invoke('db:deleteManyPeripherals', ids),

    // Operaciones CRUD de empleados
    getAllEmployees: () => ipcRenderer.invoke('db:getAllEmployees'),
    createEmployee: (data) => ipcRenderer.invoke('db:createEmployee', data),
    updateEmployee: (id, data) => ipcRenderer.invoke('db:updateEmployee', { id, data }),
    deleteEmployee: (id) => ipcRenderer.invoke('db:deleteEmployee', id),
    duplicateEmployees: (ids) => ipcRenderer.invoke('db:duplicateEmployees', ids),
    deleteManyEmployees: (ids) => ipcRenderer.invoke('db:deleteManyEmployees', ids),

    // Operaciones CRUD de trazabilidad de items
    getAllItemTraces: () => ipcRenderer.invoke('db:getAllItemTraces'),
    createItemTrace: (data) => ipcRenderer.invoke('db:createItemTrace', data),
    updateItemTrace: (id, data) => ipcRenderer.invoke('db:updateItemTrace', { id, data }),
    deleteItemTrace: (id) => ipcRenderer.invoke('db:deleteItemTrace', id),
    deleteManyItemTraces: (ids) => ipcRenderer.invoke('db:deleteManyItemTraces', ids),

    // Operaciones de canibalización
    getAllCannibalizaciones: () => ipcRenderer.invoke('db:getAllCannibalizaciones'),
    createCannibalizacion: (data) => ipcRenderer.invoke('db:createCannibalizacion', data),
    createBulkCannibalizacion: (data) => ipcRenderer.invoke('db:createBulkCannibalizacion', data),
    deleteCannibalizacion: (id) => ipcRenderer.invoke('db:deleteCannibalizacion', id),
    getMissingItemsByComputer: (computerId) => ipcRenderer.invoke('db:getMissingItemsByComputer', computerId),
    createBulkCannibalizationMovement: (data) => ipcRenderer.invoke('db:createBulkCannibalizationMovement', data),
    getAllCannibalizationMovements: () => ipcRenderer.invoke('db:getAllCannibalizationMovements'),
    deleteManyCannibalizationMovements: (ids) => ipcRenderer.invoke('db:deleteManyCannibalizationMovements', ids),

    // Operaciones de bitácora de canibalización
    getCannibalizationLogItems: (states) => ipcRenderer.invoke('db:getCannibalizationLogItems', states),
    transitionItemState: (data) => ipcRenderer.invoke('db:transitionItemState', data),
    getAvailableItems: () => ipcRenderer.invoke('db:getAvailableItems'),

    // Operaciones de reporte de trazabilidad unificado
    getUnifiedTraceability: (filters) => ipcRenderer.invoke('db:getUnifiedTraceability', filters),
    getTraceabilityUsers: () => ipcRenderer.invoke('db:getTraceabilityUsers'),
    getTraceabilityItemTypes: () => ipcRenderer.invoke('db:getTraceabilityItemTypes'),

    // Operaciones de respaldo de base de datos
    backupDatabase: () => ipcRenderer.invoke('db:backupDatabase'),
    restoreDatabase: () => ipcRenderer.invoke('db:restoreDatabase'),

    // Operaciones de logs de actividad
    getRecentActivities: () => ipcRenderer.invoke('db:getRecentActivities'),

    // Operaciones de autenticación
    register: (userData) => ipcRenderer.invoke('auth:register', userData),
    login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
    getSecurityQuestions: (email) => ipcRenderer.invoke('auth:getSecurityQuestions', email),
    verifySecurityQuestions: (data) => ipcRenderer.invoke('auth:verifySecurityQuestions', data),
    resetPassword: (data) => ipcRenderer.invoke('auth:resetPassword', data),
    changePassword: (data) => ipcRenderer.invoke('auth:changePassword', data),
    changeSecurityQuestions: (data) => ipcRenderer.invoke('auth:changeSecurityQuestions', data),
    updateUserInfo: (data) => ipcRenderer.invoke('auth:updateUserInfo', data),
    getCurrentUser: (userId) => ipcRenderer.invoke('auth:getCurrentUser', userId),
    getUserByCedula: (cedula) => ipcRenderer.invoke('auth:getUserByCedula', cedula),
    deleteUser: (data) => ipcRenderer.invoke('auth:deleteUser', data),
    hasUsers: () => ipcRenderer.invoke('auth:hasUsers'),

    // Operaciones de administración de usuarios (solo admin)
    getAllUsers: () => ipcRenderer.invoke('auth:getAllUsers'),
    adminUpdateUser: (data) => ipcRenderer.invoke('auth:adminUpdateUser', data),
    adminResetPassword: (data) => ipcRenderer.invoke('auth:adminResetPassword', data),
    adminDeleteUser: (userId) => ipcRenderer.invoke('auth:adminDeleteUser', userId),
});
