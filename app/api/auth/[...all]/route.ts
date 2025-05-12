import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { ArcjetDecision, slidingWindow, validateEmail } from "arcjet";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";


function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return '0.0.0.0'; 
}

// Email Validation -> BLOCK
const emailValidation = aj.withRule(
  validateEmail({ mode: 'LIVE', block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'] })
);

// Rate Limit
const rateLimit = aj.withRule(
  slidingWindow({
    mode: 'LIVE',
    interval: '2m',
    max: 2,
    characteristics: ['fingerprint']
  })
);

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const session = await auth.api.getSession({ headers: req.headers });

  let userId: string;

  if (session?.user?.id) {
    userId = session.user.id;
  } else {
    userId = getClientIp(req);
  }

  if (req.nextUrl.pathname.startsWith('/api/auth/sign-in')) {
    const body = await req.clone().json();

    if (typeof body.email === 'string') {
      return emailValidation.protect(req, { email: body.email });
    }
  }

  return rateLimit.protect(req, { fingerprint: userId });
}

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

export const POST = async (req: NextRequest) => {
  const decision = await protectedAuth(req);

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      throw new Error('Email is Incorrect');
    }

    if (decision.reason.isRateLimit()) {
      throw new Error('Rate Limit is Exceeded');
    }

    if (decision.reason.isShield()) {
      throw new Error('Shield turned on, protected against malicious actions');
    }
  }

  return authHandlers.POST(req);
};
