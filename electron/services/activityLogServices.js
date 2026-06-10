import { ActivityLog } from '../database.js';
import { Op } from 'sequelize';

/**
 * Registra una actividad en el log
 */
export const logActivity = async (entityType, entityId, action, entityCode = null, entityTitle = null) => {
    try {
        await ActivityLog.create({
            entityType,
            entityId,
            action,
            entityCode,
            entityTitle,
        });
    } catch (error) {
        console.error('Error al registrar actividad:', error);
        // No lanzamos el error para que no afecte la operación principal
    }
};

/**
 * Obtiene todas las actividades de la última semana
 */
export const getRecentActivities = async () => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        oneWeekAgo.setHours(0, 0, 0, 0);

        const activities = await ActivityLog.findAll({
            where: {
                createdAt: {
                    [Op.gte]: oneWeekAgo,
                },
            },
            order: [['createdAt', 'DESC']],
        });

        return activities.map((activity) => {
            // Convertir el objeto activity a un objeto JSON
            const activityData = activity.toJSON();

            // Devolver los datos de la actividad
            return {
                id: activityData.id,
                type: activityData.entityType,
                action: activityData.action,
                code: activityData.entityCode,
                title: activityData.entityTitle,
                date: activityData.createdAt,
                entityId: activityData.entityId,
            };
        });
    } catch (error) {
        console.error('Error al obtener actividades recientes:', error);
        throw error;
    }
};
