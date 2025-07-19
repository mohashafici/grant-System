const Thread = require('../models/Thread');

// Get all threads
exports.getThreads = async (req, res) => {
  try {
    const threads = await Thread.find().sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single thread by id
exports.getThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Not found' });
    res.json(thread);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
};

// Create a new thread
exports.createThread = async (req, res) => {
  try {
    const thread = new Thread(req.body);
    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Add a reply to a thread
exports.addReply = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Not found' });
    thread.replies.push({
      author: req.body.author,
      content: req.body.content,
      createdAt: new Date()
    });
    thread.updatedAt = new Date();
    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
}; 