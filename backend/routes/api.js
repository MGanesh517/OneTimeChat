const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { v4: uuidv4 } = require('uuid');

// Create a new room
router.post('/rooms', async (req, res) => {
  try {
    const roomId = req.body.roomId || uuidv4().split('-')[0].toUpperCase();
    
    // Check if room already exists
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.json({
        success: true,
        room: existingRoom,
        message: 'Room already exists',
      });
    }

    // Create new room
    const room = new Room({
      roomId,
      participants: [],
      messages: [],
      isActive: true,
      participantCount: 0,
    });

    await room.save();

    res.json({
      success: true,
      room: {
        roomId: room.roomId,
        createdAt: room.createdAt,
        participantCount: room.participantCount,
      },
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create room',
    });
  }
});

// Get room information
router.get('/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId: roomId.toUpperCase() });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    res.json({
      success: true,
      room: {
        roomId: room.roomId,
        createdAt: room.createdAt,
        participantCount: room.participantCount,
        isActive: room.isActive,
      },
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get room',
    });
  }
});

// Get room participants
router.get('/rooms/:roomId/users', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId: roomId.toUpperCase() });

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
      });
    }

    res.json({
      success: true,
      participantCount: room.participantCount,
      participants: room.participants.length,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
    });
  }
});

// Delete room (optional cleanup)
router.delete('/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    await Room.findOneAndDelete({ roomId: roomId.toUpperCase() });

    res.json({
      success: true,
      message: 'Room deleted',
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete room',
    });
  }
});

module.exports = router;

