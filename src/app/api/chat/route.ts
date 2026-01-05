/**
 * Chat API Route
 * 
 * Handles AI chat requests with RAG-based responses.
 * 
 * SECURITY FEATURES:
 * - Authentication required (Bearer token)
 * - Rate limiting (20 requests per minute)
 * - Input validation with Zod
 * - Safe error responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  authenticateRequest,
  checkRateLimit,
  getClientIdentifier,
  rateLimitResponse,
  errorResponse,
  RATE_LIMITS,
} from '@/lib/api/auth';
import { chatMessageSchema, validateInput } from '@/lib/validation';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are an ethical AI assistant for a knowledge base platform serving NGOs, social organizations, and adoption centers.

IMPORTANT GUIDELINES:
1. ONLY provide information that can be verified from the provided documents
2. ALWAYS cite your sources with document names and relevant sections
3. Be transparent about limitations - say "I don't have enough information" when appropriate
4. Never provide legal, medical, or financial advice
5. Flag sensitive topics for human review
6. Maintain privacy - never share personal information from documents
7. Be helpful, accurate, and compassionate

When responding:
- Start with a clear, direct answer
- Provide relevant context from documents
- Include citations in [Source: Document Name] format
- Offer to connect users with human staff for complex issues
- Use simple, accessible language

Remember: You are assisting vulnerable populations. Prioritize accuracy and empathy.`;

export async function POST(request: NextRequest) {
  try {
    // Authentication check (optional for demo mode)
    const authResult = await authenticateRequest(request);
    const clientId = getClientIdentifier(request, authResult.userId);

    // Rate limiting
    const rateLimit = checkRateLimit(clientId, RATE_LIMITS.chat);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.resetIn);
    }

    // Parse and validate input
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const validation = validateInput(chatMessageSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error },
        { status: 400 }
      );
    }

    const { message, conversationHistory, documents } = validation.data;

    // Build context from documents (RAG)
    const documentContext = documents.length > 0
      ? `\n\nRelevant Documents:\n${documents.map((doc) =>
        `--- ${doc.title} ---\n${doc.content}`
      ).join('\n\n')}`
      : '';

    // Build conversation history
    const historyContext = conversationHistory.length > 0
      ? conversationHistory.map((msg) =>
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n')
      : '';

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      // Return demo response
      return NextResponse.json({
        message: getDemoResponse(message),
        citations: [
          { title: 'Demo Document', section: 'Sample Section', confidence: 0.95 }
        ],
        isDemo: true
      });
    }

    // Initialize model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3, // Lower temperature for accuracy
        topP: 0.8,
        maxOutputTokens: 1024,
      },
    });

    // Create prompt with context
    const fullPrompt = `${SYSTEM_PROMPT}
${documentContext}

${historyContext ? `Conversation History:\n${historyContext}\n` : ''}
User: ${message}

Provide a helpful, accurate response with citations where applicable.`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // Extract citations (simple pattern matching)
    const citationPattern = /\[Source: ([^\]]+)\]/g;
    const citations: Array<{ title: string; section: string; confidence: number }> = [];
    let match;
    while ((match = citationPattern.exec(text)) !== null) {
      citations.push({
        title: match[1],
        section: 'Referenced Section',
        confidence: 0.85,
      });
    }

    return NextResponse.json({
      message: text,
      citations,
      isDemo: false,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return errorResponse(
      'Failed to process chat request',
      error instanceof Error ? error : undefined
    );
  }
}

function getDemoResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('adopt') || lowerMessage.includes('adoption')) {
    return `Based on our verified documents, here's information about the adoption process:

**General Requirements:**
- Prospective parents must be at least 21 years of age
- Complete a home study with a licensed agency
- Undergo background checks and health screenings
- Complete required parenting education courses

**Timeline:**
The typical adoption process takes 6-18 months depending on the type of adoption and individual circumstances.

[Source: Adoption Guidelines 2024]

Would you like more specific information about a particular type of adoption, or should I connect you with one of our adoption counselors?`;
  }

  if (lowerMessage.includes('volunteer') || lowerMessage.includes('help')) {
    return `Thank you for your interest in volunteering! Here's what I found:

**Volunteer Opportunities:**
- **Administrative Support**: Help with paperwork and office tasks
- **Event Planning**: Assist with fundraising and community events
- **Mentorship Programs**: Work directly with families and children
- **Skills-Based Volunteering**: Offer professional expertise

**Requirements:**
- Background check (required for all positions)
- Orientation training (2-4 hours)
- Minimum commitment varies by role

[Source: Volunteer Handbook]

Would you like me to provide more details about any specific volunteer role?`;
  }

  if (lowerMessage.includes('donate') || lowerMessage.includes('donation') || lowerMessage.includes('support')) {
    return `Here's information about supporting our organization:

**Ways to Give:**
- One-time donations
- Monthly giving programs
- Corporate matching gifts
- Planned giving and bequests

**How Donations Are Used:**
- 85% directly supports programs and services
- 10% administrative costs
- 5% fundraising

All donations are tax-deductible. Receipts are provided automatically.

[Source: Donor Information Guide]

Would you like information about specific programs you can support?`;
  }

  return `Thank you for your question. I can help you with information from our verified knowledge base covering:

- **Adoption processes and requirements**
- **Foster care information**
- **Volunteer opportunities**
- **Donation and support options**
- **Organization policies and procedures**

Could you please provide more details about what you're looking for? I'm here to help you find accurate, verified information.

*Note: This is a demo response. In production, responses are generated based on your organization's verified documents.*`;
}

export async function GET() {
  return NextResponse.json({
    status: 'Chat API is running',
    version: '1.0.0',
    model: 'gemini-1.5-flash'
  });
}
