const Grant = require('../models/Grant');

// GET /api/grants - Get all grants
exports.getAllGrants = async (req, res, next) => {
  try {
    const now = new Date();
    let grants = await Grant.find().sort({ createdDate: -1 });
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
      grants = await Grant.find().sort({ createdDate: -1 });
    }
    res.json(grants);
  } catch (err) {
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
