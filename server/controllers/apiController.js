const apiService = require('../services/apiService');
const Email = require('../models/Email');


class ApiController {
  async getEvents(req, res) {
    try {
      const events = await apiService.fetchAndCacheEvents();
      res.json({
        success: true,
        count: events.length,
        last_updated: events[0]?.last_updated,
        data: events
      });
    } catch (error) {
      // Try to return cached data if available
      const cachedEvents = apiService.getCachedEvents();
      if (cachedEvents.length > 0) {
        console.log('Using cached data due to API failure');
        return res.json({
          success: true,
          count: cachedEvents.length,
          from_cache: true,
          data: cachedEvents
        });
      }
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }


async submitEmail(req, res) {
  try {
    const { email, eventUrl } = req.body;

    if (!email || !eventUrl) {
      return res.status(400).json({ success: false, error: 'Missing email or eventUrl' });
    }

    let emailDoc = await Email.findOne({ email });

    if (emailDoc) {
      if (emailDoc.eventUrls.includes(eventUrl)) {
        // Duplicate event for this email — no change needed
        return res.json({
          success: true,
          data: emailDoc,
          message: 'Event already submitted for this email'
        });
      }

      // Add new event to existing email
      emailDoc.eventUrls.push(eventUrl);
      await emailDoc.save();
      return res.json({
        success: true,
        data: emailDoc,
        message: 'Event added to existing email'
      });
    }

    // Create new email record
    emailDoc = new Email({ email, eventUrls: [eventUrl] });
    await emailDoc.save();
    return res.json({
      success: true,
      data: emailDoc,
      message: 'Email and event saved successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}




}

module.exports = new ApiController();