import { useState } from 'react';
import useFetchEvents from '../hooks/useFetchEvents';
import EventList from '../components/EventList';

const API_URL = import.meta.env.VITE_API_URL;

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error, refetch } = useFetchEvents(`${API_URL}/events`);

  const filteredEvents = data?.data
    ? {
      ...data,
      data: data.data.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upcoming Events in Sydney </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing events happening near you
          </p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <EventList
          events={filteredEvents || data}
          loading={loading}
          error={error}
        />

        {!loading && data?.last_updated && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Last updated: {new Date(data.last_updated).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;