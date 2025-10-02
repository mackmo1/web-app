import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  UpdateUserRequest, 
  ApiResponse, 
  UserResponse 
} from '@/lib/types/user';
import { 
  formatUserResponse, 
  isValidEmail, 
  isValidMobile, 
  isValidUserType,
  hashPassword 
} from '@/lib/utils/user';

// GET /api/users/[id] - Fetch a single user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Validate ID format
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: {
        id: BigInt(userId)
      }
    });

    if (!user) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const formattedUser = formatUserResponse(user);

    return NextResponse.json<ApiResponse<UserResponse>>({
      success: true,
      data: formattedUser
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body: UpdateUserRequest = await request.json();

    // Validate ID format
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: BigInt(userId)
      }
    });

    if (!existingUser) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Validate user type if provided
    if (body.type && !isValidUserType(body.type)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid user type. Must be one of: buyer, agent, builder'
      }, { status: 400 });
    }

    // Validate email if provided
    if (body.email_id && !isValidEmail(body.email_id)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Validate mobile if provided
    if (body.mobile && !isValidMobile(body.mobile)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid mobile number format'
      }, { status: 400 });
    }

    // Check if email or mobile already exists (excluding current user)
    if (body.email_id || body.mobile) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          AND: [
            {
              id: {
                not: BigInt(userId)
              }
            },
            {
              OR: [
                body.email_id ? { email_id: body.email_id } : {},
                body.mobile ? { mobile: body.mobile } : {}
              ].filter(condition => Object.keys(condition).length > 0)
            }
          ]
        }
      });

      if (duplicateUser) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Another user with this email or mobile number already exists'
        }, { status: 409 });
      }
    }

    // Prepare update data
    const updateData: Partial<UpdateUserRequest & { password?: string }> = {};
    
    if (body.email_id !== undefined) updateData.email_id = body.email_id;
    if (body.mobile !== undefined) updateData.mobile = body.mobile;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.profession !== undefined) updateData.profession = body.profession;
    if (body.verified !== undefined) updateData.verified = body.verified;
    if (body.role !== undefined) updateData.role = body.role;

    // Hash password if provided
    if (body.password) {
      updateData.password = await hashPassword(body.password);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: BigInt(userId)
      },
      data: updateData
    });

    const formattedUser = formatUserResponse(updatedUser);

    return NextResponse.json<ApiResponse<UserResponse>>({
      success: true,
      data: formattedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Validate ID format
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid user ID'
      }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: BigInt(userId)
      }
    });

    if (!existingUser) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id: BigInt(userId)
      }
    });

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
