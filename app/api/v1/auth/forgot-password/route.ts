import { sendMail } from '@/lib/mailer';
import MESSAGES from '@/constants/messages';
import sendResponse from '@/utils/sendResponse';
import httpStatus from 'http-status-lite';
import generateToken from '@/utils/generateToken';
import configuration from '@/configuration/configuration';
import { NextRequest } from 'next/server';
import { ForgotPasswordSchema } from '@/schemas/schemas';
import { getUserDetails } from '@/services/user.service';
import { meSelection } from '@/app/api/v1/auth/me/selection';
import { createToken } from '@/services/token.service';
import { tokenSelection } from '@/app/api/v1/auth/refresh/selection';
import { verifyTurnstileToken } from '@/services/auth.service';
import asyncError from '@/lib/asyncError';

const { FORGET_PASSWORD } = MESSAGES;

const forgotPasswordHandler = async (req: NextRequest) => {
    const body = await req.json();

    // ✅ Validate request body
    const validation = ForgotPasswordSchema.safeParse(body);
    if (!validation.success) {
        return sendResponse(
            httpStatus.BAD_REQUEST,
            FORGET_PASSWORD.VALIDATION_ERROR,
            {},
            validation.error.flatten()
        );
    }

    const { email, cfToken } = validation.data;

    // ✅ Verify Turnstile token
    const isValid = await verifyTurnstileToken(cfToken);
    if (!isValid) {
        return new Response(
            JSON.stringify({ error: 'Robot verification failed.' }),
            { status: 400 }
        );
    }

    const user = await getUserDetails({ email }, meSelection);
    if (!user) {
        return sendResponse(httpStatus.FORBIDDEN, FORGET_PASSWORD.FORBIDDEN);
    }

    const token = await generateToken();
    const expires = new Date(Date.now() + configuration.forgetPassword.expires);

    await createToken(
        {
            token,
            userId: user.id,
            type: 'reset',
            expiresAt: expires,
        },
        tokenSelection
    );

    const resetUrl = `${configuration.app.baseUrl}/reset-password?token=${token}`;

    await sendMail({
        to: email,
        subject: 'Reset your password',
        html: `Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.`,
    });

    return sendResponse(httpStatus.OK, FORGET_PASSWORD.SUCCESS);
};

export const POST = asyncError(forgotPasswordHandler);
