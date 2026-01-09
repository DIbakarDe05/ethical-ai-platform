/**
 * NGO Data Seed Script
 * 
 * Run this script to populate the NGO directory with initial data.
 * Usage: Open browser console on the website while logged in as admin,
 * or import this data through Firebase Console.
 */

// NGO Data for Firestore
// Collection: 'ngos'
// Each document should have status: 'approved' to appear in directory

export const ngoSeedData = [
    // ==========================================
    // WELFARE ORGANIZATIONS
    // ==========================================
    {
        name: "Akshaya Patra Foundation",
        location: "Rajajinagar, Bengaluru, Karnataka",
        type: "welfare",
        status: "approved",
        description: "India's largest NGO providing mid-day meals to school children. Serves 2.1 Million meals daily across India. 80G Tax Exemption certified.",
        coordinates: { lat: 13.0012, lng: 77.5519 },
        details: {
            targetGroup: "School children and marginalized daily-wage workers",
            timing: "Mon–Sat: 9:00 AM – 6:00 PM",
            capacity: "2.1 Million meals daily",
            registration: "80G Tax Exemption NGO",
            serviceArea: "Pan-India"
        },
        contact: {
            address: "HK Hill, 1st R Block, Rajajinagar, Bengaluru, Karnataka 560010"
        },
        createdAt: new Date(),
        userId: "system"
    },
    {
        name: "HelpAge India",
        location: "Qutab Institutional Area, New Delhi",
        type: "welfare",
        status: "approved",
        description: "Dedicated to elderly welfare with 24/7 helpline, mobile healthcare units, physiotherapy services, and old age homes across India.",
        coordinates: { lat: 28.5355, lng: 77.1931 },
        details: {
            targetGroup: "Senior citizens (60+)",
            timing: "Mon–Fri: 9:30 AM – 5:30 PM (Helpline: 24/7)",
            helpline: "1800-180-1253",
            programs: "Mobile Healthcare Units, Physiotherapy, Old Age Homes",
            status: "Active - Seeking Volunteers"
        },
        contact: {
            address: "C-14, Qutab Institutional Area, New Delhi, Delhi 110016",
            phone: "1800-180-1253"
        },
        createdAt: new Date(),
        userId: "system"
    },
    {
        name: "The Banyan",
        location: "Mugappair West, Chennai, Tamil Nadu",
        type: "welfare",
        status: "approved",
        description: "24/7 mental health care for homeless women. Provides transit care, community mental health services with 150+ emergency beds.",
        coordinates: { lat: 13.0827, lng: 80.1636 },
        details: {
            targetGroup: "Homeless women with mental health conditions",
            timing: "24/7 (Emergency Intake)",
            bedCount: "150+ Emergency beds",
            serviceType: "Transit Care, Community Mental Health",
            staff: "Psychiatrists and Social Workers available"
        },
        contact: {
            address: "6th Main Road, Mugappair West, Chennai, Tamil Nadu 600037"
        },
        createdAt: new Date(),
        userId: "system"
    },

    // ==========================================
    // ADOPTION AGENCIES (SAA)
    // ==========================================
    {
        name: "Delhi Council for Child Welfare (Palna)",
        location: "Civil Lines, New Delhi",
        type: "adoption",
        status: "approved",
        description: "Government-recognized Specialized Adoption Agency (SAA) providing cradle for abandoned babies and foster care placements.",
        coordinates: { lat: 28.6814, lng: 77.2226 },
        details: {
            targetGroup: "Abandoned infants and prospective adoptive parents",
            timing: "Mon–Sat: 10:00 AM – 4:00 PM",
            caraLicense: "DL-01",
            services: "Cradle for abandoned babies, foster care placements",
            requiredDocs: "Home Study Report (HSR)"
        },
        contact: {
            address: "Qudsia Bagh, Yamuna Marg, Civil Lines, New Delhi, Delhi 110054"
        },
        createdAt: new Date(),
        userId: "system"
    },
    {
        name: "Matru Schaya (Goa Central Social Welfare Board)",
        location: "Panjim, Goa",
        type: "adoption",
        status: "approved",
        description: "Adoption agency for orphans aged 0-6 years, tracking Legally Free for Adoption (LFA) status for children in need of permanent homes.",
        coordinates: { lat: 15.4909, lng: 73.8278 },
        details: {
            targetGroup: "Orphans and children in need of permanent homes",
            timing: "Mon–Fri: 9:00 AM – 5:00 PM",
            ageGroup: "0 to 6 years",
            legalStatus: "Legally Free for Adoption (LFA) tracking"
        },
        contact: {
            address: "P.O. Box 212, Panjim, Goa 403001"
        },
        createdAt: new Date(),
        userId: "system"
    },
    {
        name: "Missionaries of Charity (Nirmala Shishu Bhavan)",
        location: "AJC Bose Road, Kolkata, West Bengal",
        type: "adoption",
        status: "approved",
        description: "Specializes in special needs adoption with pre-adoption counseling. Charitable religious organization serving physically and mentally challenged children.",
        coordinates: { lat: 22.5411, lng: 88.3511 },
        details: {
            targetGroup: "Physically and mentally challenged children",
            timing: "Mon–Sat: 9:00 AM – 12:00 PM & 3:00 PM – 5:30 PM",
            specialization: "Special Needs Adoption",
            process: "Pre-adoption counseling",
            type: "Charitable Religious Organization"
        },
        contact: {
            address: "78, AJC Bose Road, Kolkata, West Bengal 700014"
        },
        createdAt: new Date(),
        userId: "system"
    },

    // ==========================================
    // CHILD CARE & CRECHE SERVICES
    // ==========================================
    {
        name: "Footprints Childcare & Daycare",
        location: "Sector 18, Gurugram, Haryana",
        type: "child_care",
        status: "approved",
        description: "Professional daycare with real-time CCTV mobile app access, nutritionist-approved meals, and care for children aged 9 months to 12 years.",
        coordinates: { lat: 28.4942, lng: 77.0880 },
        details: {
            targetGroup: "Infants (9 months) to Children (12 years)",
            timing: "Mon–Fri: 8:30 AM – 6:30 PM",
            safety: "Real-time CCTV Mobile App Access",
            mealPlan: "Nutritionist-approved meals included",
            status: "Admissions Open"
        },
        contact: {
            address: "Plot No. 8, Sector 18, Gurugram, Haryana 122015"
        },
        createdAt: new Date(),
        userId: "system"
    },
    {
        name: "First Steps Daycare & Preschool",
        location: "Vasanth Nagar, Bengaluru, Karnataka",
        type: "child_care",
        status: "approved",
        description: "Montessori and play-way curriculum preschool with in-house transport facility. Maintains 1:5 teacher-to-child ratio.",
        coordinates: { lat: 12.9896, lng: 77.5877 },
        details: {
            targetGroup: "Children of IT professionals and working parents",
            timing: "Mon–Fri: 8:00 AM – 6:00 PM (Sat: Half day)",
            curriculum: "Montessori / Play-way method",
            transport: "In-house transport facility",
            staffRatio: "1 Teacher per 5 Children"
        },
        contact: {
            address: "Cunningham Road, Vasanth Nagar, Bengaluru, Karnataka 560052"
        },
        createdAt: new Date(),
        userId: "system"
    },
    {
        name: "Little Big World",
        location: "Yerwada, Pune, Maharashtra",
        type: "child_care",
        status: "approved",
        description: "Corporate creche with IT firm tie-ups, on-site nurse, and flexible enrollment plans. Located in Commerzone IT Park.",
        coordinates: { lat: 18.5579, lng: 73.9014 },
        details: {
            targetGroup: "Corporate employees' children",
            timing: "Mon–Fri: 8:00 AM – 7:30 PM",
            affiliation: "Corporate Tie-up with IT firms",
            emergency: "On-site Nurse available",
            enrollment: "Daily/Monthly/Annual plans"
        },
        contact: {
            address: "Commerzone IT Park, Yerwada, Pune, Maharashtra 411006"
        },
        createdAt: new Date(),
        userId: "system"
    }
];

// Instructions for adding to Firestore:
// 1. Go to Firebase Console > Firestore Database
// 2. Create collection named 'ngos' if not exists
// 3. Add each document from the array above
// OR use the seedNGOs function below when logged in as admin

export async function seedNGOs() {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase/config');

    console.log('Starting NGO seed...');

    for (const ngo of ngoSeedData) {
        try {
            const docRef = await addDoc(collection(db, 'ngos'), {
                ...ngo,
                createdAt: serverTimestamp(),
            });
            console.log(`✓ Added: ${ngo.name} (ID: ${docRef.id})`);
        } catch (error) {
            console.error(`✗ Failed to add ${ngo.name}:`, error);
        }
    }

    console.log('NGO seed complete!');
}

// To run this in browser console:
// 1. Open the website and login as admin
// 2. Open browser console (F12)
// 3. Run: import('/src/data/ngo-seed.ts').then(m => m.seedNGOs())
