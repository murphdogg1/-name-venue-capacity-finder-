'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, MapPin, Users, Star, Filter, RefreshCw, Music, Calendar } from 'lucide-react';
import VenueModal from './components/VenueModal';
import { fetchOSMVenues, searchOSMVenues, OSMVenue } from './lib/osmService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Music venue data for band agents
const musicVenues = [
  {
    id: 1,
    name: "The Fillmore",
    city: "San Francisco",
    capacity: 1200,
    price: "$8,500",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    amenities: ["Professional Sound", "Lighting Rig", "Green Room", "Merch Table", "Bar"],
    venueType: "Concert Hall",
    stageSize: "40' x 20'",
    loadIn: "Street level"
  },
  {
    id: 2,
    name: "Red Rocks Amphitheatre",
    city: "Denver",
    capacity: 9525,
    price: "$25,000",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    amenities: ["Natural Acoustics", "Mountain Views", "VIP Areas", "Food Trucks", "Parking"],
    venueType: "Outdoor Amphitheatre",
    stageSize: "60' x 40'",
    loadIn: "Truck access"
  },
  {
    id: 3,
    name: "The Troubadour",
    city: "Los Angeles",
    capacity: 500,
    price: "$3,200",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    amenities: ["Intimate Setting", "Historic Venue", "Sound System", "Bar", "Green Room"],
    venueType: "Club",
    stageSize: "20' x 15'",
    loadIn: "Alley access"
  },
  {
    id: 4,
    name: "Madison Square Garden",
    city: "New York",
    capacity: 20789,
    price: "$150,000",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1571266028243-e68f8570c0e5?w=400&h=300&fit=crop",
    amenities: ["World-Class Sound", "Full Production", "VIP Suites", "Catering", "Security"],
    venueType: "Arena",
    stageSize: "80' x 60'",
    loadIn: "Loading dock"
  },
  {
    id: 5,
    name: "The Roxy Theatre",
    city: "Los Angeles",
    capacity: 400,
    price: "$2,800",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop",
    amenities: ["Professional Lighting", "Sound System", "Bar", "Dressing Room", "Merch Area"],
    venueType: "Theatre",
    stageSize: "25' x 18'",
    loadIn: "Street level"
  },
  {
    id: 6,
    name: "House of Blues",
    city: "Chicago",
    capacity: 1000,
    price: "$5,500",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    amenities: ["Full Production", "Restaurant", "VIP Lounge", "Sound System", "Parking"],
    venueType: "Music Hall",
    stageSize: "30' x 20'",
    loadIn: "Loading dock"
  },
  {
    id: 7,
    name: "The Bowery Ballroom",
    city: "New York",
    capacity: 575,
    price: "$4,200",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571266028243-e68f8570c0e5?w=400&h=300&fit=crop",
    amenities: ["Intimate Venue", "Great Acoustics", "Bar", "Green Room", "Merch Table"],
    venueType: "Ballroom",
    stageSize: "22' x 16'",
    loadIn: "Street level"
  },
  {
    id: 8,
    name: "The Gorge Amphitheatre",
    city: "George, WA",
    capacity: 27500,
    price: "$45,000",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    amenities: ["Stunning Views", "Full Production", "Camping", "Food Vendors", "VIP Areas"],
    venueType: "Outdoor Amphitheatre",
    stageSize: "70' x 50'",
    loadIn: "Truck access"
  }
];

