import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, subject, category, message } = data;
    // Here you could send an email, save to DB, etc.
    console.log('Contact form submission:', { name, email, subject, category, message });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to process message.' }, { status: 500 });
  }
} 