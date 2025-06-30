import { conformZodMessage } from '@conform-to/zod';
import { z } from 'zod';
export const onboardingSchema = z.object({
    fullName: z.string().min(2).max(150),
    userName: z.string().min(3).max(80).regex(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username can only contain letters, numbers, underscores, and hyphens',
    }),
});

export function onboardingSchemaValidation(options?:{
    isUsernameUnique: ()=> Promise<boolean>;
}) {
    return z.object({
         userName: z.string().min(3).max(80).regex(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username can only contain letters, numbers, underscores, and hyphens',
    }).pipe(
        z.string().superRefine((_, ctx) => {
            if(typeof options?.isUsernameUnique !== 'function') {
                ctx.addIssue({
                    code: "custom",
                    message: conformZodMessage.VALIDATION_UNDEFINED,
                    fatal: true,
                });
                return;
            }
            return options.isUsernameUnique().then((isUnique) => {
                if (!isUnique) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Username is already taken",
                    });
                }
            });
        })
    ),
    fullName: z.string().min(2).max(150),

    });
}

export const settingsSchema = z.object({
    fullName: z.string().min(2).max(150),
    profileImage: z.string(),
});


export const eventTypeSchema = z.object({
    title: z.string().min(2).max(100),
    duration: z.number().min(15).max(60),
    url: z.string().min(3).max(100).regex(/^[a-zA-Z0-9_-]+$/, {
        message: 'URL Slug can only contain letters, numbers, underscores, and hyphens',
    }),
    description: z.string().max(500),
    videoCallSoftware: z.string().min(3),
    // videoCallProvider: z.enum(["Zoom Meeting", "Google Meet", "Microsoft Teams"]),
})
