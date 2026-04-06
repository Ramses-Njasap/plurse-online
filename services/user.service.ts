// services/user.service.ts
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/db';
import { User, CreateUserDTO, UpdateUserDTO, DisableUserDTO, UserStatus } from '@/types/user.type';

export class UserService {
    private collectionName = 'users';

    // Create a new user (always active by default)
    create = async (userData: CreateUserDTO): Promise<User> => {
        const { db } = await connectToDatabase();

        // Check if user already exists (including soft-deleted)
        const existingUser = await db.collection<User>(this.collectionName).findOne({
            email: userData.email,
            isDeleted: { $ne: true }  // Don't check soft-deleted users
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const now = new Date();
        const newUser: User = {
            ...userData,
            role: userData.role || 'user',
            isActive: true,
            isDisabled: false,
            isDeleted: false,
            emailVerified: false,
            createdAt: now,
            updatedAt: now,
        };

        const result = await db.collection<User>(this.collectionName).insertOne(newUser);

        // Remove password from response
        const { password, ...userWithoutPassword } = newUser;
        return { ...userWithoutPassword, _id: result.insertedId } as User;
    }

    // Find active users only (not disabled, not deleted, active)
    findActiveUsers = async (limit: number = 10, skip: number = 0): Promise<User[]> => {
        const { db } = await connectToDatabase();

        return await db.collection<User>(this.collectionName)
            .find({
                isActive: true,
                isDisabled: false,
                isDeleted: false
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    // Find user by ID (excluding soft-deleted by default)
    findById = async (id: string, includeDeleted: boolean = false): Promise<User | null> => {
        const { db } = await connectToDatabase();

        const filter: any = { _id: new ObjectId(id) };

        if (!includeDeleted) {
            filter.isDeleted = { $ne: true };
        }

        return await db.collection<User>(this.collectionName).findOne(filter);
    }

    // Find user by email (excluding soft-deleted by default)
    findByEmail = async (email: string, includeDeleted: boolean = false): Promise<User | null> => {
        const { db } = await connectToDatabase();

        const filter: any = { email };

        if (!includeDeleted) {
            filter.isDeleted = { $ne: true };
        }

        return await db.collection<User>(this.collectionName).findOne(filter);
    }

    // Get user status
    getUserStatus = async (id: string): Promise<UserStatus | null> => {
        const user = await this.findById(id, true);

        if (!user) return null;

        let status: UserStatus['status'] = 'active';
        if (user.isDeleted) status = 'deleted';
        else if (user.isDisabled) status = 'disabled';
        else if (!user.isActive) status = 'inactive';

        return {
            isActive: user.isActive,
            isDisabled: user.isDisabled,
            isDeleted: user.isDeleted,
            status
        };
    }

    // Soft delete a user
    softDelete = async (id: string): Promise<boolean> => {
        const { db } = await connectToDatabase();

        const result = await db.collection<User>(this.collectionName).updateOne(
            { _id: new ObjectId(id), isDeleted: { $ne: true } },
            {
                $set: {
                    isDeleted: true,
                    isActive: false,
                    deletedAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    }

    // Hard delete a user (permanently remove)
    hardDelete = async (id: string): Promise<boolean> => {
        const { db } = await connectToDatabase();

        const result = await db.collection<User>(this.collectionName).deleteOne({
            _id: new ObjectId(id)
        });

        return result.deletedCount > 0;
    }

    // Restore a soft-deleted user
    restore = async (id: string): Promise<boolean> => {
        const { db } = await connectToDatabase();

        const result = await db.collection<User>(this.collectionName).updateOne(
            { _id: new ObjectId(id), isDeleted: true },
            {
                $set: {
                    isDeleted: false,
                    isActive: true,
                    deletedAt: null,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    }

    // Disable a user (temporary)
    disableUser = async (id: string, reason: string): Promise<boolean> => {
        const { db } = await connectToDatabase();

        const result = await db.collection<User>(this.collectionName).updateOne(
            { _id: new ObjectId(id), isDeleted: { $ne: true } },
            {
                $set: {
                    isDisabled: true,
                    isActive: false,
                    disabledAt: new Date(),
                    disabledReason: reason,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    }

    // Enable a disabled user
    enableUser = async (id: string): Promise<boolean> => {
        const { db } = await connectToDatabase();

        const result = await db.collection<User>(this.collectionName).updateOne(
            { _id: new ObjectId(id), isDeleted: { $ne: true } },
            {
                $set: {
                    isDisabled: false,
                    isActive: true,
                    disabledAt: null,
                    disabledReason: null,
                    reactivatedAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    }

    // Deactivate a user (set inactive without disabling)
    deactivateUser = async (id: string): Promise<boolean> => {
        const { db } = await connectToDatabase();

        const result = await db.collection<User>(this.collectionName).updateOne(
            { _id: new ObjectId(id), isDeleted: { $ne: true } },
            {
                $set: {
                    isActive: false,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    }

    // Activate a user
    activateUser = async (id: string): Promise<boolean> => {
        const { db } = await connectToDatabase();

        const result = await db.collection<User>(this.collectionName).updateOne(
            { _id: new ObjectId(id), isDeleted: { $ne: true }, isDisabled: { $ne: true } },
            {
                $set: {
                    isActive: true,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    }

    // Update user information
    update = async (id: string, updates: UpdateUserDTO): Promise<boolean> => {
        const { db } = await connectToDatabase();

        // Don't allow updates to deleted or disabled users
        const user = await this.findById(id);
        if (!user) return false;
        if (user.isDeleted) throw new Error('Cannot update a deleted user');
        if (user.isDisabled) throw new Error('Cannot update a disabled user');

        const result = await db.collection<User>(this.collectionName).updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    }

    // Get all deleted users (for admin review)
    getDeletedUsers = async (limit: number = 50): Promise<User[]> => {
        const { db } = await connectToDatabase();

        return await db.collection<User>(this.collectionName)
            .find({ isDeleted: true })
            .sort({ deletedAt: -1 })
            .limit(limit)
            .toArray();
    }

    // Get all disabled users
    getDisabledUsers = async (limit: number = 50): Promise<User[]> => {
        const { db } = await connectToDatabase();

        return await db.collection<User>(this.collectionName)
            .find({ isDisabled: true, isDeleted: false })
            .sort({ disabledAt: -1 })
            .limit(limit)
            .toArray();
    }

    // Get inactive users (not disabled or deleted, just inactive)
    getInactiveUsers = async (limit: number = 50): Promise<User[]> => {
        const { db } = await connectToDatabase();

        return await db.collection<User>(this.collectionName)
            .find({
                isActive: false,
                isDisabled: false,
                isDeleted: false
            })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .toArray();
    }

    // Bulk operation: Disable multiple users
    bulkDisableUsers = async (userIds: string[], reason: string): Promise<number> => {
        const { db } = await connectToDatabase();
        const objectIds = userIds.map(id => new ObjectId(id));

        const result = await db.collection<User>(this.collectionName).updateMany(
            { _id: { $in: objectIds }, isDeleted: { $ne: true } },
            {
                $set: {
                    isDisabled: true,
                    isActive: false,
                    disabledAt: new Date(),
                    disabledReason: reason,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount;
    }

    // Bulk operation: Soft delete multiple users
    bulkSoftDelete = async (userIds: string[]): Promise<number> => {
        const { db } = await connectToDatabase();
        const objectIds = userIds.map(id => new ObjectId(id));

        const result = await db.collection<User>(this.collectionName).updateMany(
            { _id: { $in: objectIds }, isDeleted: { $ne: true } },
            {
                $set: {
                    isDeleted: true,
                    isActive: false,
                    deletedAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount;
    }

    // Permanently delete all soft-deleted users older than X days
    cleanupDeletedUsers = async (daysOld: number = 30): Promise<number> => {
        const { db } = await connectToDatabase();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await db.collection<User>(this.collectionName).deleteMany({
            isDeleted: true,
            deletedAt: { $lt: cutoffDate }
        });

        return result.deletedCount;
    }
}

export const userService = new UserService();