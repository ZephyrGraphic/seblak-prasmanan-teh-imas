import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// ==================== POST - Logout ====================
export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Delete session cookie
    cookieStore.delete('admin_session');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
