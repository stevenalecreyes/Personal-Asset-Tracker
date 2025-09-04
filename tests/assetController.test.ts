    import mongoose from 'mongoose';
    import { v4 } from 'uuid';
    import { Asset } from '../src/models/Asset';
    import {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
    } from '../src/controllers/assetController';
    import { Request, Response } from 'express';
    import dotenv from 'dotenv';

    dotenv.config();

    process.env.NODE_ENV = 'test';

    const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;

    describe('Asset Integration Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;
    let createdAssetId: string;

    beforeAll(async () => {
        if (!TEST_MONGODB_URI) {
        throw new Error("TEST_MONGODB_URI is not defined in environment variables.");
        }
        await mongoose.connect(TEST_MONGODB_URI);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        res = { status: statusMock, json: jsonMock };
        req = { body: {}, params: {} };
    });

    describe('createAsset', () => {
        it('should create and return an asset', async () => {
            req.body = { name: 'Integration Asset', type: 'Bank', value: 1000 };
            await createAsset(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Integration Asset' })
            );

            createdAssetId = (jsonMock.mock.calls[0][0] as any)._id;
        });

        it('should handle errors when asset creation fails', async () => {
        // Simulate Asset constructor throwing error
            const originalAsset = Asset;
            (Asset as any) = function() { throw new Error('Create error'); };
            req.body = { name: 'Error Asset' };
            await createAsset(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Create error' });
            (Asset as any) = originalAsset;
        });
    });

    describe('getAssets', () => {
        it('should return all assets', async () => {
            await getAssets(req as Request, res as Response);

            expect(jsonMock).toHaveBeenCalledWith(
                expect.arrayContaining([
                expect.objectContaining({ name: 'Integration Asset' }),
                ])
            );
        });

        it('should handle errors when fetching assets fails', async () => {
            const originalFind = Asset.find;
            (Asset.find as any) = jest.fn().mockRejectedValue(new Error('Find error'));
            await getAssets(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Find error' });
            (Asset.find as any) = originalFind;
        });
    });

    describe('getAssetById', () => {
        it('should return asset by id', async () => {
            req.params = { id: createdAssetId };
            await getAssetById(req as Request, res as Response);

            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({ _id: createdAssetId })
            );
        });

        it('should return 404 if asset not found', async () => {
            const originalFindById = Asset.findById;
            (Asset.findById as any) = jest.fn().mockResolvedValue(null);
            req.params = { id: 'nonexistentid' };
            await getAssetById(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Asset not found' });
            (Asset.findById as any) = originalFindById;
        });

        it('should handle errors when fetching asset by id fails', async () => {
            const originalFindById = Asset.findById;
            (Asset.findById as any) = jest.fn().mockRejectedValue(new Error('FindById error'));
            req.params = { id: createdAssetId };
            await getAssetById(req as Request, res as Response);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'FindById error' });
            (Asset.findById as any) = originalFindById;
        });
    });

    describe('updateAsset', () => {
        it('should update and return asset', async () => {
            req.params = { id: createdAssetId };
            req.body = { name: 'Updated Asset' };
            await updateAsset(req as Request, res as Response);

            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Updated Asset' })
            );
        });

        it('should return 404 if asset to update is not found', async () => {
            const originalFindByIdAndUpdate = Asset.findByIdAndUpdate;
            (Asset.findByIdAndUpdate as any) = jest.fn().mockResolvedValue(null);
            req.params = { id: 'nonexistentid' };
            req.body = { name: 'Should Not Update' };
            await updateAsset(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Asset not found' });
            (Asset.findByIdAndUpdate as any) = originalFindByIdAndUpdate;
        });

        it('should handle errors when updating asset fails', async () => {
            const originalFindByIdAndUpdate = Asset.findByIdAndUpdate;
            (Asset.findByIdAndUpdate as any) = jest.fn().mockRejectedValue(new Error('Update error'));
            req.params = { id: createdAssetId };
            req.body = { name: 'Should Error' };
            await updateAsset(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Update error' });
            (Asset.findByIdAndUpdate as any) = originalFindByIdAndUpdate;
        });
    });

    describe('deleteAsset', () => {
        it('should delete asset', async () => {
            req.params = { id: createdAssetId };
            await deleteAsset(req as Request, res as Response);

            expect(jsonMock).toHaveBeenCalledWith({ message: 'Asset deleted' });

            const checkDeleted = await Asset.findById(createdAssetId);
            expect(checkDeleted).toBeNull();
        });

        it('should return 404 if asset to delete is not found', async () => {
            const originalFindByIdAndDelete = Asset.findByIdAndDelete;
            (Asset.findByIdAndDelete as any) = jest.fn().mockResolvedValue(null);
            req.params = { id: 'nonexistentid' };
            await deleteAsset(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: 'Asset not found' });
            (Asset.findByIdAndDelete as any) = originalFindByIdAndDelete;
        });

        it('should handle errors when deleting asset fails', async () => {
            const originalFindByIdAndDelete = Asset.findByIdAndDelete;
            (Asset.findByIdAndDelete as any) = jest.fn().mockRejectedValue(new Error('Delete error'));
            req.params = { id: createdAssetId };
            await deleteAsset(req as Request, res as Response);
            
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ error: 'Delete error' });
            (Asset.findByIdAndDelete as any) = originalFindByIdAndDelete;
        });
    });
});
