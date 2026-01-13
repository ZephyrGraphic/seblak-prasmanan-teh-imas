import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ==================== GET - Get Store Settings ====================
export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' }
    });
    
    // Create default settings if not exist
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 'default',
          isOpen: true,
          soundNotification: true,
          ttsNotification: false,
          whatsappNumber: '6281234567890',
          danaNumber: '081234567890',
          danaAccountName: 'TEH IMAS'
        }
      });
    }
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// ==================== PATCH - Update Store Settings ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      isOpen, 
      soundNotification, 
      ttsNotification,
      whatsappNumber,
      danaNumber,
      danaAccountName
    } = body;
    
    // Build update data
    const updateData: {
      isOpen?: boolean;
      soundNotification?: boolean;
      ttsNotification?: boolean;
      whatsappNumber?: string;
      danaNumber?: string;
      danaAccountName?: string;
    } = {};
    
    if (isOpen !== undefined) updateData.isOpen = isOpen;
    if (soundNotification !== undefined) updateData.soundNotification = soundNotification;
    if (ttsNotification !== undefined) updateData.ttsNotification = ttsNotification;
    if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;
    if (danaNumber !== undefined) updateData.danaNumber = danaNumber;
    if (danaAccountName !== undefined) updateData.danaAccountName = danaAccountName;
    
    const settings = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        isOpen: isOpen ?? true,
        soundNotification: soundNotification ?? true,
        ttsNotification: ttsNotification ?? false,
        whatsappNumber: whatsappNumber ?? '6281234567890',
        danaNumber: danaNumber ?? '081234567890',
        danaAccountName: danaAccountName ?? 'TEH IMAS'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: settings,
      message: 'Settings updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
