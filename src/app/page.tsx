'use client';

import { useState } from 'react';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Simple venue interface
interface SimpleVenue {
  id: number;
  name: string;
  city: string;
  capacity: number;
  venueType: string;
}

// Simple venue data
const simpleVenues: SimpleVenue[] = [
  {
    id: 1,
    name: "The Fillmore",
    city: "San Francisco",
    capacity: 1200,
    venueType: "Concert Hall"
  },
  {
    id: 2,
    name: "Red Rocks Amphitheatre",
    city: "Denver",
    capacity: 9525,
    venueType: "Outdoor Amphitheatre"
  },
  {
    id: 3,
    name: "The Troubadour",
    city: "Los Angeles",
    capacity: 500,
    venueType: "Club"
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedVenue, setSelectedVenue] = useState<SimpleVenue | null>(null);

  const cities = ["All Cities", "San Francisco", "Denver", "Los Angeles"];

  const filteredVenues = simpleVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All Cities' || venue.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const handleVenueClick = (venue: SimpleVenue) => {
    setSelectedVenue(venue);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Music className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Music Venue Finder</h1>
                <p className="text-sm text-gray-600">Find the perfect venue for your artists</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Venues
                </label>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by venue name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by City
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
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card
              key={venue.id}
              onClick={() => handleVenueClick(venue)}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="text-xl">{venue.name}</CardTitle>
                <CardDescription>{venue.city}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Capacity: {venue.capacity.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Type: {venue.venueType}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Venue Modal */}
        {selectedVenue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedVenue.name}</h2>
              <p className="text-gray-600 mb-2">City: {selectedVenue.city}</p>
              <p className="text-gray-600 mb-2">Capacity: {selectedVenue.capacity.toLocaleString()}</p>
              <p className="text-gray-600 mb-4">Type: {selectedVenue.venueType}</p>
              <Button
                onClick={() => setSelectedVenue(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
