'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, MapPin, Users, Star, Music, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchOSMVenues, searchOSMVenues, OSMVenue } from './lib/osmService';

// Music venue interface
interface Venue {
  id: number;
  name: string;
  city: string;
  country: string;
  capacity: number;
  price: string;
  rating: number;
  image: string;
  amenities: string[];
  venueType: string;
  stageSize: string;
  loadIn: string;
  lat: number;
  lon: number;
}

// Sample music venue data
const musicVenues: Venue[] = [
  {
    id: 1,
    name: "The Fillmore",
    city: "San Francisco",
    country: "USA",
    capacity: 1200,
    price: "$8,500",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    amenities: ["Professional Sound", "Lighting Rig", "Green Room", "Merch Table", "Bar"],
    venueType: "Concert Hall",
    stageSize: "40' x 20'",
    loadIn: "Street level",
    lat: 37.7849,
    lon: -122.4094
  },
  {
    id: 2,
    name: "Red Rocks Amphitheatre",
    city: "Denver",
    country: "USA",
    capacity: 9525,
    price: "$25,000",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    amenities: ["Natural Acoustics", "Mountain Views", "VIP Areas", "Food Trucks", "Parking"],
    venueType: "Outdoor Amphitheatre",
    stageSize: "60' x 40'",
    loadIn: "Truck access",
    lat: 39.6653,
    lon: -105.2056
  },
  {
    id: 3,
    name: "The Troubadour",
    city: "Los Angeles",
    country: "USA",
    capacity: 500,
    price: "$3,200",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    amenities: ["Intimate Setting", "Historic Venue", "Sound System", "Bar", "Green Room"],
    venueType: "Club",
    stageSize: "20' x 15'",
    loadIn: "Alley access",
    lat: 34.0736,
    lon: -118.4004
  },
  {
    id: 4,
    name: "Madison Square Garden",
    city: "New York",
    country: "USA",
    capacity: 20789,
    price: "$150,000",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1571266028243-e68f8570c0e5?w=400&h=300&fit=crop",
    amenities: ["World-Class Sound", "Full Production", "VIP Suites", "Catering", "Security"],
    venueType: "Arena",
    stageSize: "80' x 60'",
    loadIn: "Loading dock",
    lat: 40.7505,
    lon: -73.9934
  },
  {
    id: 5,
    name: "The Roxy Theatre",
    city: "Los Angeles",
    country: "USA",
    capacity: 400,
    price: "$2,800",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop",
    amenities: ["Professional Lighting", "Sound System", "Bar", "Dressing Room", "Merch Area"],
    venueType: "Theatre",
    stageSize: "25' x 18'",
    loadIn: "Street level",
    lat: 34.0908,
    lon: -118.3856
  },
  {
    id: 6,
    name: "House of Blues",
    city: "Chicago",
    country: "USA",
    capacity: 1000,
    price: "$5,500",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    amenities: ["Full Production", "Restaurant", "VIP Lounge", "Sound System", "Parking"],
    venueType: "Music Hall",
    stageSize: "30' x 20'",
    loadIn: "Loading dock",
    lat: 41.8781,
    lon: -87.6298
  }
];

