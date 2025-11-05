const Room = require('../models/Room');

// Store active socket connections
const activeRooms = new Map(); // roomId -> Set of socketIds

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join a room
    socket.on('join-room', async (data) => {
      try {
        const { roomId } = data;
        if (!roomId) {
          socket.emit('error', { message: 'Room ID required' });
          return;
        }

        const upperRoomId = roomId.toUpperCase();
        
        // Find or create room
        let room = await Room.findOne({ roomId: upperRoomId });
        
        if (!room) {
          room = new Room({
            roomId: upperRoomId,
            participants: [],
            messages: [],
            isActive: true,
            participantCount: 0,
          });
          await room.save();
        }

        // Join socket room
        socket.join(upperRoomId);
        
        // Add participant
        if (!activeRooms.has(upperRoomId)) {
          activeRooms.set(upperRoomId, new Set());
        }
        activeRooms.get(upperRoomId).add(socket.id);

        // Update room in database
        room.participants.push({
          socketId: socket.id,
          joinedAt: new Date(),
        });
        room.participantCount = activeRooms.get(upperRoomId).size;
        await room.save();

        // Notify user they joined
        socket.emit('room-joined', {
          roomId: upperRoomId,
          participantCount: room.participantCount,
        });

        // Notify others in the room
        socket.to(upperRoomId).emit('user-joined', {
          participantCount: room.participantCount,
        });

        console.log(`👤 User ${socket.id} joined room ${upperRoomId}`);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave a room
    socket.on('leave-room', async (data) => {
      try {
        const { roomId } = data;
        if (!roomId) return;

        const upperRoomId = roomId.toUpperCase();
        socket.leave(upperRoomId);

        // Remove from active rooms
        if (activeRooms.has(upperRoomId)) {
          activeRooms.get(upperRoomId).delete(socket.id);
          
          if (activeRooms.get(upperRoomId).size === 0) {
            activeRooms.delete(upperRoomId);
          }
        }

        // Update room in database
        const room = await Room.findOne({ roomId: upperRoomId });
        if (room) {
          room.participants = room.participants.filter(
            (p) => p.socketId !== socket.id
          );
          const currentCount = activeRooms.has(upperRoomId) 
            ? activeRooms.get(upperRoomId).size 
            : 0;
          room.participantCount = currentCount;
          
          // If no participants left, mark room as inactive
          if (currentCount === 0) {
            room.isActive = false;
            console.log(`🔒 Room ${upperRoomId} marked as inactive (no participants)`);
          }
          
          await room.save();
        }

        // Notify others
        socket.to(upperRoomId).emit('user-left', {
          participantCount: activeRooms.has(upperRoomId) 
            ? activeRooms.get(upperRoomId).size 
            : 0,
        });

        socket.emit('room-left', { roomId: upperRoomId });
        console.log(`👋 User ${socket.id} left room ${upperRoomId}`);
      } catch (error) {
        console.error('Leave room error:', error);
      }
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { roomId, text, replyTo } = data;
        if (!roomId || !text) {
          socket.emit('error', { message: 'Room ID and text required' });
          return;
        }

        const upperRoomId = roomId.toUpperCase();
        const room = await Room.findOne({ roomId: upperRoomId });

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Create message object
        const messageData = {
          text,
          sender: 'anonymous',
          timestamp: new Date(),
        };

        // Add replyTo if provided
        if (replyTo) {
          messageData.replyTo = {
            id: replyTo.id,
            text: replyTo.text,
            sender: replyTo.sender === 'user' ? 'anonymous' : 'anonymous',
          };
        }

        // Save to database
        room.messages.push(messageData);
        await room.save();
        
        // Reload room to get the saved message with _id
        const updatedRoom = await Room.findOne({ roomId: upperRoomId });
        const savedMessage = updatedRoom.messages[updatedRoom.messages.length - 1];
        
        console.log(`💾 Message saved to database. Total messages in room: ${updatedRoom.messages.length}`);

        // Broadcast to all in room (including sender)
        io.to(upperRoomId).emit('message-received', {
          id: savedMessage._id ? savedMessage._id.toString() : Date.now().toString(),
          text: savedMessage.text,
          sender: savedMessage.sender,
          timestamp: savedMessage.timestamp,
          roomId: upperRoomId,
          replyTo: savedMessage.replyTo,
        });

        console.log(`💬 Message sent in room ${upperRoomId}`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // WebRTC Signaling - Offer
    socket.on('offer', (data) => {
      const { roomId, offer } = data;
      socket.to(roomId.toUpperCase()).emit('offer-received', {
        offer,
        from: socket.id,
      });
    });

    // WebRTC Signaling - Answer
    socket.on('answer', (data) => {
      const { roomId, answer } = data;
      socket.to(roomId.toUpperCase()).emit('answer-received', {
        answer,
        from: socket.id,
      });
    });

    // WebRTC Signaling - ICE Candidate
    socket.on('ice-candidate', (data) => {
      const { roomId, candidate } = data;
      socket.to(roomId.toUpperCase()).emit('ice-candidate-received', {
        candidate,
        from: socket.id,
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      
      // Remove from all active rooms
      for (const [roomId, socketIds] of activeRooms.entries()) {
        if (socketIds.has(socket.id)) {
          socketIds.delete(socket.id);
          
          if (socketIds.size === 0) {
            activeRooms.delete(roomId);
          }

          // Update database
          const room = await Room.findOne({ roomId });
          if (room) {
            room.participants = room.participants.filter(
              (p) => p.socketId !== socket.id
            );
            room.participantCount = socketIds.size;
            
            // If no participants left, mark room as inactive
            if (socketIds.size === 0) {
              room.isActive = false;
              console.log(`🔒 Room ${roomId} marked as inactive (no participants)`);
            }
            
            await room.save();
          }

          // Notify others
          socket.to(roomId).emit('user-left', {
            participantCount: socketIds.size,
          });
        }
      }
    });
  });
};

module.exports = socketHandlers;

