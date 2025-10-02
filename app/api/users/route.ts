import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  CreateUserRequest, 
  ApiResponse, 
  UserResponse, 
  UsersListResponse,
  UserQueryParams 
} from '@/lib/types/user';
import { 
  formatUserResponse, 
  isValidEmail, 
  isValidMobile, 
  isValidUserType,
  hashPassword,
  buildUserWhereClause 
} from '@/lib/utils/user';

// GET /api/users - Fetch all users with optional filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || undefined;
    const city = searchParams.get('city') || undefined;
    const verified = searchParams.get('verified') ? searchParams.get('verified') === 'true' : undefined;
    const role = searchParams.get('role') || undefined;
    const search = searchParams.get('search') || undefined;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.'
      }, { status: 400 });
    }

    // Build where clause for filtering
    const where = buildUserWhereClause({ type, city, verified, role, search });

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          created_at: 'desc'
        }
      }),
      prisma.user.count({ where })
    ]);

    // Format response
    const formattedUsers = users.map(formatUserResponse);
    const totalPages = Math.ceil(total / limit);

    const response: UsersListResponse = {
      users: formattedUsers,
      total,
      page,
      limit,
      totalPages
    };

    return NextResponse.json<ApiResponse<UsersListResponse>>({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();

    // Validate required fields
    if (!body.type) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'User type is required'
      }, { status: 400 });
    }

    // Validate user type
    if (!isValidUserType(body.type)) {
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

    // Check if email or mobile already exists
    if (body.email_id || body.mobile) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            body.email_id ? { email_id: body.email_id } : {},
            body.mobile ? { mobile: body.mobile } : {}
          ].filter(condition => Object.keys(condition).length > 0)
        }
      });

      if (existingUser) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'User with this email or mobile number already exists'
        }, { status: 409 });
      }
    }

    // Hash password if provided
    let hashedPassword = body.password;
    if (body.password) {
      hashedPassword = await hashPassword(body.password);
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email_id: body.email_id,
        mobile: body.mobile,
        type: body.type,
        name: body.name,
        city: body.city,
        profession: body.profession,
        verified: body.verified || false,
        password: hashedPassword,
        role: body.role || 'user'
      }
    });

    const formattedUser = formatUserResponse(newUser);

    return NextResponse.json<ApiResponse<UserResponse>>({
      success: true,
      data: formattedUser,
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
