/**
 * NGO Directory Page Component
 * 
 * Public page displaying verified NGOs with search and filter capabilities.
 * Features "NGO Near Me" location-based filtering.
 * No child photos or personal data shown publicly.
 * Only approved NGOs are displayed - fetched from Firestore.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface NGOCoordinates {
    lat: number;
    lng: number;
}

interface NGO {
    id: string;
    userId: string;
    name: string;
    location: string;
    coordinates?: NGOCoordinates;
    type: 'adoption' | 'child_care' | 'welfare';
    description?: string;
    status: string;
    distance?: number; // Calculated distance in km
}

interface UserLocation {
    lat: number;
    lng: number;
}

const typeLabels = {
    adoption: { label: 'Adoption', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    child_care: { label: 'Child Care', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    welfare: { label: 'Welfare', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
};

const typeIcons = {
    adoption: 'family_restroom',
    child_care: 'child_care',
    welfare: 'volunteer_activism',
};

// Demo coordinates for NGOs (in production, these would be stored in Firestore)
const demoCoordinates: Record<string, NGOCoordinates> = {
    'Mumbai, Maharashtra': { lat: 19.0760, lng: 72.8777 },
    'Delhi, India': { lat: 28.6139, lng: 77.2090 },
    'Bangalore, Karnataka': { lat: 12.9716, lng: 77.5946 },
    'Chennai, Tamil Nadu': { lat: 13.0827, lng: 80.2707 },
    'Kolkata, West Bengal': { lat: 22.5726, lng: 88.3639 },
    'Hyderabad, Telangana': { lat: 17.3850, lng: 78.4867 },
    'Pune, Maharashtra': { lat: 18.5204, lng: 73.8567 },
    'Ahmedabad, Gujarat': { lat: 23.0225, lng: 72.5714 },
    'Jaipur, Rajasthan': { lat: 26.9124, lng: 75.7873 },
    'Lucknow, Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

/**
 * Format distance for display
 */
function formatDistance(distance: number): string {
    if (distance < 1) {
        return 'Less than 1 km';
    }
    return `${distance} km away`;
}

