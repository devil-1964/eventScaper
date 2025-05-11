import EventCard from './EventCard';
import LoadingSpinner from './LoadingSpinner';

const EventList = ({ events, loading, error }) => {
  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md inline-block max-w-sm mx-auto transition-all transform hover:scale-105">
        <p className="font-semibold">Error loading events:</p>
        <p>{error}</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-3 bg-gray-200 rounded-lg shadow-md text-gray-700 hover:bg-gray-300 transition-all transform hover:scale-105"
      >
        Try Again
      </button>
    </div>
  );

  if (!events?.data?.length) return (
    <div className="text-center py-12">
      <div className="bg-purple-100 text-purple-700 p-6 rounded-lg shadow-md inline-block max-w-sm mx-auto transition-all transform hover:scale-105">
        <p className="font-semibold">No events found matching your search</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 px-4">
      {events.data.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
