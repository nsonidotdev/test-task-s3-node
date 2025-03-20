import { handleDeleteObject } from './delete.js';
import { handleListObjects } from './list.js';
import { handleUpload } from './upload.js'

export const routes = {
    'POST:/upload': handleUpload,
    'GET:/': handleListObjects,
    'DELETE:/:key': handleDeleteObject,
};