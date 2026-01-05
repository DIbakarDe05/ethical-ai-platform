/**
 * Input Validation Schemas
 * 
 * Zod-based validation for API inputs.
 * Provides type-safe validation with helpful error messages.
 */

import { z } from 'zod';

/**
 * Chat Message Validation
 */
export const chatMessageSchema = z.object({
    message: z
        .string()
        .min(1, 'Message cannot be empty')
        .max(4000, 'Message too long (max 4000 characters)')
        .refine(
            (val) => !containsInjectionPatterns(val),
            'Message contains prohibited patterns'
        ),
    conversationHistory: z
        .array(
            z.object({
                role: z.enum(['user', 'assistant']),
                content: z.string().max(4000),
            })
        )
        .max(50, 'Conversation history too long')
        .optional()
        .default([]),
    documents: z
        .array(
            z.object({
                title: z.string().max(200),
                content: z.string().max(50000),
            })
        )
        .max(10)
        .optional()
        .default([]),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

/**
 * Document Upload Validation
 */
export const documentUploadSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title too long (max 200 characters)')
        .regex(/^[\w\s\-.,!?()]+$/, 'Title contains invalid characters'),
    description: z
        .string()
        .max(1000, 'Description too long (max 1000 characters)')
        .optional()
        .default(''),
    category: z.enum(
        ['adoption', 'foster-care', 'volunteers', 'donors', 'policies', 'general'],
        { message: 'Invalid category' }
    ),
    tags: z
        .array(
            z.string().max(50, 'Tag too long')
        )
        .max(10, 'Too many tags (max 10)')
        .optional()
        .default([]),
    content: z
        .string()
        .max(100000, 'Content too large')
        .optional(),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;

/**
 * Search Query Validation
 */
export const searchQuerySchema = z.object({
    query: z
        .string()
        .min(1, 'Search query is required')
        .max(500, 'Query too long (max 500 characters)')
        .refine(
            (val) => !containsInjectionPatterns(val),
            'Query contains prohibited patterns'
        ),
    filters: z
        .object({
            category: z.string().optional(),
            status: z.enum(['approved', 'pending', 'all']).optional(),
            dateFrom: z.string().optional(),
            dateTo: z.string().optional(),
        })
        .optional()
        .default({}),
    limit: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .default(10),
    offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;

/**
 * Document ID Validation
 */
export const documentIdSchema = z.object({
    id: z
        .string()
        .min(1, 'Document ID is required')
        .max(100, 'Invalid document ID')
        .regex(/^[\w\-]+$/, 'Invalid document ID format'),
});

/**
 * Feedback Validation
 */
export const feedbackSchema = z.object({
    type: z.enum(['bug', 'feature', 'general', 'content']),
    message: z
        .string()
        .min(10, 'Feedback too short')
        .max(2000, 'Feedback too long (max 2000 characters)'),
    rating: z
        .number()
        .int()
        .min(1)
        .max(5)
        .optional(),
    metadata: z
        .object({
            page: z.string().optional(),
            userAgent: z.string().optional(),
        })
        .optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

/**
 * Check for common injection patterns
 */
function containsInjectionPatterns(input: string): boolean {
    const patterns = [
        // Script injection
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        // Event handlers
        /\bon\w+\s*=/gi,
        // JavaScript protocol
        /javascript:/gi,
        // Data URLs with scripts
        /data:text\/html/gi,
        // SQL-like patterns (basic)
        /(\b(select|insert|update|delete|drop|union|exec)\b.*\b(from|into|where|table)\b)/gi,
    ];

    return patterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitize string for safe display
 */
export function sanitizeString(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validate and parse input with type safety
 */
export function validateInput<T>(
    schema: z.Schema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: string } {
    try {
        const result = schema.safeParse(data);
        if (result.success) {
            return { success: true, data: result.data };
        }

        // Format error messages (Zod v4 uses 'issues' property)
        const issues = result.error.issues || [];
        const errorMessages = issues
            .map((issue) =>
                `${issue.path.map(String).join('.')}: ${issue.message}`
            )
            .join('; ');

        return { success: false, error: errorMessages || 'Validation failed' };
    } catch (error) {
        return { success: false, error: 'Validation failed' };
    }
}
