import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://hireiq-bd.onrender.com';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function proxyRequest(request: NextRequest, method: string, path: string[]) {
  const url = `${API_URL}/api/v1/${path.join('/')}`;
  const cookieHeader = request.headers.get('cookie') || '';
  let body = undefined;

  if (method !== 'GET' && method !== 'HEAD') {
    body = await request.text();
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body,
      credentials: 'include',
    });

    // Forward Set-Cookie headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        responseHeaders.append(key, value);
      }
    });

    // Handle 302 redirect (e.g., from Google OAuth callback)
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      if (location) {
        return NextResponse.redirect(location, { status: response.status });
      }
    }

    let data;
    const textData = await response.text();
    try {
      data = JSON.parse(textData);
    } catch {
      return new Response(textData, {
        status: response.status,
        headers: responseHeaders,
      });
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`[Proxy] ${method} error:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, 'GET', path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, 'POST', path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, 'DELETE', path);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, 'PUT', path);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return proxyRequest(request, 'PATCH', path);
}