'use client';

import Image from 'next/image';
import { X, MapPin, Users, Star, Phone, Mail, Calendar } from 'lucide-react';

interface Venue {
  id: number;
  name: string;
  city: string;
  country: string;
  capacity?: number;
  price?: string;
  rating?: number;
  image?: string;
  amenities: string[];
  venueType: string;
  stageSize?: string;
  loadIn?: string;
  address?: string;
  phone?: string;
  website?: string;
  lat?: number;
  lon?: number;
}

interface VenueModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VenueModal({ venue, isOpen, onClose }: VenueModalProps) {
  if (!isOpen || !venue) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{venue.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Image */}
          <div className="h-64 bg-gray-200 rounded-lg mb-6 relative overflow-hidden">
            <Image
              src={venue.image || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop"}
              alt={venue.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{(venue.rating || 4.0).toFixed(1)}</span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Venue Details</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{venue.address || venue.city}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Capacity: {venue.capacity ? venue.capacity.toLocaleString() : 'Contact for details'}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span> {venue.venueType}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Stage Size:</span> {venue.stageSize || 'Contact for details'}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Load-in:</span> {venue.loadIn || 'Contact for details'}
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-3">
                  {venue.price || 'Contact for pricing'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Music Venue</h3>
            <p className="text-gray-600 leading-relaxed">
              {venue.name} is a {venue.venueType.toLowerCase()} located in {venue.city} with a capacity of {venue.capacity ? venue.capacity.toLocaleString() : 'various sizes'}. 
              This venue offers a {venue.capacity && venue.capacity > 5000 ? 'large-scale' : venue.capacity && venue.capacity > 1000 ? 'mid-size' : 'intimate'} setting perfect for {venue.capacity && venue.capacity > 5000 ? 'major concerts and festivals' : venue.capacity && venue.capacity > 1000 ? 'concerts and live performances' : 'club shows and intimate performances'}. 
              The {venue.stageSize || 'professional'} stage provides ample space for your artists, and the {venue.loadIn || 'convenient'} load-in access makes setup convenient for your crew.
            </p>
          </div>

          {/* Contact & Booking */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Booking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Call Button - always shows */}
              <button 
                onClick={() => {
                  if (venue.phone) {
                    window.location.href = `tel:${venue.phone}`;
                  } else {
                    // Fallback: search for venue phone number
                    const searchQuery = `${venue.name} ${venue.city} phone number`;
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                  }
                }}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{venue.phone ? `Call ${venue.phone}` : 'Find Phone Number'}</span>
              </button>

              {/* Website Button - always shows */}
              <button 
                onClick={() => {
                  if (venue.website) {
                    window.open(venue.website, '_blank', 'noopener,noreferrer');
                  } else {
                    // Fallback: search for venue website
                    const searchQuery = `${venue.name} ${venue.city} official website`;
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                  }
                }}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{venue.website ? 'Visit Website' : 'Find Website'}</span>
              </button>

              {/* Map Button - always shows */}
              <button 
                onClick={() => {
                  if (venue.lat && venue.lon) {
                    window.open(`https://www.google.com/maps?q=${venue.lat},${venue.lon}`, '_blank', 'noopener,noreferrer');
                  } else {
                    // Fallback: search for venue location
                    const searchQuery = `${venue.name} ${venue.city} location`;
                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`, '_blank');
                  }
                }}
                className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>View on Map</span>
              </button>

              {/* Contact Button - always shows */}
              <button 
                onClick={() => {
                  const emailSubject = `Booking Inquiry - ${venue.name}`;
                  const emailBody = `Hello,\n\nI am interested in booking ${venue.name} for a music performance.\n\nVenue Details:\n- Name: ${venue.name}\n- City: ${venue.city}\n- Capacity: ${venue.capacity ? venue.capacity.toLocaleString() : 'Various'}\n- Venue Type: ${venue.venueType}\n\nPlease contact me to discuss availability and pricing.\n\nThank you!`;
                  window.open(`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
                }}
                className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Venue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
