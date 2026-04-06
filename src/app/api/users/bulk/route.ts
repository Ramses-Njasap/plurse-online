// src/app/api/users/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user.service';

// POST /api/users/bulk - Bulk operations
export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();
        const { action, userIds, reason } = body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json(
                { error: 'userIds array is required' },
                { status: 400 }
            );
        }

        let result;
        let message;

        switch (action) {
            case 'disable':
                if (!reason) {
                    return NextResponse.json(
                        { error: 'Reason is required to disable users' },
                        { status: 400 }
                    );
                }
                result = await userService.bulkDisableUsers(userIds, reason);
                message = `${result} users disabled successfully`;
                break;
            case 'softDelete':
                result = await userService.bulkSoftDelete(userIds);
                message = `${result} users soft deleted successfully`;
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: disable, softDelete' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            message,
            modifiedCount: result
        });
    } catch (error) {
        console.error('Error in bulk operation:', error);
        return NextResponse.json(
            { error: 'Failed to perform bulk operation' },
            { status: 500 }
        );
    }
}