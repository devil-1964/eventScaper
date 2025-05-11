import { useState } from 'react';
import { CalendarIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline';
import EmailModal from './EmailModal';

const EventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-bold text-xl">{event.title}</h3>
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-gray-600 mb-4 line-clamp-2">{event.summary || event.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <CalendarIcon className="h-4 w-4 mr-2 text-purple-500" />
          <span>{formatDate(event.dates.first)} - {formatDate(event.dates.last)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <MapPinIcon className="h-4 w-4 mr-2 text-purple-500" />
          <span>{event.location.venue}</span>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-600 transition-all flex items-center justify-center"
        >
          <TicketIcon className="h-5 w-5 mr-2" />
          Get Tickets
        </button>
      </div>
      
      {showModal && (
        <EmailModal 
          onClose={() => setShowModal(false)} 
          eventUrl={event.url}
        />
      )}
    </div>
  );
};

export default EventCard;