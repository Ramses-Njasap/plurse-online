// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user.service';

// GET /api/users/:id - Get a single user
export const GET = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const includeDeleted = searchParams.get('includeDeleted') === 'true';

        const user = await userService.findById(params.id, includeDeleted);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

// PUT /api/users/:id - Update a user
export const PUT = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        const body = await request.json();

        const updated = await userService.update(params.id, body);

        if (!updated) {
            return NextResponse.json(
                { error: 'User not found or no changes made' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'User updated successfully' });
    } catch (error: any) {
        console.error('Error updating user:', error);

        if (error.message === 'Cannot update a deleted user') {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        if (error.message === 'Cannot update a disabled user') {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// DELETE /api/users/:id - Soft delete or hard delete
export const DELETE = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const permanent = searchParams.get('permanent') === 'true';

        let deleted;
        if (permanent) {
            deleted = await userService.hardDelete(params.id);
        } else {
            deleted = await userService.softDelete(params.id);
        }

        if (!deleted) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const message = permanent ? 'User permanently deleted' : 'User soft deleted successfully';
        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}