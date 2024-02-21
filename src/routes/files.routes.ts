import express from 'express';
import FileController from '../controllers/files.controller';
import upload from '../utils/storage/multer';
const fileRouter = express.Router();
const fileController = new FileController();

// Endpoints
fileRouter.post('/add', upload.single('file'), fileController.addFile);
fileRouter.post('/add-folder', fileController.addFolder);
fileRouter.post('/remove-file-from-folder', fileController.removeFileFromFolder);
fileRouter.post('/add-file-to-folder', fileController.addFileToFolder);
fileRouter.get('/get-files/:userId', fileController.getFilesByUser);
fileRouter.get('/get-files-in-folder/:userId/:folderId', fileController.getFilesInFolder);
fileRouter.get('/get-file-metadata/:fileId', fileController.getFileMetadata);
fileRouter.get('/get-folder-and-files/:folderId', fileController.getFolderAndFiles);
fileRouter.delete('/delete-file/:fileId', fileController.deleteFile);
fileRouter.delete('/delete-folder/:folderId', fileController.deleteFolder);
fileRouter.post('/scan-file-for-virus', upload.single('file'), fileController.scanFileForVirus);

export default fileRouter;
