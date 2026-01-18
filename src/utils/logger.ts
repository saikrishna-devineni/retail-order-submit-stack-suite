import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const isCI = process.env.CI === 'true';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('Z')[0];
const LOG_FILE = path.join(process.cwd(), `orchestration-${timestamp}.log`);

export class Logger {
    static log(message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] INFO: ${message}`;
        
        console.log(chalk.blue(logEntry));
        
        if (data) {
            console.log(data);
        }
        
        this.writeToFile(logEntry, data);
    }

    static success(message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] SUCCESS: ${message}`;
        
        console.log(chalk.green(logEntry));
        
        if (data) {
            console.log(data);
        }
        
        this.writeToFile(logEntry, data);
    }

    static error(message: string, error?: any) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ERROR: ${message}`;
        
        console.error(chalk.red(logEntry));
        
        if (error) {
            console.error(error);
        }
        
        this.writeToFile(logEntry, error);
    }

    static step(stepName: string, stepNumber: number, totalSteps: number) {
        const message = `Step ${stepNumber}/${totalSteps}: ${stepName}`;
        console.log(chalk.yellow(`\n===> ${message} <===`));
        this.writeToFile(message);
    }

    private static writeToFile(message: string, data?: any) {
        try {
            let logContent = message;
            
            if (data) {
                const sanitized = this.sanitize(data);
                logContent += '\n' + JSON.stringify(sanitized, null, 2);
            }
            
            fs.appendFileSync(LOG_FILE, logContent + '\n');
        } catch (err) {
            console.error('Failed to write to log file:', err);
        }
    }

    private static sanitize(data: any): any {
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        const sanitized = { ...data };
        
        const sensitiveFields = [
            'jwt_token', 
            'password', 
            'authorization', 
            'auth_token',
            'bearer',
            'taxpayer_id',
            'ssn'
        ];
        
        for (const field of sensitiveFields) {
            if (field in sanitized) {
                sanitized[field] = '[REDACTED]';
            }
        }
        
        return sanitized;
    }

    static clearOldLogs(daysToKeep: number = 7) {
        try {
            const logsDir = process.cwd();
            const files = fs.readdirSync(logsDir);
            const now = Date.now();
            const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

            files.forEach(file => {
                if (file.startsWith('orchestration-') && file.endsWith('.log')) {
                    const filePath = path.join(logsDir, file);
                    const stats = fs.statSync(filePath);
                    const age = now - stats.mtime.getTime();

                    if (age > maxAge) {
                        fs.unlinkSync(filePath);
                        console.log(`Deleted old log file: ${file}`);
                    }
                }
            });
        } catch (err) {
            console.error('Failed to clear old logs:', err);
        }
    }

    static getLogFileName(): string {
        return LOG_FILE;
    }
}