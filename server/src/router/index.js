import { handleDelete } from './delete.js';
import { handleList } from './list.js';
import { handleReplace } from './replace.js';
import { handleUpload } from './upload.js'

export const routes = {
    'POST:/': handleUpload,
    'GET:/': handleList,
    'DELETE:/:key': handleDelete,
    'PUT:/:key': handleReplace,
};