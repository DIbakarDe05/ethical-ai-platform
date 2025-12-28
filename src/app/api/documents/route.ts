/**
 * Documents API Route
 * 
 * Handles document CRUD operations for the knowledge base.
 */

import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

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

    return NextResponse.json({
      documents: paginatedDocs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error: any) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, tags, content } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Validate the user's authentication and admin role
    // 2. Upload file to Firebase Storage
    // 3. Extract text content for indexing
    // 4. Create embeddings for vector search
    // 5. Store metadata in Firestore

    const newDocument = {
      id: Date.now().toString(),
      title,
      description: description || '',
      category,
      status: 'pending',
      uploadedBy: 'current-user@example.com',
      uploadedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      fileSize: 0,
      fileType: 'application/pdf',
      downloadCount: 0,
      tags: tags || [],
    };

    return NextResponse.json({
      success: true,
      document: newDocument,
      message: 'Document uploaded successfully. Pending admin approval.',
    });

  } catch (error: any) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify admin authentication
    // 2. Delete file from Firebase Storage
    // 3. Remove metadata from Firestore
    // 4. Remove embeddings from vector index

    return NextResponse.json({
      success: true,
      message: `Document ${documentId} deleted successfully.`,
    });

  } catch (error: any) {
    console.error('Document deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document', details: error.message },
      { status: 500 }
    );
  }
}