const cities = ["All Cities", "New York", "Los Angeles", "San Francisco", "Chicago", "Denver"];
const venueTypes = ["All Types", "Concert Hall", "Arena", "Club", "Theatre", "Music Hall", "Outdoor Amphitheatre"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedVenueType, setSelectedVenueType] = useState('All Types');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [osmVenues, setOsmVenues] = useState<OSMVenue[]>([]);
  const [isLoadingOSM, setIsLoadingOSM] = useState(false);
  const [useOSMData, setUseOSMData] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadOSMVenues = useCallback(async (city: string) => {
    if (!isClient) return;
    
    console.log('Loading OSM venues for city:', city);
    setIsLoadingOSM(true);
    try {
      const venues = await fetchOSMVenues(city, 15);
      console.log('OSM venues received:', venues);
      setOsmVenues(venues);
    } catch (error) {
      console.error('Error loading OSM venues:', error);
      setOsmVenues([]);
    } finally {
      setIsLoadingOSM(false);
    }
  }, [isClient]);

  const loadDefaultOSMVenues = useCallback(async () => {
    if (!isClient) return;
    
    console.log('Loading default OSM venues');
    setIsLoadingOSM(true);
    try {
      // Try to load venues from major cities, but if that fails, use hardcoded fallbacks
      let allVenues: OSMVenue[] = [];
      
      try {
        const [nycVenues, laVenues, chicagoVenues] = await Promise.all([
          fetchOSMVenues('New York', 3),
          fetchOSMVenues('Los Angeles', 3),
          fetchOSMVenues('Chicago', 3)
        ]);
        
        allVenues = [...nycVenues, ...laVenues, ...chicagoVenues];
        console.log('OSM API venues received:', allVenues);
      } catch (apiError) {
        console.log('OSM API failed, using hardcoded fallbacks:', apiError);
        // Use hardcoded fallback venues
        allVenues = [
          {
            id: 1001,
            name: 'Madison Square Garden',
            city: 'New York',
            country: 'USA',
            capacity: 20789,
            venueType: 'Arena',
            lat: 40.7505,
            lon: -73.9934,
            address: '4 Pennsylvania Plaza, New York, NY',
            amenities: ['World-Class Sound', 'Full Production', 'VIP Suites'],
            image: 'https://images.unsplash.com/photo-1571266028243-e68f8570c0e5?w=400&h=300&fit=crop',
            rating: 4.9,
            price: '$150,000',
            stageSize: '80\' x 60\'',
            loadIn: 'Loading dock'
          },
          {
            id: 1002,
            name: 'Radio City Music Hall',
            city: 'New York',
            country: 'USA',
            capacity: 6010,
            venueType: 'Concert Hall',
            lat: 40.7600,
            lon: -73.9798,
            address: '1260 6th Ave, New York, NY',
            amenities: ['Historic Venue', 'Professional Sound', 'Seating'],
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            rating: 4.8,
            price: '$25,000',
            stageSize: '60\' x 40\'',
            loadIn: 'Loading dock'
          },
          {
            id: 2001,
            name: 'Hollywood Bowl',
            city: 'Los Angeles',
            country: 'USA',
            capacity: 17500,
            venueType: 'Outdoor Amphitheatre',
            lat: 34.1122,
            lon: -118.3394,
            address: '2301 N Highland Ave, Los Angeles, CA',
            amenities: ['Natural Acoustics', 'Mountain Views', 'Food Trucks'],
            image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
            rating: 4.7,
            price: '$35,000',
            stageSize: '70\' x 50\'',
            loadIn: 'Truck access'
          },
          {
            id: 3001,
            name: 'United Center',
            city: 'Chicago',
            country: 'USA',
            capacity: 23500,
            venueType: 'Arena',
            lat: 41.8807,
            lon: -87.6742,
            address: '1901 W Madison St, Chicago, IL',
            amenities: ['World-Class Sound', 'Full Production', 'VIP Areas'],
            image: 'https://images.unsplash.com/photo-1571266028243-e68f8570c0e5?w=400&h=300&fit=crop',
            rating: 4.8,
            price: '$200,000',
            stageSize: '100\' x 80\'',
            loadIn: 'Loading dock'
          }
        ];
      }
      
      console.log('Final venues to set:', allVenues);
      setOsmVenues(allVenues);
    } catch (error) {
      console.error('Error loading default OSM venues:', error);
      setOsmVenues([]);
    } finally {
      setIsLoadingOSM(false);
    }
  }, [isClient]);

  // Load OSM venues when city changes or when switching to OSM mode
  useEffect(() => {
    console.log('OSM useEffect triggered:', { useOSMData, isClient, selectedCity });
    if (useOSMData && isClient) {
      if (selectedCity !== 'All Cities') {
        console.log('Loading OSM venues for specific city:', selectedCity);
        loadOSMVenues(selectedCity);
      } else {
        console.log('Loading default OSM venues');
        // Load some default venues when OSM mode is selected but no city chosen
        loadDefaultOSMVenues();
      }
    }
  }, [selectedCity, useOSMData, isClient, loadOSMVenues, loadDefaultOSMVenues]);

  const handleSearchOSM = async () => {
    if (!isClient || !searchTerm.trim()) return;
    
    setIsLoadingOSM(true);
    try {
      const venues = await searchOSMVenues(searchTerm, 20);
      setOsmVenues(venues);
      setUseOSMData(true);
    } catch (error) {
      console.error('Error searching OSM venues:', error);
      setOsmVenues([]);
    } finally {
      setIsLoadingOSM(false);
    }
  };

  // Convert OSMVenue to Venue for display
  const convertOSMToVenue = (osmVenue: OSMVenue): Venue => ({
    id: osmVenue.id,
    name: osmVenue.name,
    city: osmVenue.city,
    country: osmVenue.country,
    capacity: osmVenue.capacity || 500,
    price: osmVenue.price || 'Contact for pricing',
    rating: osmVenue.rating || 4.0,
    image: osmVenue.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    amenities: osmVenue.amenities,
    venueType: osmVenue.venueType,
    stageSize: osmVenue.stageSize || 'Contact for details',
    loadIn: osmVenue.loadIn || 'Contact for details',
    lat: osmVenue.lat,
    lon: osmVenue.lon
  });

  // Get current venues (OSM or sample data)
  const currentVenues = useOSMData 
    ? (osmVenues.length > 0 ? osmVenues.map(convertOSMToVenue) : [])
    : musicVenues;
  
  console.log('Current state:', { useOSMData, osmVenuesLength: osmVenues.length, currentVenuesLength: currentVenues.length });

  const filteredVenues = currentVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || venue.city === selectedCity;
    const matchesVenueType = selectedVenueType === 'All Types' || venue.venueType === selectedVenueType;
    const matchesCapacity = !capacityFilter || venue.capacity >= parseInt(capacityFilter);
    
    return matchesSearch && matchesCity && matchesVenueType && matchesCapacity;
  });

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Music className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Music Venue Finder</h1>
                <p className="text-sm text-gray-600">Find the perfect venue for your artists</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              For Band Agents
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Discover Music Venues</h2>
          <p className="text-xl mb-8">Find the perfect concert halls, clubs, and arenas for your artists&apos; next performance</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search & Filter Venues
              </CardTitle>
              <CardDescription>
                Find venues by name, location, type, and capacity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Venues
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by venue name..."
                    />
                    <Button
                      onClick={handleSearchOSM}
                      disabled={isLoadingOSM || !searchTerm.trim()}
                      size="icon"
                      variant="outline"
                    >
                      {isLoadingOSM ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Type
                  </label>
                  <Select value={selectedVenueType} onValueChange={setSelectedVenueType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {venueTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Capacity
                  </label>
                  <Input
                    type="number"
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
              
              {/* Data Source Toggle */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Data Source</h4>
                    <p className="text-xs text-gray-500">
                      {useOSMData ? 'Using OpenStreetMap data' : 'Using sample venue data'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={!useOSMData ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        console.log('Switching to Sample Data');
                        setUseOSMData(false);
                      }}
                    >
                      Sample Data
                    </Button>
                    <Button
                      variant={useOSMData ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        console.log('Switching to OpenStreetMap');
                        setUseOSMData(true);
                      }}
                    >
                      OpenStreetMap
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredVenues.length} Venues Found
            </h3>
            {isLoadingOSM && (
              <div className="flex items-center text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm">Loading from OpenStreetMap...</span>
              </div>
            )}
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{venue.rating}</span>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{venue.name}</CardTitle>
                  <span className="text-lg font-bold text-blue-600">{venue.price}</span>
                </div>
                <CardDescription className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {venue.city}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center text-gray-600 mb-2">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Capacity: {venue.capacity.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">{venue.venueType}</span> • Stage: {venue.stageSize}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {venue.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {venue.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{venue.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              
              <CardContent>
                <Button
                  onClick={() => handleVenueClick(venue)}
                  className="w-full"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Music Venue Finder</h3>
            <p className="text-gray-400 mb-6">
              Helping band agents find the perfect venues for their artists&apos; performances
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">About</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Venue Modal */}
      {isModalOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedVenue.name}</h2>
              <Button
                onClick={handleCloseModal}
                variant="ghost"
                size="icon"
              >
                ×
              </Button>
            </div>

            <div className="p-6">
              {/* Image */}
              <div className="h-64 bg-gray-200 rounded-lg mb-6 relative overflow-hidden">
                <Image
                  src={selectedVenue.image}
                  alt={selectedVenue.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{selectedVenue.rating}</span>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Venue Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{selectedVenue.city}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Capacity: {selectedVenue.capacity.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {selectedVenue.venueType}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Stage Size:</span> {selectedVenue.stageSize}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Load-in:</span> {selectedVenue.loadIn}
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mt-3">
                      {selectedVenue.price}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact & Booking */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Booking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Contact Venue
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
