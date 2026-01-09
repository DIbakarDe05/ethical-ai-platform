/**
 * Search API Route
 * 
 * Handles semantic search across the knowledge base using vector similarity.
 * 
 * SECURITY FEATURES:
 * - Authentication required
 * - Rate limiting (30 requests per minute)
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
  RATE_LIMITS,
  withCors,
  corsPreflightResponse,
  logRequest,
} from '@/lib/api/auth';
import { searchQuerySchema, validateInput } from '@/lib/validation';

// Demo search results
const demoResults = [
  {
    id: '1',
    title: 'Adoption Guidelines 2024',
    snippet: 'The adoption process typically involves several key steps: initial inquiry, home study, matching, placement, and finalization. Prospective adoptive parents must meet certain requirements including...',
    category: 'adoption',
    relevanceScore: 0.95,
    highlights: ['adoption process', 'requirements', 'home study'],
  },
  {
    id: '2',
    title: 'Foster Care FAQ',
    snippet: 'Foster care provides temporary care for children who cannot safely remain with their biological families. Foster parents receive training and support throughout the process...',
    category: 'foster-care',
    relevanceScore: 0.87,
    highlights: ['foster care', 'temporary care', 'training'],
  },
  {
    id: '3',
    title: 'Child Safety Policies',
    snippet: 'Our organization is committed to the safety and well-being of all children in our care. This policy outlines the protocols for ensuring a safe environment...',
    category: 'policies',
    relevanceScore: 0.82,
    highlights: ['safety', 'well-being', 'protocols'],
  },
];

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
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

    const clientId = getClientIdentifier(request, auth.userId);

    // Rate limiting
    const rateLimit = checkRateLimit(clientId, RATE_LIMITS.search);
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

    const validation = validateInput(searchQuerySchema, body);
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

    const { query, filters, limit } = validation.data;

    // In production, this would:
    // 1. Generate embedding for the query using Gemini
    // 2. Perform vector similarity search in Firestore/Vertex AI
    // 3. Apply filters and ranking
    // 4. Return relevant document chunks with metadata

    // Demo: filter and score based on query terms
    const lowerQuery = query.toLowerCase();
    let results = demoResults.filter(result =>
      result.title.toLowerCase().includes(lowerQuery) ||
      result.snippet.toLowerCase().includes(lowerQuery) ||
      result.highlights.some(h => lowerQuery.includes(h.toLowerCase()))
    );

    // If no direct matches, return all results with adjusted scores
    if (results.length === 0) {
      results = demoResults.map(r => ({
        ...r,
        relevanceScore: r.relevanceScore * 0.5,
      }));
    }

    // Apply category filter
    if (filters.category) {
      results = results.filter(r => r.category === filters.category);
    }

    // Limit results
    results = results.slice(0, limit);

    logRequest(request, 200, startTime, auth.userId);
    return withCors(
      NextResponse.json({
        results,
        query,
        totalResults: results.length,
        searchTime: Math.random() * 0.5 + 0.1, // Simulated search time
      }),
      request
    );

  } catch (error) {
    console.error('Search API error:', error);
    logRequest(request, 500, startTime);
    return withCors(
      errorResponse(
        'Failed to perform search',
        error instanceof Error ? error : undefined
      ),
      request
    );
  }
}

export async function GET(request: NextRequest) {
  return withCors(
    NextResponse.json({
      status: 'Search API is running',
      version: '1.0.0',
      features: ['semantic-search', 'filters', 'highlighting'],
      requiresAuth: true,
    }),
    request
  );
}
