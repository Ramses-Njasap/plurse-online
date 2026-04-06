// types/index.ts
import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'moderator';
    
    // Status fields
    isActive: boolean;      // Can user log in and use the system?
    isDisabled: boolean;    // Temporarily disabled (e.g., violation, investigation)
    isDeleted: boolean;     // Soft delete flag
    deletedAt?: Date | null;       // When was the user soft deleted
    
    // Metadata
    emailVerified: boolean;
    lastLoginAt?: Date | null;
    disabledAt?: Date | null;
    disabledReason?: string | null;
    reactivatedAt?: Date | null;
    
    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin' | 'moderator';
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    role?: 'user' | 'admin' | 'moderator';
    isActive?: boolean;
}

export interface DisableUserDTO {
    reason: string;
}

export interface UserStatus {
    isActive: boolean;
    isDisabled: boolean;
    isDeleted: boolean;
    status: 'active' | 'disabled' | 'deleted' | 'inactive';
}