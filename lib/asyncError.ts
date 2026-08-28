import httpStatusLite from 'http-status-lite';
import { NextRequest, NextResponse } from 'next/server';
import sendResponse from '@/utils/sendResponse';
import MESSAGES from '@/constants/messages';
import { rateLimitMiddleware } from '@/middleware/rate-limit';

const RATE_LIMIT_HEADERS = [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'Retry-After',
];

type Handler<T = any> = (
    req: NextRequest,
    context: T
) => Promise<NextResponse | Response>;

const asyncError = <T = any>(handler: Handler<T>) => {
    return async function (
        req: NextRequest,
        context: T
    ): Promise<NextResponse | Response> {
        try {
            const rateLimitResponse = await rateLimitMiddleware(req);
            if (
                rateLimitResponse?.status === httpStatusLite.TOO_MANY_REQUESTS
            ) {
                return rateLimitResponse;
            }

            const response = await handler(req, context);
            if (rateLimitResponse) {
                for (const header of RATE_LIMIT_HEADERS) {
                    const value = rateLimitResponse.headers.get(header);
                    if (value) {
                        response.headers.set(header, value);
                    }
                }
            }

            return response;
        } catch (err) {
            console.error('Unhandled error:', err);
            return sendResponse(
                httpStatusLite.INTERNAL_SERVER_ERROR,
                MESSAGES.COMMON.INTERNAL_SERVER_ERROR
            );
        }
    };
};

export default asyncError;
