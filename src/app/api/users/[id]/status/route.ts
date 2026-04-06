// src/app/api/users/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user.service';

// GET /api/users/:id/status - Get user status
export const GET = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        const status = await userService.getUserStatus(params.id);

        if (!status) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(status);
    } catch (error) {
        console.error('Error fetching user status:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user status' },
            { status: 500 }
        );
    }
}

// POST /api/users/:id/status/disable - Disable a user
export const POST = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        const body = await request.json();
        const action = request.nextUrl.searchParams.get('action');

        let result;

        switch (action) {
            case 'disable':
                if (!body.reason) {
                    return NextResponse.json(
                        { error: 'Reason is required to disable user' },
                        { status: 400 }
                    );
                }
                result = await userService.disableUser(params.id, body.reason);
                break;
            case 'enable':
                result = await userService.enableUser(params.id);
                break;
            case 'deactivate':
                result = await userService.deactivateUser(params.id);
                break;
            case 'activate':
                result = await userService.activateUser(params.id);
                break;
            case 'restore':
                result = await userService.restore(params.id);
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use: disable, enable, deactivate, activate, or restore' },
                    { status: 400 }
                );
        }

        if (!result) {
            return NextResponse.json(
                { error: 'User not found or operation failed' },
                { status: 404 }
            );
        }

        const messages = {
            disable: 'User disabled successfully',
            enable: 'User enabled successfully',
            deactivate: 'User deactivated successfully',
            activate: 'User activated successfully',
            restore: 'User restored successfully'
        };

        return NextResponse.json({
            success: true,
            message: messages[action as keyof typeof messages]
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        return NextResponse.json(
            { error: 'Failed to update user status' },
            { status: 500 }
        );
    }
}