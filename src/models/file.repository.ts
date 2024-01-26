import { PrismaClient, File, Folder } from "@prisma/client";
import logger from "../utils/logging/logger";

const prisma = new PrismaClient();

export default class FileRepository {
    async addFile(userId: number, name: string, path: string, size: number, type: string, extension: string, metadata: string, hash: string) {
        try {
            const file = await prisma.file.create({
                data: {
                    userId,
                    name,
                    path,
                    sizeInMb: size,
                    type,
                    extension,
                    metadata,
                    hash
                }
            });
            return file;
        } catch (error) {
            logger.error("Error adding file: ", error);
            throw error;
        }
    }

    async getFileMetadata(id: number) {
        return prisma.file.findUnique({
            where: {
                id
            }
        });
    }

    async getFilesByUser(userId: number) {
        return prisma.file.findMany({
            where: {
                userId
            }
        });
    }

    async getFilesInFolder(userId: number, folderId: number) {
        return prisma.file.findMany({
            where: {
                userId,
                folderId
            }
        });
    }

    async addFolder(userId: number, name: string, path: string) {
        try {
            const folder = await prisma.folder.create({
                data: {
                    userId,
                    name,
                    path
                }
            });
            return folder;
        } catch (error) {
            throw error;
        }
    }

    async removeFileFromFolder(folderId: number, fileId: number) {
        try {
            const file = await prisma.file.update({
                where: {
                    id: fileId
                },
                data: {
                    folderId: null
                }
            });
            return file;
        } catch (error) {
            logger.error("Error removing file from folder: ", error);
            throw error;
        }
    }

    async addFileToFolder(folderId: number, fileId: number) {
        return prisma.folder.update({
            where: {
                id: folderId
            },
            data: {
                files: {
                    connect: {
                        id: fileId
                    }
                }
            }
        });
    }

    async getFoldersByUserId(userId: number) {
        return prisma.folder.findMany({
            where: {
                userId
            }
        });
    }

    async deleteFile(id: number) {
        return prisma.file.delete({
            where: {
                id
            }
        });
    }

    async deleteFolder (id: number) {
        const filesInFolder = await prisma.file.findMany({
            where: {
                folderId: id
            }
        })
        if (filesInFolder.length > 0) {
            return prisma.file.deleteMany({
                where: {
                    folderId: id
                }
            });
        }
        return prisma.folder.delete({
            where: {
                id
            }
        });
    }

    /**
     * Asynchronously retrieves a folder and its associated files by ID.
     *
     * @param {number} id - The ID of the folder to retrieve.
     * @return {Promise<Folder>} The folder and its associated files.
     */
    async getFolderAndFiles(id: number) {
        return prisma.folder.findUnique({
            where: {
                id
            },
            include: {
                files: true
            }
        });
    }
}