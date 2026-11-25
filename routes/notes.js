const express = require('express');
const Note = require('../models/Note');
const appEvents = require('../events/appEvents');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken); // every notes route is protected

// CREATE
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content required' });
  const note = await Note.create({ title, content, owner: req.user.id });
  appEvents.emit('noteCreated', note);
  res.status(201).json(note);
});

// READ all (only my notes)
router.get('/', async (req, res) => {
  res.json(await Note.find({ owner: req.user.id }));
});

// UPDATE
router.put('/:id', async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
});

module.exports = router;