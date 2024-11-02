// src/app/api/health/route.ts

export async function GET() {
    return new Response(JSON.stringify({ message: 'Healthy' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
