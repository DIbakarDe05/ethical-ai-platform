/**
 * Admin NGO Seed Page
 * 
 * Allows admins to populate the NGO directory with seed data.
 */

'use client';

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, Card, Button } from '@/components/ui';
import toast from 'react-hot-toast';

const ngoSeedData = [
    // WELFARE ORGANIZATIONS
    {
        name: "Akshaya Patra Foundation",
        location: "Rajajinagar, Bengaluru, Karnataka",
        type: "welfare",
        status: "approved",
        description: "India's largest NGO providing mid-day meals to school children. Serves 2.1 Million meals daily across India. 80G Tax Exemption certified.",
        coordinates: { lat: 13.0012, lng: 77.5519 },
    },
    {
        name: "HelpAge India",
        location: "Qutab Institutional Area, New Delhi",
        type: "welfare",
        status: "approved",
        description: "Dedicated to elderly welfare with 24/7 helpline, mobile healthcare units, physiotherapy services, and old age homes across India.",
        coordinates: { lat: 28.5355, lng: 77.1931 },
    },
    {
        name: "The Banyan",
        location: "Mugappair West, Chennai, Tamil Nadu",
        type: "welfare",
        status: "approved",
        description: "24/7 mental health care for homeless women. Provides transit care, community mental health services with 150+ emergency beds.",
        coordinates: { lat: 13.0827, lng: 80.1636 },
    },

    // ADOPTION AGENCIES (SAA)
    {
        name: "Delhi Council for Child Welfare (Palna)",
        location: "Civil Lines, New Delhi",
        type: "adoption",
        status: "approved",
        description: "Government-recognized Specialized Adoption Agency (SAA) providing cradle for abandoned babies and foster care placements.",
        coordinates: { lat: 28.6814, lng: 77.2226 },
    },
    {
        name: "Matru Schaya (Goa Social Welfare Board)",
        location: "Panjim, Goa",
        type: "adoption",
        status: "approved",
        description: "Adoption agency for orphans aged 0-6 years, tracking Legally Free for Adoption (LFA) status for children in need of permanent homes.",
        coordinates: { lat: 15.4909, lng: 73.8278 },
    },
    {
        name: "Missionaries of Charity (Nirmala Shishu Bhavan)",
        location: "AJC Bose Road, Kolkata, West Bengal",
        type: "adoption",
        status: "approved",
        description: "Specializes in special needs adoption with pre-adoption counseling. Charitable religious organization serving physically and mentally challenged children.",
        coordinates: { lat: 22.5411, lng: 88.3511 },
    },

    // CHILD CARE & CRECHE SERVICES
    {
        name: "Footprints Childcare & Daycare",
        location: "Sector 18, Gurugram, Haryana",
        type: "child_care",
        status: "approved",
        description: "Professional daycare with real-time CCTV mobile app access, nutritionist-approved meals, and care for children aged 9 months to 12 years.",
        coordinates: { lat: 28.4942, lng: 77.0880 },
    },
    {
        name: "First Steps Daycare & Preschool",
        location: "Vasanth Nagar, Bengaluru, Karnataka",
        type: "child_care",
        status: "approved",
        description: "Montessori and play-way curriculum preschool with in-house transport facility. Maintains 1:5 teacher-to-child ratio.",
        coordinates: { lat: 12.9896, lng: 77.5877 },
    },
    {
        name: "Little Big World",
        location: "Yerwada, Pune, Maharashtra",
        type: "child_care",
        status: "approved",
        description: "Corporate creche with IT firm tie-ups, on-site nurse, and flexible enrollment plans. Located in Commerzone IT Park.",
        coordinates: { lat: 18.5579, lng: 73.9014 },
    }
];

export default function SeedNGOsPage() {
    const { isAdmin, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [existingCount, setExistingCount] = useState<number | null>(null);

    const checkExisting = async () => {
        try {
            const q = query(collection(db, COLLECTIONS.NGOS));
            const snapshot = await getDocs(q);
            setExistingCount(snapshot.size);
        } catch (error) {
            console.error('Error checking existing NGOs:', error);
        }
    };

    React.useEffect(() => {
        checkExisting();
    }, []);

    const seedNGOs = async () => {
        if (!isAdmin) {
            toast.error('Admin access required');
            return;
        }

        setLoading(true);
        setResults([]);

        for (const ngo of ngoSeedData) {
            try {
                // Check if NGO already exists by name
                const existingQuery = query(
                    collection(db, COLLECTIONS.NGOS),
                    where('name', '==', ngo.name)
                );
                const existing = await getDocs(existingQuery);

                if (!existing.empty) {
                    setResults(prev => [...prev, `⚠ Skipped (exists): ${ngo.name}`]);
                    continue;
                }

                await addDoc(collection(db, COLLECTIONS.NGOS), {
                    ...ngo,
                    userId: user?.uid || 'system',
                    createdAt: serverTimestamp(),
                });
                setResults(prev => [...prev, `✓ Added: ${ngo.name}`]);
            } catch (error) {
                setResults(prev => [...prev, `✗ Failed: ${ngo.name}`]);
                console.error(`Failed to add ${ngo.name}:`, error);
            }
        }

        setLoading(false);
        await checkExisting();
        toast.success('Seed complete!');
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Card padding="lg" className="text-center">
                        <Icon name="lock" size="2xl" className="text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Admin access required</p>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto p-6">
                <Card padding="lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Icon name="add_business" className="text-white" size="lg" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Seed NGO Directory
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Add sample NGOs to the directory
                            </p>
                        </div>
                    </div>

                    {existingCount !== null && (
                        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Current NGOs in database:</strong> {existingCount}
                            </p>
                        </div>
                    )}

                    <div className="mb-6">
                        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
                            NGOs to be added ({ngoSeedData.length}):
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {ngoSeedData.map((ngo, i) => (
                                <div
                                    key={i}
                                    className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                                >
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                        {ngo.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {ngo.type} • {ngo.location.split(',')[0]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={seedNGOs}
                        disabled={loading}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Adding NGOs...
                            </>
                        ) : (
                            <>
                                <Icon name="add" size="sm" className="mr-2" />
                                Seed {ngoSeedData.length} NGOs
                            </>
                        )}
                    </Button>

                    {results.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-900 rounded-xl font-mono text-sm">
                            {results.map((result, i) => (
                                <p
                                    key={i}
                                    className={
                                        result.startsWith('✓')
                                            ? 'text-green-400'
                                            : result.startsWith('⚠')
                                                ? 'text-yellow-400'
                                                : 'text-red-400'
                                    }
                                >
                                    {result}
                                </p>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
