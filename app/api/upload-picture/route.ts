import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const userid = searchParams.get('userid');

    if (!userid) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
      });
    }

    if (!filename) {
      return new Response(JSON.stringify({ error: 'Filename is required' }), {
        status: 400,
      });
    }
    if (!request.body) {
      return new Response(JSON.stringify({ error: 'File is required' }), {
        status: 400,
      });
    }

    const blob = await put(`${userid}/news/${filename}`, request.body, {
      access: 'public',
    });

    return new Response(JSON.stringify(blob), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    process.env.NODE_ENV === 'development' &&
      console.error('Error uploading picture:', error);
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
    });
  }
}
