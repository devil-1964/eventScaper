const axios = require("axios");
const NodeCache = require("node-cache");
const { api } = require("../config/apiConfig");

// Create cache with 55-minute TTL (just under our 1-hour cron)
const eventCache = new NodeCache({ stdTTL: 3300, checkperiod: 600 });

class ApiService {
  async fetchAndCacheEvents() {
    try {
      // Check cache first
      const cachedData = eventCache.get("events");
      if (cachedData) {
        console.log("Returning cached event data");
        return cachedData;
      }

      // Fetch fresh data if not in cache
      const response = await axios({
        method: api.method,
        url: api.url,
        headers: api.headers,
        data: api.body,
      });

      // Process and extract important event data
      const processedEvents = this.processEvents(response.data);

      // Store in cache
      eventCache.set("events", processedEvents);

      console.log("Fetched and cached fresh event data");
      return processedEvents;
    } catch (error) {
      console.error("API Request Failed:", error.message);
      throw error;
    }
  }

  processEvents(apiData) {
    const now = new Date();
    return (
      apiData?.hits?.hits?.map((hit) => {
        const source = hit._source;
        const eventDates = source.nested_event_dates?.[0] || [];
        const firstDate = eventDates[0]?.date;
        const lastDate = eventDates[eventDates.length - 1]?.date;

        // Calculate duration in days
        const durationDays =
          firstDate && lastDate
            ? Math.ceil(
                (new Date(lastDate) - new Date(firstDate)) /
                  (1000 * 60 * 60 * 24)
              )
            : null;

        // Extract coordinates if available
        const coordinates = source.coordinates?.[0]?.split(",") || [];
        const latitude = coordinates[0]?.trim();
        const longitude = coordinates[1]?.trim();

        return {
          id: source.product_id?.[0] || hit._id,
          title: source.title?.[0],
          description: source.product_description?.[0],
          summary: source.product_summary?.[0],
          url: source.url?.[0],
          image: source.image?.[0]?.path,
          location: {
            venue: source.owning_organisation_name?.[0],
            coordinates: {
              latitude,
              longitude,
            },
            area: source.area?.[0],
            region: source.region?.[0],
          },
          dates: {
            first: firstDate,
            last: lastDate,
            duration_days: durationDays,
            all_dates: eventDates.map((d) => d.date),
          },
          classification: source.classification?.[0],
          attributes: source.attributes || [],
          accessibility:
            source.attributes?.filter((attr) =>
              attr.includes("ACCESSIBILITY--DISTASSIST")
            ) || [],
          last_updated: now.toISOString(),
        };
      }) || []
    );
  }

  getCachedEvents() {
    return eventCache.get("events") || [];
  }
}

module.exports = new ApiService();
