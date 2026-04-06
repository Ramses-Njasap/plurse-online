// src/app/api/users/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user.service';

// DELETE /api/users/cleanup - Permanently delete old soft-deleted users
export const DELETE = async (request: NextRequest) => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const daysOld = parseInt(searchParams.get('daysOld') || '30');

        const deletedCount = await userService.cleanupDeletedUsers(daysOld);

        return NextResponse.json({
            success: true,
            message: `Deleted ${deletedCount} users that were soft-deleted more than ${daysOld} days ago`,
            deletedCount
        });
    } catch (error) {
        console.error('Error cleaning up users:', error);
        return NextResponse.json(
            { error: 'Failed to cleanup users' },
            { status: 500 }
        );
    }
}