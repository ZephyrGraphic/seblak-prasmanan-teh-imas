import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// ==================== GET - Check Auth Session ====================
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session');
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }
    
    // In production, validate session from store
    // For now, just check if cookie exists
    return NextResponse.json({ 
      success: true, 
      authenticated: true
    });
    
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { success: false, error: 'Session check failed' },
      { status: 500 }
    );
  }
}