const cities = ["All Cities", "New York", "Los Angeles", "San Francisco", "Chicago", "Denver", "George, WA"];
const venueTypes = ["All Types", "Concert Hall", "Arena", "Club", "Theatre", "Music Hall", "Ballroom", "Outdoor Amphitheatre"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedVenueType, setSelectedVenueType] = useState('All Types');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [osmVenues, setOsmVenues] = useState<OSMVenue[]>([]);
  const [isLoadingOSM, setIsLoadingOSM] = useState(false);
  const [useOSMData, setUseOSMData] = useState(false);

  // Load OSM venues when city changes
  useEffect(() => {
    if (selectedCity !== 'All Cities' && useOSMData) {
      loadOSMVenues(selectedCity);
    }
  }, [selectedCity, useOSMData]);

  const loadOSMVenues = async (city: string) => {
    setIsLoadingOSM(true);
    try {
      const venues = await fetchOSMVenues(city, 15);
      setOsmVenues(venues);
    } catch (error) {
      console.error('Error loading OSM venues:', error);
    } finally {
      setIsLoadingOSM(false);
    }
  };

  const handleSearchOSM = async () => {
    if (searchTerm.trim()) {
      setIsLoadingOSM(true);
      try {
        const venues = await searchOSMVenues(searchTerm, 20);
        setOsmVenues(venues);
        setUseOSMData(true);
      } catch (error) {
        console.error('Error searching OSM venues:', error);
      } finally {
        setIsLoadingOSM(false);
      }
    }
  };

  const currentVenues = useOSMData ? osmVenues : musicVenues;
  
  const filteredVenues = currentVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || venue.city === selectedCity;
    const matchesVenueType = selectedVenueType === 'All Types' || venue.venueType === selectedVenueType;
    const matchesCapacity = !capacityFilter || venue.capacity >= parseInt(capacityFilter);
    
    return matchesSearch && matchesCity && matchesVenueType && matchesCapacity;
  });

  const handleVenueClick = (venue: OSMVenue) => {
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
                <h1 className="text-2xl font-bold text-gray-900">MusicVenueFinder</h1>
                <p className="text-sm text-gray-500">Find the perfect music venue for your artists</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Calendar className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Find Your Perfect Music Venue</h2>
          <p className="text-xl mb-8">Discover concert halls, clubs, and arenas by capacity, location, and music amenities</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search music venues by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 h-12 text-lg"
                />
              </div>
              <Button
                onClick={handleSearchOSM}
                disabled={isLoadingOSM}
                size="lg"
                className="px-6 h-12"
              >
                {isLoadingOSM ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Search OSM
              </Button>
            </div>
            <p className="text-sm text-blue-100 mt-3 text-center">
              Search real venues from OpenStreetMap database
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedVenueType} onValueChange={setSelectedVenueType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Venue type" />
              </SelectTrigger>
              <SelectContent>
                {venueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={capacityFilter} onValueChange={setCapacityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Capacity</SelectItem>
                <SelectItem value="200">200+ capacity</SelectItem>
                <SelectItem value="500">500+ capacity</SelectItem>
                <SelectItem value="1000">1000+ capacity</SelectItem>
                <SelectItem value="5000">5000+ capacity</SelectItem>
                <SelectItem value="10000">10000+ capacity</SelectItem>
              </SelectContent>
            </Select>
            </div>
            
            {/* Data Source Toggle */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Data Source:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={!useOSMData ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUseOSMData(false)}
                  className="h-8"
                >
                  Sample Data
                </Button>
                <Button
                  variant={useOSMData ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUseOSMData(true)}
                  className="h-8"
                >
                  OpenStreetMap
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {isLoadingOSM ? 'Loading venues...' : `${filteredVenues.length} Venues Found`}
              </h3>
              {useOSMData && (
                <p className="text-sm text-gray-500 mt-1">
                  Powered by OpenStreetMap • Real venue data
                </p>
              )}
            </div>
            {isLoadingOSM && (
              <div className="flex items-center space-x-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Fetching from OSM...</span>
              </div>
            )}
          </div>

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
                    {venue.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button
                    onClick={() => handleVenueClick(venue)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredVenues.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No venues found matching your criteria</div>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">MusicVenueFinder</h3>
            <p className="text-gray-400 mb-6">Find the perfect music venue for your artists&apos; next performance</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Venue Modal */}
      <VenueModal
        venue={selectedVenue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
