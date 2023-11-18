import { promisify } from 'util';
import { exec as execCallback } from 'child_process';

export const exec = promisify(execCallback);