export function NGODirectoryPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [ngos, setNgos] = useState<NGO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [showContactModal, setShowContactModal] = useState<NGO | null>(null);
    const [contactMessage, setContactMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Location-based state
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [sortByDistance, setSortByDistance] = useState(false);
    const [maxDistance, setMaxDistance] = useState<number | null>(null); // in km

    // Get user's location
    const getUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setSortByDistance(true);
                setLocationLoading(false);
                toast.success('Location found! Showing NGOs near you.');
            },
            (error) => {
                setLocationLoading(false);
                let errorMessage = 'Unable to get your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Please allow location access to find NGOs near you';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }
                setLocationError(errorMessage);
                toast.error(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes cache
            }
        );
    }, []);

    // Clear location filter
    const clearLocationFilter = useCallback(() => {
        setSortByDistance(false);
        setMaxDistance(null);
    }, []);

    // Fetch approved NGOs from Firestore
    useEffect(() => {
        const q = query(
            collection(db, COLLECTIONS.NGOS),
            where('status', '==', 'approved')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ngoList: NGO[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                const ngo: NGO = {
                    id: doc.id,
                    ...data,
                    // Use stored coordinates or fallback to demo coordinates
                    coordinates: data.coordinates || demoCoordinates[data.location] || null,
                } as NGO;
                ngoList.push(ngo);
            });
            setNgos(ngoList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching NGOs:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Calculate distances when user location is available
    const ngosWithDistance = React.useMemo(() => {
        if (!userLocation) return ngos;

        return ngos.map(ngo => {
            if (ngo.coordinates) {
                const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    ngo.coordinates.lat,
                    ngo.coordinates.lng
                );
                return { ...ngo, distance };
            }
            return ngo;
        });
    }, [ngos, userLocation]);

    // Filter and sort NGOs
    const filteredNGOs = React.useMemo(() => {
        let result = ngosWithDistance.filter(ngo => {
            const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ngo.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = !selectedType || ngo.type === selectedType;
            const matchesDistance = !maxDistance || (ngo.distance !== undefined && ngo.distance <= maxDistance);
            return matchesSearch && matchesType && matchesDistance;
        });

        // Sort by distance if enabled
        if (sortByDistance && userLocation) {
            result = [...result].sort((a, b) => {
                if (a.distance === undefined) return 1;
                if (b.distance === undefined) return -1;
                return a.distance - b.distance;
            });
        }

        return result;
    }, [ngosWithDistance, searchQuery, selectedType, sortByDistance, userLocation, maxDistance]);

    const handleContactRequest = async () => {
        if (!showContactModal) return;

        if (!isAuthenticated) {
            router.push('/login?redirect=/ngo-directory');
            return;
        }

        if (!contactMessage.trim()) {
            toast.error('Please enter a message');
            return;
        }

        setSubmitting(true);
        try {
            await addDoc(collection(db, COLLECTIONS.CONTACT_REQUESTS), {
                userId: user?.uid,
                userEmail: user?.email,
                userName: user?.displayName,
                ngoId: showContactModal.id,
                ngoUserId: showContactModal.userId,
                ngoName: showContactModal.name,
                message: contactMessage.trim(),
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            toast.success('Contact request sent successfully!');
            setShowContactModal(null);
            setContactMessage('');
        } catch (error) {
            console.error('Error sending contact request:', error);
            toast.error('Failed to send request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                NGO Directory
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Find verified organizations for adoption, child care, and welfare services
                            </p>
                        </div>
                        <Badge variant="success" className="flex items-center gap-1.5">
                            <Icon name="public" size="sm" />
                            Public
                        </Badge>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search NGOs by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {/* Near Me Button */}
                            <button
                                onClick={sortByDistance ? clearLocationFilter : getUserLocation}
                                disabled={locationLoading}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                                    sortByDistance
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
                                    locationLoading && 'opacity-70 cursor-wait'
                                )}
                            >
                                <Icon
                                    name={locationLoading ? 'sync' : 'my_location'}
                                    size="sm"
                                    className={locationLoading ? 'animate-spin' : ''}
                                />
                                {locationLoading ? 'Locating...' : sortByDistance ? 'Near Me ✓' : 'Near Me'}
                            </button>

                            <button
                                onClick={() => setSelectedType(null)}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                    !selectedType
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                )}
                            >
                                All
                            </button>
                            {Object.entries(typeLabels).map(([key, { label }]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedType(key)}
                                    className={cn(
                                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                        selectedType === key
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Distance Filter (shown when location is available) */}
                    {userLocation && sortByDistance && (
                        <div className="flex items-center gap-4 mt-4 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                            <Icon name="near_me" className="text-primary" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Filter by distance:</span>
                            <div className="flex gap-2 flex-wrap">
                                {[10, 25, 50, 100, null].map((distance) => (
                                    <button
                                        key={distance ?? 'all'}
                                        onClick={() => setMaxDistance(distance)}
                                        className={cn(
                                            'px-3 py-1 rounded-full text-xs font-medium transition-all',
                                            maxDistance === distance
                                                ? 'bg-primary text-white'
                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        )}
                                    >
                                        {distance ? `${distance} km` : 'Any'}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={clearLocationFilter}
                                className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <Icon name="close" size="sm" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                    <Icon name="info" className="text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        No child photos or personal data shown publicly. Contact NGOs through secure request forms.
                    </p>
                </div>
            </div>

            {/* Location Error Notice */}
            {locationError && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50">
                        <Icon name="location_off" className="text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-800 dark:text-red-300">{locationError}</p>
                        <button
                            onClick={() => setLocationError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <Icon name="close" size="sm" />
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                </div>
            )}

            {/* NGO Grid */}
            {!loading && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Results count */}
                    {sortByDistance && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Showing {filteredNGOs.length} NGO{filteredNGOs.length !== 1 ? 's' : ''}
                            {maxDistance ? ` within ${maxDistance} km` : ''} sorted by distance
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNGOs.map((ngo) => (
                            <Card
                                key={ngo.id}
                                padding="lg"
                                className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn(
                                        'flex items-center justify-center h-12 w-12 rounded-xl',
                                        ngo.type === 'adoption' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
                                        ngo.type === 'child_care' && 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
                                        ngo.type === 'welfare' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
                                    )}>
                                        <Icon name={typeIcons[ngo.type]} size="lg" />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', typeLabels[ngo.type].color)}>
                                            {typeLabels[ngo.type].label}
                                        </span>
                                        {/* Distance Badge */}
                                        {ngo.distance !== undefined && sortByDistance && (
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary/20 to-secondary/20 text-primary dark:text-primary-light flex items-center gap-1">
                                                <Icon name="near_me" size="sm" />
                                                {formatDistance(ngo.distance)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {ngo.name}
                                </h3>

                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                                    <Icon name="location_on" size="sm" />
                                    <span>{ngo.location}</span>
                                </div>

                                {ngo.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-2">
                                        {ngo.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs mb-4">
                                    <Icon name="verified" size="sm" />
                                    <span className="font-medium">Verified Organization</span>
                                </div>

                                <Button
                                    variant="secondary"
                                    className="w-full group-hover:bg-primary group-hover:text-white"
                                    icon="mail"
                                    onClick={() => setShowContactModal(ngo)}
                                >
                                    Contact Request
                                </Button>
                            </Card>
                        ))}
                    </div>

                    {filteredNGOs.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <Icon name={sortByDistance ? 'location_off' : 'search_off'} size="2xl" className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                {sortByDistance && maxDistance
                                    ? `No NGOs found within ${maxDistance} km. Try increasing the distance.`
                                    : 'No NGOs found matching your criteria'}
                            </p>
                            {sortByDistance && maxDistance && (
                                <Button
                                    variant="secondary"
                                    className="mt-4"
                                    onClick={() => setMaxDistance(null)}
                                >
                                    Show All Distances
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Footer Notice */}
            <div className="border-t border-gray-200 dark:border-gray-800 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                        <Icon name="verified_user" size="sm" />
                        All NGOs are verified and accredited. No personal data is shared publicly.
                    </p>
                </div>
            </div>

            {/* Contact Request Modal */}
            {showContactModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card padding="lg" className="max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Contact {showContactModal.name}
                            </h3>
                            <button
                                onClick={() => setShowContactModal(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                                <Icon name="close" />
                            </button>
                        </div>

                        {/* Show distance in modal if available */}
                        {showContactModal.distance !== undefined && sortByDistance && (
                            <div className="flex items-center gap-2 text-sm text-primary dark:text-primary-light mb-4 p-2 bg-primary/10 rounded-lg">
                                <Icon name="near_me" size="sm" />
                                <span>{formatDistance(showContactModal.distance)} from your location</span>
                            </div>
                        )}

                        {!isAuthenticated ? (
                            <div className="text-center py-4">
                                <Icon name="lock" size="2xl" className="text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Please sign in to send a contact request.
                                </p>
                                <Button onClick={() => router.push('/login?redirect=/ngo-directory')}>
                                    Sign In to Continue
                                </Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Your contact request will be sent securely. The NGO will respond within 3-5 business days.
                                </p>
                                <textarea
                                    placeholder="Write a brief message about your inquiry..."
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                                    rows={4}
                                />
                                <div className="flex gap-3 mt-4">
                                    <Button
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => setShowContactModal(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        icon="send"
                                        onClick={handleContactRequest}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Sending...' : 'Send Request'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}

export default NGODirectoryPage;
