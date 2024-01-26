import { PrismaClient, File, Folder } from "@prisma/client";

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
            throw error;
        }
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
        // TODO:  Check if folder has any files, delete files if it does
        return prisma.folder.delete({
            where: {
                id
            }
        });
    }
}