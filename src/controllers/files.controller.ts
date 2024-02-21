import { Request, Response } from 'express';
import FileService from '../services/files.service';
import multer from 'multer';
import fs from 'fs';
import storageBucket from '../utils/storage/firebase';
import logger from '../utils/logging/logger';

const fileService = new FileService();


class FileController {
    // This function is buggy, fix tomorrow
    async addFile(req: Request, res: Response) {
        try {
            if (!req.file) {
                throw new Error('File not found');
            }
            let { userId } = req.body;
            userId = Number(userId);
            const name = req.file.originalname;
            const fileName = name;
            const image = req.file.path;
            const size = req.file.size;
            const type = req.file.mimetype;
            const extension = req.file.originalname.split('.').pop();
            if (!extension) {
                throw new Error('File extension not found');
            } else if ( extension === 'pdf' ) {
                const isNotSafe = await fileService.scanFileForVirus(image);
                if (isNotSafe) {
                    throw new Error('File contains a virus and cannot be added.');
                }
            }
            const metadata = JSON.stringify(req.body);
            const file = storageBucket.file(name);
            fs.createReadStream(image).pipe(file.createWriteStream()).on('error', (error) => {
                logger.error(error);
                return res.status(500).json({ success: false, error: 'Internal Server Error' });
            }).once('finish', async () => {
                await file.makePublic();
                // How do we get the link with which to access the file? We need to store that
                // Let me try this
                // const fileUrl = await file.getSignedUrl({
                //     action: 'read',
                //     expires: '03-09-2491'
                // });
                const fileUrl = `https://storage.googleapis.com/${process.env.BUCKET_URL}/${fileName}`;
                // Above code is untested
                const addedFile = await fileService.addFile(userId, name, fileUrl, size, type, extension, metadata, fileUrl);
                return res.status(201).json({ success: true, data: addedFile });
            }).end(req.file.buffer);
        } catch (error: any) {
            logger.error(error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async addFolder(req: Request, res: Response) {
        try {
            const { userId, name, path } = req.body;
            if (!userId || !name ) {
                throw new Error('Missing required fields');
            }

            const addedFolder = await fileService.addFolder(userId, name, path);

            return res.status(201).json({ success: true, data: addedFolder });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async removeFileFromFolder(req: Request, res: Response) {
        try {
            const { folderId, fileId } = req.body;

            const removedFile = await fileService.removeFileFromFolder(folderId, fileId);

            return res.status(200).json({ success: true, data: removedFile });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async addFileToFolder(req: Request, res: Response) {
        try {
            const { folderId, fileId } = req.body;

            const addedFile = await fileService.addFileToFolder(folderId, fileId);

            return res.status(200).json({ success: true, data: addedFile });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async getFilesByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            const files = await fileService.getFilesByUser(Number(userId));

            return res.status(200).json({ success: true, data: files });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async getFilesInFolder(req: Request, res: Response) {
        try {
            const { userId, folderId } = req.params;

            const files = await fileService.getFilesInFolder(Number(userId), Number(folderId));

            return res.status(200).json({ success: true, data: files });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async getFileMetadata(req: Request, res: Response) {
        try {
            const { fileId } = req.params;

            const fileMetadata = await fileService.getFileMetadata(Number(fileId));

            return res.status(200).json({ success: true, data: fileMetadata });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async getFolderAndFiles(req: Request, res: Response) {
        try {
            const { folderId } = req.params;

            const folderAndFiles = await fileService.getFolderAndFiles(Number(folderId));

            return res.status(200).json({ success: true, data: folderAndFiles });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async deleteFile(req: Request, res: Response) {
        try {
            const { fileId } = req.params;

            const deletedFile = await fileService.deleteFile(Number(fileId));

            return res.status(200).json({ success: true, data: deletedFile });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async deleteFolder(req: Request, res: Response) {
        try {
            const { folderId } = req.params;

            const deletedFolder = await fileService.deleteFolder(Number(folderId));

            return res.status(200).json({ success: true, data: deletedFolder });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async scanFileForVirus(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, error: 'No file provided' });
            }
            const filePath = req.file.path;

            const isSafe = await fileService.scanFileForVirus(filePath);

            return res.status(200).json({ success: true, data: { isSafe } });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

}

export default FileController;
