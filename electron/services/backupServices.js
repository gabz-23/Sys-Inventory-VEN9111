import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

const DB_CONFIG = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dbpass901',
    database: 'sys_ven911',
};

const COMMON_MYSQL_PATHS = [
    'C:/Program Files/MySQL/MySQL Server 8.0/bin',
    'C:/Program Files/MySQL/MySQL Server 8.4/bin',
    'C:/Program Files/MySQL/MySQL Server 9.0/bin',
    'C:/Program Files (x86)/MySQL/MySQL Server 8.0/bin',
    'C:/Program Files (x86)/MySQL/MySQL Server 8.4/bin',
    'C:/xampp/mysql/bin',
    'C:/wamp64/bin/mysql/mysql8.0.30/bin',
    'C:/wamp64/bin/mysql/mysql8.4.0/bin',
    'C:/laragon/bin/mysql/mysql-8.0.30-winx64/bin',
    'C:/laragon/bin/mysql/mysql-8.4.0-winx64/bin',
];

const findMysqlBinDir = async () => {
    try {
        const { stdout } = await execAsync('where mysqldump', { timeout: 5000 });
        const line = stdout.trim().split('\n')[0];
        if (line) {
            return line.substring(0, line.toLowerCase().lastIndexOf('mysqldump'));
        }
    } catch {
        // mysqldump not found in PATH
    }

    for (const dir of COMMON_MYSQL_PATHS) {
        const exePath = `${dir}/mysqldump.exe`;
        try {
            await fs.promises.access(exePath);
            return dir + '/';
        } catch {
            // not found in this path, continue searching
        }
    }

    return '';
};

const getMysqlBinDir = async () => {
    let dir = mysqlBinCache;
    if (!dir) {
        dir = await findMysqlBinDir();
        mysqlBinCache = dir;
    }
    return dir;
};

let mysqlBinCache = null;

export const backupDatabase = async (savePath) => {
    const binDir = await getMysqlBinDir();
    const mysqldump = `${binDir}mysqldump`;

    const cmd = [
        `"${mysqldump}"`,
        `--host=${DB_CONFIG.host}`,
        `--port=${DB_CONFIG.port}`,
        `--user=${DB_CONFIG.user}`,
        `--password=${DB_CONFIG.password}`,
        '--routines',
        '--events',
        '--triggers',
        '--single-transaction',
        DB_CONFIG.database,
        `--result-file="${savePath}"`,
    ].join(' ');

    try {
        await execAsync(cmd, { timeout: 120000 });
        return { success: true, path: savePath };
    } catch (error) {
        throw new Error(`Error al crear respaldo: ${error.message}`);
    }
};

export const restoreDatabase = async (backupPath) => {
    const binDir = await getMysqlBinDir();
    const mysql = `${binDir}mysql`;

    const cmd = [
        `"${mysql}"`,
        `--host=${DB_CONFIG.host}`,
        `--port=${DB_CONFIG.port}`,
        `--user=${DB_CONFIG.user}`,
        `--password=${DB_CONFIG.password}`,
        DB_CONFIG.database,
        `< "${backupPath}"`,
    ].join(' ');

    try {
        await execAsync(cmd, { timeout: 300000 });
        return { success: true };
    } catch (error) {
        throw new Error(`Error al restaurar respaldo: ${error.message}`);
    }
};