import { handleListObjects } from './list.js';
import { handleUpload } from './upload.js'

export const routes = {
    'POST:/upload': handleUpload,
    'GET:/': handleListObjects
};