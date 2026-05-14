import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://hireiq-bd.onrender.com';

// Disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = `${API_URL}/api/v1/${path.join('/')}`;
  const cookieHeader = request.headers.get('cookie') || '';

  // Handle Google OAuth redirect
  if (path[0] === 'auth' && path[1] === 'google' && !path.includes('callback')) {
    return NextResponse.redirect(url, 302);
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        responseHeaders.append(key, value);
      }
    });

    // Handle redirect from Google callback
    if (response.status === 302 || response.headers.get('location')) {
      const location = response.headers.get('location');
      if (location) {
        return NextResponse.redirect(location, { status: 302 });
      }
    }

    let data;
    const textData = await response.text();
    try {
      data = JSON.parse(textData);
    } catch {
      data = textData;
    }

    return NextResponse.json(data, { 
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Proxy GET] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = `${API_URL}/api/v1/${path.join('/')}`;
  const cookieHeader = request.headers.get('cookie') || '';
  const body = await request.json();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        responseHeaders.append(key, value);
      }
    });

    let data;
    const textData = await response.text();
    try {
      data = JSON.parse(textData);
    } catch {
      data = textData;
    }

    return NextResponse.json(data, { 
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Proxy POST] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = `${API_URL}/api/v1/${path.join('/')}`;
  const cookieHeader = request.headers.get('cookie') || '';

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        responseHeaders.append(key, value);
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { 
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Proxy DELETE] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}