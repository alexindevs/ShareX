import FileRepository from "../models/file.repository";
import logger from "../utils/logging/logger";
import clamscan from "../utils/processing/clamscan";
import shortUUID from "short-uuid";

const fileRepository = new FileRepository();

export default class FileService {
    async addFile (userId: number, name: string, path: string, size: number, type: string, extension: string, metadata: string, link: string) {
        try {
            const fileHash = shortUUID.generate();
            const file = await fileRepository.addFile(userId, name, path, size, type, extension, metadata, link, fileHash);
            return file;
        } catch (error) {
            logger.error("Error adding file: ", error);
            throw error;
        }
    }

    async addFolder (userId: number, name: string, path: string) {
        try {
            const folder = await fileRepository.addFolder(userId, name, path);
            return folder;
        } catch (error) {
            logger.error("Error adding folder: ", error);
            throw error;
        }
    }

    async removeFileFromFolder(folderId: number, fileId: number) {
        try {
            const file = await fileRepository.removeFileFromFolder(folderId, fileId);
            return file;
        } catch (error) {
            logger.error("Error removing file from folder: ", error);
            throw error;
        }
    }

    async addFileToFolder(folderId: number, fileId: number) {
        try {
            const file = await fileRepository.addFileToFolder(folderId, fileId);
            return file;
        } catch (error) {
            logger.error("Error adding file to folder: ", error);
            throw error;
        }
    }

    async getFilesByUser(userId: number) {
        try {
            const files = await fileRepository.getFilesByUser(userId);
            return files;
        } catch (error) {
            logger.error("Error getting files by user: ", error);
            throw error;
        }
    }

    async getShareableLinkForFile(id: number) {
        try {
            const file = await fileRepository.getFileById(id);
            if (!file) {
                throw new Error("File not found");
            }
            const link = process.env.FRONTEND_URL + '/file/' + file.hash;
            return link;
        } catch (error) {
            logger.error("Error getting shareable link for file: ", error);
            throw error;
        }
    }

    async getFileByHash (hash: string) {
        try {
            const file = await fileRepository.getFileByHash(hash);
            return file;
        } catch (error) {
            logger.error("Error getting file by hash: ", error);
            throw error;
        }
    }

    async getFilesInFolder(userId: number, folderId: number) {
        try {
            const files = await fileRepository.getFilesInFolder(userId, folderId);
            return files;
        } catch (error) {
            logger.error("Error getting files in folder: ", error);
            throw error;
        }
    }

    async getFileMetadata(id: number) {
        try {
            const file = await fileRepository.getFileMetadata(id);
            return file;
        } catch (error) {
            logger.error("Error getting file metadata: ", error);
            throw error;
        }
    }

    async getFolderAndFiles(id: number) {
        try {
            const folderAndFiles = await fileRepository.getFolderAndFiles(id);
            return folderAndFiles;
        } catch (error) {
            logger.error("Error getting folder and files: ", error);
            throw error;
        }
    }

    async deleteFile(id: number) {
        try {
            const file = await fileRepository.deleteFile(id);
            return file;
        } catch (error) {
            logger.error("Error deleting file: ", error);
            throw error;
        }
    }

    async deleteFolder(id: number) {
        try {
            const folder = await fileRepository.deleteFolder(id);
            return folder;
        } catch (error) {
            logger.error("Error deleting folder: ", error);
            throw error;
        }
    }

    async scanFileForVirus(filePath: string): Promise<boolean> {
        try {
            const result = await (await clamscan).scanFile(filePath);
            console.log(result);
            return result.isInfected;
        } catch (error) {
            logger.error('Error scanning file for virus: ', error);
            throw error;
        }
    }

    async addFileWithVirusScan(
        userId: number,
        name: string,
        path: string,
        size: number,
        type: string,
        extension: string,
        metadata: string,
        link: string,
    ) {
        try {
            const isSafe = await this.scanFileForVirus(path);

            if (!isSafe) {
                throw new Error('File contains a virus and cannot be added.');
            }
            const fileHash = shortUUID.generate();
            const file = await fileRepository.addFile(
                userId,
                name,
                path,
                size,
                type,
                extension,
                metadata,
                link,
                fileHash
            );

            return file;
        } catch (error) {
            logger.error('Error adding file with virus scan: ', error);
            throw error;
        }
    }
}