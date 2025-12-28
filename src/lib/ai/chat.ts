/**
 * AI Chat Service
 * 
 * Handles communication with the AI backend.
 * Uses RAG (Retrieval-Augmented Generation) for accurate responses.
 */

import { Message, Citation } from '@/components/chat/ChatMessage';

/**
 * System prompt for the AI assistant
 * Implements ethical guidelines and RAG behavior
 */
const SYSTEM_PROMPT = `You are an ethical AI assistant for NGOs and social organizations.
Use ONLY the retrieved documents to answer user questions.

Response structure:
1. Provide a clear, direct answer
2. Cite sources using [doc: filename] format
3. If information is missing or uncertain, say:
   "Please consult NGO staff for personalized guidance."

Rules:
- Reject harmful, illegal, or unsafe queries
- Do not guess or hallucinate information
- Do not generate legal or medical advice
- Promote inclusivity and use neutral language
- Always recommend consulting official staff for sensitive topics

You support English and Hindi languages.`;

/**
 * Send a chat message and get AI response
 */
export async function sendChatMessage(
  userMessage: string,
  conversationHistory: Message[]
): Promise<{ content: string; citations: Citation[] }> {
  try {
    // In production, this would call your API endpoint
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return {
      content: data.content,
      citations: data.citations || [],
    };
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback demo response
    return getDemoResponse(userMessage);
  }
}

/**
 * Demo response for when API is not available
 */
function getDemoResponse(userMessage: string): { content: string; citations: Citation[] } {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for adoption-related queries
  if (lowerMessage.includes('adoption') || lowerMessage.includes('hague')) {
    return {
      content: `Based on our verified documents, international adoption requires strict adherence to the **Hague Convention on Protection of Children**.

Key requirements include:

1. **Establish Eligibility:** Verify the child's eligibility for adoption. [doc: Adoption Guidelines.pdf]

2. **Central Authority Approval:** Both origin and receiving country authorities must agree the adoption is in the child's best interest. [doc: Hague Convention Art.17c]

3. **Non-profit Accreditation:** Agencies must be accredited and non-profit oriented. [doc: Accreditation Standards]

Please consult NGO staff for personalized guidance on specific cases.`,
      citations: [
        { id: '1', title: 'Adoption Guidelines.pdf', type: 'document' },
        { id: '2', title: 'Hague Convention Art.17c', type: 'guideline' },
        { id: '3', title: 'Accreditation Standards', type: 'document' },
      ],
    };
  }

  // Check for grant-related queries
  if (lowerMessage.includes('grant') || lowerMessage.includes('funding')) {
    return {
      content: `Here's what I found about grant applications:

**Federal Grant Application Process:**

1. **Eligibility Check:** Ensure your organization meets federal requirements [doc: Grant Eligibility Criteria.pdf]

2. **Required Documents:**
   - Organization registration
   - Financial statements (last 3 years)
   - Program proposal

3. **Submission Timeline:** Applications for 2024 cycle due by March 31st [doc: Grant Calendar 2024.pdf]

For specific grant opportunities, please consult with your program coordinator.`,
      citations: [
        { id: '1', title: 'Grant Eligibility Criteria.pdf', type: 'document' },
        { id: '2', title: 'Grant Calendar 2024.pdf', type: 'document' },
      ],
    };
  }

  // Check for volunteer/staff queries
  if (lowerMessage.includes('volunteer') || lowerMessage.includes('staff') || lowerMessage.includes('training')) {
    return {
      content: `Regarding volunteer and staff guidelines:

**Training Requirements:**

1. **Background Check:** All volunteers must complete a background verification [doc: Safety Protocols.pdf]

2. **Orientation Program:** 8-hour initial training covering:
   - Organization policies
   - Child safeguarding
   - Ethical guidelines

3. **Ongoing Education:** Annual refresher courses required [doc: Volunteer Handbook v2.pdf]

Please consult NGO staff for personalized guidance on specific training schedules.`,
      citations: [
        { id: '1', title: 'Safety Protocols.pdf', type: 'document' },
        { id: '2', title: 'Volunteer Handbook v2.pdf', type: 'document' },
      ],
    };
  }

  // Default response
  return {
    content: `Thank you for your question. Based on our knowledge base, I can provide information on:

- **International Adoption** policies and procedures
- **Grant Applications** and funding requirements  
- **Volunteer Guidelines** and training
- **NGO Compliance** and best practices

Could you please be more specific about what you'd like to know? I'll search our verified documents to provide accurate information.

For sensitive or case-specific matters, please consult NGO staff for personalized guidance.`,
    citations: [],
  };
}

export default { sendChatMessage };
