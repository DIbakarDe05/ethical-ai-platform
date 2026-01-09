/**
 * Documents API Route
 * 
 * Handles document CRUD operations for the knowledge base.
 * 
 * SECURITY FEATURES:
 * - Authentication required for all operations
 * - Admin role required for create/delete
 * - Rate limiting (10 requests per minute for writes)
 * - Input validation with Zod
 * - CORS protection
 * - Safe error responses
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  requireAuth,
  checkRateLimit,
  getClientIdentifier,
  rateLimitResponse,
  errorResponse,
  forbiddenResponse,
  isAdminUser,
  RATE_LIMITS,
  withCors,
  corsPreflightResponse,
  logRequest,
} from '@/lib/api/auth';
import { documentUploadSchema, documentIdSchema, validateInput } from '@/lib/validation';

// Demo documents for development
const demoDocuments = [
  {
    id: '1',
    title: 'Adoption Guidelines 2024',
    description: 'Comprehensive guide to the adoption process, requirements, and timelines.',
    category: 'adoption',
    status: 'approved',
    uploadedBy: 'admin@example.com',
    uploadedAt: new Date('2024-01-15').toISOString(),
    lastUpdated: new Date('2024-06-20').toISOString(),
    fileSize: 2500000,
    fileType: 'application/pdf',
    downloadCount: 245,
    tags: ['adoption', 'requirements', 'process', 'legal'],
  },
  {
    id: '2',
    title: 'Volunteer Handbook',
    description: 'Everything volunteers need to know about our programs and policies.',
    category: 'volunteers',
    status: 'approved',
    uploadedBy: 'admin@example.com',
    uploadedAt: new Date('2024-02-10').toISOString(),
    lastUpdated: new Date('2024-05-15').toISOString(),
    fileSize: 1800000,
    fileType: 'application/pdf',
    downloadCount: 189,
    tags: ['volunteer', 'training', 'policies'],
  },
  {
    id: '3',
    title: 'Foster Care FAQ',
    description: 'Frequently asked questions about becoming a foster parent.',
    category: 'foster-care',
    status: 'approved',
    uploadedBy: 'staff@example.com',
    uploadedAt: new Date('2024-03-05').toISOString(),
    lastUpdated: new Date('2024-07-01').toISOString(),
    fileSize: 950000,
    fileType: 'application/pdf',
    downloadCount: 312,
    tags: ['foster care', 'faq', 'parents'],
  },
  {
    id: '4',
    title: 'Child Safety Policies',
    description: 'Our comprehensive child safety and protection protocols.',
    category: 'policies',
    status: 'approved',
    uploadedBy: 'admin@example.com',
    uploadedAt: new Date('2024-01-20').toISOString(),
    lastUpdated: new Date('2024-08-10').toISOString(),
    fileSize: 1200000,
    fileType: 'application/pdf',
    downloadCount: 156,
    tags: ['safety', 'protection', 'policies', 'children'],
  },
  {
    id: '5',
    title: 'Donor Information Guide',
    description: 'Information for donors about how contributions are used.',
    category: 'donors',
    status: 'approved',
    uploadedBy: 'admin@example.com',
    uploadedAt: new Date('2024-04-12').toISOString(),
    lastUpdated: new Date('2024-06-30').toISOString(),
    fileSize: 780000,
    fileType: 'application/pdf',
    downloadCount: 98,
    tags: ['donations', 'giving', 'financial'],
  },
  {
    id: '6',
    title: 'International Adoption Requirements',
    description: 'Country-specific requirements for international adoptions.',
    category: 'adoption',
    status: 'pending',
    uploadedBy: 'staff@example.com',
    uploadedAt: new Date('2024-08-01').toISOString(),
    lastUpdated: new Date('2024-08-01').toISOString(),
    fileSize: 3200000,
    fileType: 'application/pdf',
    downloadCount: 0,
    tags: ['international', 'adoption', 'requirements'],
  },
];

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authentication required for document listing
    const { auth, error: authError } = await requireAuth(request);
    if (authError) {
      logRequest(request, 401, startTime);
      return withCors(authError, request);
    }

    const clientId = getClientIdentifier(request, auth.userId);

    // Rate limiting for read operations
    const rateLimit = checkRateLimit(clientId, RATE_LIMITS.default);
    if (!rateLimit.allowed) {
      logRequest(request, 429, startTime, auth.userId);
      return withCors(rateLimitResponse(rateLimit.resetIn), request);
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));

    let filteredDocs = [...demoDocuments];

    // Apply filters
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredDocs = filteredDocs.filter(doc =>
        doc.title.toLowerCase().includes(lowerQuery) ||
        doc.description.toLowerCase().includes(lowerQuery) ||
        doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    if (category) {
      filteredDocs = filteredDocs.filter(doc => doc.category === category);
    }

    if (status) {
      filteredDocs = filteredDocs.filter(doc => doc.status === status);
    }

    // Pagination
    const totalCount = filteredDocs.length;
    const startIndex = (page - 1) * limit;
    const paginatedDocs = filteredDocs.slice(startIndex, startIndex + limit);

    logRequest(request, 200, startTime, auth.userId);
    return withCors(
      NextResponse.json({
        documents: paginatedDocs,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      }),
      request
    );

  } catch (error) {
    console.error('Documents API error:', error);
    logRequest(request, 500, startTime);
    return withCors(
      errorResponse(
        'Failed to fetch documents',
        error instanceof Error ? error : undefined
      ),
      request
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authentication required
    const { auth, error: authError } = await requireAuth(request);
    if (authError) {
      logRequest(request, 401, startTime);
      return withCors(authError, request);
    }

    // Admin role required
    if (!isAdminUser(auth)) {
      logRequest(request, 403, startTime, auth.userId);
      return withCors(forbiddenResponse('Admin role required to upload documents'), request);
    }

    const clientId = getClientIdentifier(request, auth.userId);

    // Rate limiting for write operations (more restrictive)
    const rateLimit = checkRateLimit(clientId, RATE_LIMITS.documents);
    if (!rateLimit.allowed) {
      logRequest(request, 429, startTime, auth.userId);
      return withCors(rateLimitResponse(rateLimit.resetIn), request);
    }

    // Parse and validate input
    let body;
    try {
      body = await request.json();
    } catch {
      logRequest(request, 400, startTime, auth.userId);
      return withCors(
        NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 }
        ),
        request
      );
    }

    const validation = validateInput(documentUploadSchema, body);
    if (!validation.success) {
      logRequest(request, 400, startTime, auth.userId);
      return withCors(
        NextResponse.json(
          { error: 'Validation failed', details: validation.error },
          { status: 400 }
        ),
        request
      );
    }

    const { title, description, category, tags, content } = validation.data;

    // In production, this would:
    // 1. Upload file to Firebase Storage
    // 2. Extract text content for indexing
    // 3. Create embeddings for vector search
    // 4. Store metadata in Firestore

    const newDocument = {
      id: Date.now().toString(),
      title,
      description,
      category,
      status: 'pending',
      uploadedBy: auth.userId,
      uploadedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      fileSize: content?.length || 0,
      fileType: 'application/pdf',
      downloadCount: 0,
      tags,
    };

    logRequest(request, 200, startTime, auth.userId);
    return withCors(
      NextResponse.json({
        success: true,
        document: newDocument,
        message: 'Document uploaded successfully. Pending admin approval.',
      }),
      request
    );

  } catch (error) {
    console.error('Document upload error:', error);
    logRequest(request, 500, startTime);
    return withCors(
      errorResponse(
        'Failed to upload document',
        error instanceof Error ? error : undefined
      ),
      request
    );
  }
}

export async function DELETE(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authentication required
    const { auth, error: authError } = await requireAuth(request);
    if (authError) {
      logRequest(request, 401, startTime);
      return withCors(authError, request);
    }

    // Admin role required
    if (!isAdminUser(auth)) {
      logRequest(request, 403, startTime, auth.userId);
      return withCors(forbiddenResponse('Admin role required to delete documents'), request);
    }

    const clientId = getClientIdentifier(request, auth.userId);

    // Rate limiting for write operations
    const rateLimit = checkRateLimit(clientId, RATE_LIMITS.documents);
    if (!rateLimit.allowed) {
      logRequest(request, 429, startTime, auth.userId);
      return withCors(rateLimitResponse(rateLimit.resetIn), request);
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    const validation = validateInput(documentIdSchema, { id: documentId });
    if (!validation.success) {
      logRequest(request, 400, startTime, auth.userId);
      return withCors(
        NextResponse.json(
          { error: 'Invalid document ID', details: validation.error },
          { status: 400 }
        ),
        request
      );
    }

    // In production, this would:
    // 1. Verify admin authentication
    // 2. Delete file from Firebase Storage
    // 3. Remove metadata from Firestore
    // 4. Remove embeddings from vector index

    logRequest(request, 200, startTime, auth.userId);
    return withCors(
      NextResponse.json({
        success: true,
        message: `Document ${documentId} deleted successfully.`,
      }),
      request
    );

  } catch (error) {
    console.error('Document deletion error:', error);
    logRequest(request, 500, startTime);
    return withCors(
      errorResponse(
        'Failed to delete document',
        error instanceof Error ? error : undefined
      ),
      request
    );
  }
}
