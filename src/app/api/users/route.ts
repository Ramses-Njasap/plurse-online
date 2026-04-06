// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/user.service';

// GET /api/users - Get all active users
export const GET = async (request: NextRequest) => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = parseInt(searchParams.get('skip') || '0');
        const status = searchParams.get('status'); // active, deleted, disabled, inactive

        let users;

        switch (status) {
            case 'deleted':
                users = await userService.getDeletedUsers(limit);
                break;
            case 'disabled':
                users = await userService.getDisabledUsers(limit);
                break;
            case 'inactive':
                users = await userService.getInactiveUsers(limit);
                break;
            default:
                users = await userService.findActiveUsers(limit, skip);
        }

        // Remove passwords from response
        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return NextResponse.json(usersWithoutPassword);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// POST /api/users - Create a new user
export const POST = async (request: NextRequest) => {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.email || !body.password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        const user = await userService.create(body);

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error: any) {
        console.error('Error creating user:', error);

        if (error.message === 'User with this email already exists') {
            return NextResponse.json(
                { error: error.message },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}