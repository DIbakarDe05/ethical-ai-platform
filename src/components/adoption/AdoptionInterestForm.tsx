/**
 * Adoption Interest Form Component
 * 
 * Form for prospective parents to submit adoption interest requests.
 * Collects age preference, location, special care willingness, and family details.
 * Saves requests to Firestore and notifies selected NGO.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/config';
import { Icon, Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface NGO {
    id: string;
    userId: string;
    name: string;
    location: string;
    type: string;
}

interface FormData {
    ngoId: string;
    minAge: string;
    maxAge: string;
    location: string;
    specialCare: 'yes' | 'no' | 'maybe';
    familyDetails: string;
    email: string;
    phone: string;
    consent: boolean;
}

export function AdoptionInterestForm() {
    const { user, isAuthenticated } = useAuth();
    const [ngos, setNgos] = useState<NGO[]>([]);
    const [loadingNgos, setLoadingNgos] = useState(true);
    const [formData, setFormData] = useState<FormData>({
        ngoId: '',
        minAge: '',
        maxAge: '',
        location: '',
        specialCare: 'maybe',
        familyDetails: '',
        email: user?.email || '',
        phone: '',
        consent: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [requestId, setRequestId] = useState<string>('');

    // Fetch approved NGOs for the dropdown
    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                const q = query(
                    collection(db, COLLECTIONS.NGOS),
                    where('status', '==', 'approved')
                );
                const snapshot = await getDocs(q);
                const ngoList: NGO[] = [];
                snapshot.forEach((doc) => {
                    ngoList.push({
                        id: doc.id,
                        ...doc.data(),
                    } as NGO);
                });
                setNgos(ngoList);
            } catch (error) {
                console.error('Error fetching NGOs:', error);
                toast.error('Failed to load NGOs');
            } finally {
                setLoadingNgos(false);
            }
        };

        fetchNGOs();
    }, []);

    // Update email when user changes
    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.consent) {
            toast.error('Please agree to the consent terms before submitting.');
            return;
        }

        if (!formData.ngoId) {
            toast.error('Please select an NGO to send your request to.');
            return;
        }

        if (!formData.location.trim()) {
            toast.error('Please enter your location.');
            return;
        }

        if (!formData.familyDetails.trim()) {
            toast.error('Please provide family details.');
            return;
        }

        setIsSubmitting(true);

        try {
            const selectedNgo = ngos.find(n => n.id === formData.ngoId);

            // Save to Firestore
            const docRef = await addDoc(collection(db, COLLECTIONS.ADOPTION_REQUESTS), {
                userId: user?.uid,
                userEmail: user?.email,
                userName: user?.displayName,
                ngoId: formData.ngoId,
                ngoUserId: selectedNgo?.userId,
                ngoName: selectedNgo?.name,
                agePreference: {
                    min: formData.minAge || 'any',
                    max: formData.maxAge || 'any',
                },
                location: formData.location.trim(),
                specialCare: formData.specialCare,
                familyDetails: formData.familyDetails.trim(),
                contactEmail: formData.email,
                contactPhone: formData.phone,
                consent: formData.consent,
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            // Create audit log
            await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), {
                userId: user?.uid,
                action: 'Adoption interest submitted',
                targetId: docRef.id,
                targetType: 'adoption_request',
                timestamp: serverTimestamp(),
            });

            setRequestId(docRef.id);
            setIsSubmitted(true);
            toast.success('Request submitted successfully!');
        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
                <Card padding="lg" className="max-w-md w-full text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon name="lock" className="text-primary" size="lg" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Login Required
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Please sign in to submit an adoption interest request.
                    </p>
                    <Link href="/login?redirect=/adoption-interest">
                        <Button icon="login" className="w-full">
                            Sign In to Continue
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
                <Card padding="lg" className="max-w-md w-full text-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                        <Icon name="check_circle" className="text-emerald-600" size="xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Request Submitted!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Thank you for your interest. An NGO representative will review your request and contact you within 5-7 business days.
                    </p>
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Reference ID</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">{requestId}</p>
                    </div>
                    <Link href="/">
                        <Button variant="secondary" icon="home" className="w-full">
                            Return Home
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Badge variant="primary" className="mb-4">
                        <Icon name="favorite" size="sm" className="mr-1" />
                        Privacy-First Adoption
                    </Badge>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Adoption Interest Request
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Submit your interest and a verified NGO will contact you directly. No child data is publicly displayed.
                    </p>
                </div>

                {/* Info Banner */}
                <Card padding="md" className="mb-6 border-l-4 border-primary bg-primary/5">
                    <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                            <Icon name="info" className="text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">How It Works</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                This keeps it legal & ethical. Your information is shared only with verified agencies. All decisions are made by humans, not algorithms.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Form */}
                <Card padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* NGO Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                <Icon name="business" className="text-primary" size="sm" />
                                Select NGO *
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Choose a verified NGO to receive your adoption interest request.
                            </p>
                            {loadingNgos ? (
                                <div className="p-4 text-center text-gray-500">Loading NGOs...</div>
                            ) : (
                                <select
                                    value={formData.ngoId}
                                    onChange={(e) => setFormData({ ...formData, ngoId: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="">-- Select an NGO --</option>
                                    {ngos.map((ngo) => (
                                        <option key={ngo.id} value={ngo.id}>
                                            {ngo.name} - {ngo.location}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {ngos.length === 0 && !loadingNgos && (
                                <p className="text-sm text-amber-600 mt-2">
                                    No verified NGOs available. Please check back later.
                                </p>
                            )}
                        </div>

                        {/* Age Preference */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                <Icon name="cake" className="text-primary" size="sm" />
                                Age Preference
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Minimum Age</label>
                                    <select
                                        value={formData.minAge}
                                        onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Any</option>
                                        <option value="0">0 (Infant)</option>
                                        <option value="1">1 year</option>
                                        <option value="2">2 years</option>
                                        <option value="3">3 years</option>
                                        <option value="5">5 years</option>
                                        <option value="8">8+ years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Maximum Age</label>
                                    <select
                                        value={formData.maxAge}
                                        onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Any</option>
                                        <option value="2">2 years</option>
                                        <option value="5">5 years</option>
                                        <option value="8">8 years</option>
                                        <option value="12">12 years</option>
                                        <option value="18">18 years</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                <Icon name="location_on" className="text-primary" size="sm" />
                                Your Location *
                            </label>
                            <input
                                type="text"
                                placeholder="City, State (e.g., Mumbai, Maharashtra)"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500"
                                required
                            />
                        </div>

                        {/* Special Care Willingness */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                <Icon name="accessibility_new" className="text-primary" size="sm" />
                                Willingness for Special Care
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                Are you open to adopting a child with special needs or medical conditions?
                            </p>
                            <div className="flex gap-3">
                                {(['yes', 'no', 'maybe'] as const).map((option) => (
                                    <label key={option} className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="specialCare"
                                            value={option}
                                            checked={formData.specialCare === option}
                                            onChange={() => setFormData({ ...formData, specialCare: option })}
                                            className="peer hidden"
                                        />
                                        <div className={cn(
                                            'flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all',
                                            formData.specialCare === option
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-200 dark:border-gray-700'
                                        )}>
                                            <Icon
                                                name={option === 'yes' ? 'check_circle' : option === 'no' ? 'cancel' : 'help'}
                                                size="sm"
                                                className={option === 'yes' ? 'text-emerald-600' : option === 'no' ? 'text-red-500' : 'text-amber-500'}
                                            />
                                            <span className="font-medium capitalize">{option}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Family Details */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                <Icon name="family_restroom" className="text-primary" size="sm" />
                                Family Details *
                            </label>
                            <textarea
                                placeholder="Tell us about your family: marital status, other children, home environment, occupation..."
                                value={formData.familyDetails}
                                onChange={(e) => setFormData({ ...formData, familyDetails: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                This helps NGOs understand your family situation. Detailed verification happens later.
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                                <Icon name="contact_mail" className="text-primary" size="sm" />
                                Contact Information
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Consent Checkbox */}
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    checked={formData.consent}
                                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                                    required
                                />
                                <label htmlFor="consent" className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Consent Required:</strong> I understand that this is an interest form only. The NGO and platform administrators will review my request and contact me if my profile is suitable. I consent to share this information with the selected registered adoption agency. All adoption decisions are made by qualified humans, not automated systems.
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            icon={isSubmitting ? 'sync' : 'send'}
                            disabled={isSubmitting || !formData.consent || ngos.length === 0}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Interest Request'}
                        </Button>
                    </form>
                </Card>

                {/* Process Flow */}
                <Card padding="lg" className="mt-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Icon name="timeline" className="text-primary" />
                        What happens next?
                    </h3>
                    <div className="space-y-3">
                        {[
                            { step: '1', text: 'You submit the Adoption Interest Form' },
                            { step: '2', text: 'NGO and Admin receive notification and review your request' },
                            { step: '3', text: 'NGO decides whether to proceed (human-controlled decision)' },
                            { step: '✓', text: 'If approved, you\'ll be contacted for next steps', success: true },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className={cn(
                                    'flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold',
                                    item.success
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                        : 'bg-primary/10 text-primary'
                                )}>
                                    {item.step}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default AdoptionInterestForm;
