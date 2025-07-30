const Grant = require('../models/Grant');
const User = require('../models/User');
// const NotificationService = require('../services/notificationService');

// GET /api/grants - Get all grants with search, filtering, and pagination
exports.getAllGrants = async (req, res, next) => {
  try {
    const { search, status, limit, category } = req.query;
    const now = new Date();
    
    // Build query
    let query = {};
    
    // Status filter
    if (status) {
      query.status = status;
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { funder: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with limit
    let grantsQuery = Grant.find(query).sort({ createdDate: -1 });
    
    if (limit) {
      grantsQuery = grantsQuery.limit(parseInt(limit));
    }
    
    let grants = await grantsQuery;
    
    // Update status to 'Closed' if deadline has passed and status is not already 'Closed'
    const updates = [];
    grants.forEach(grant => {
      if (grant.status !== 'Closed' && grant.deadline < now) {
        grant.status = 'Closed';
        updates.push(grant.save());
      }
    });
    
    if (updates.length > 0) {
      await Promise.all(updates);
      // Re-fetch grants to ensure up-to-date status
      grants = await grantsQuery;
    }
    
    res.json(grants);
  } catch (err) {
    console.error('Error in getAllGrants:', err);
    next(err);
  }
};

// POST /api/grants - Create a new grant (admin only)
exports.createGrant = async (req, res, next) => {
  try {
    const { title, description, category, funding, deadline, requirements, status } = req.body;
    if (!title || !description || !category || !funding || !deadline || !requirements) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }
    const grant = await Grant.create({
      title,
      description,
      category,
      funding,
      deadline,
      requirements,
      status,
    });

    // Notify researchers about new grant - temporarily disabled
    // try {
    //   const researchers = await User.find({ role: 'researcher' });
    //   await NotificationService.notifyNewGrant(grant, researchers);
    // } catch (error) {
    //   console.error('Error notifying researchers about new grant:', error);
    // }

    res.status(201).json(grant);
  } catch (err) {
    next(err);
  }
};

// GET /api/grants/:id - Get grant details by ID
exports.getGrantById = async (req, res, next) => {
  try {
    const grant = await Grant.findById(req.params.id);
    if (!grant) {
      return res.status(404).json({ message: 'Grant not found.' });
    }
    res.json(grant);
  } catch (err) {
    next(err);
  }
};

// PUT /api/grants/:id - Update a grant (admin only)
exports.updateGrant = async (req, res, next) => {
  try {
    const grant = await Grant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!grant) {
      return res.status(404).json({ message: 'Grant not found.' });
    }
    res.json(grant);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/grants/:id - Delete a grant (admin only)
exports.deleteGrant = async (req, res, next) => {
  try {
    const grant = await Grant.findByIdAndDelete(req.params.id);
    if (!grant) {
      return res.status(404).json({ message: 'Grant not found.' });
    }
    res.json({ message: 'Grant deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
