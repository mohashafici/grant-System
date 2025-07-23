const Contact = require('../models/Contact');

// POST /api/contact - Save a contact form submission
exports.createContact = async (req, res, next) => {
  try {
    const { name, email, subject, category, message } = req.body;
    if (!name || !email || !subject || !category || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const contact = new Contact({ name, email, subject, category, message });
    await contact.save();
    res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}; 