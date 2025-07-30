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
    const { title, domain, content, author, authorEmail } = req.body;
    
    // Validate required fields
    if (!title || !content || !author || !authorEmail) {
      return res.status(400).json({ 
        message: 'Please provide title, content, author name, and author email' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    const thread = new Thread({
      title: title.trim(),
      domain: domain || 'General',
      content: content.trim(),
      author: author.trim(),
      authorEmail: authorEmail.trim(),
      replies: []
    });
    
    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    console.error('Thread creation error:', err);
    res.status(400).json({ message: 'Failed to create thread. Please try again.' });
  }
};

// Add a reply to a thread
exports.addReply = async (req, res) => {
  try {
    const { author, authorEmail, content } = req.body;
    
    // Validate required fields
    if (!author || !authorEmail || !content) {
      return res.status(400).json({ 
        message: 'Please provide author name, author email, and content' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    
    thread.replies.push({
      author: author.trim(),
      authorEmail: authorEmail.trim(),
      content: content.trim(),
      createdAt: new Date()
    });
    thread.updatedAt = new Date();
    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    console.error('Reply creation error:', err);
    res.status(400).json({ message: 'Failed to add reply. Please try again.' });
  }
}; 