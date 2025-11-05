// Optional Firebase configuration
// Only use if you want file storage features

const admin = require('firebase-admin');

let firebaseApp = null;

const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Initialize Firebase Admin SDK
    // You'll need to download service account key from Firebase Console
    const serviceAccount = require('../serviceAccountKey.json');

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'onetimechat-d7be9.firebasestorage.app',
    });

    console.log('✅ Firebase initialized');
    return firebaseApp;
  } catch (error) {
    console.log('⚠️ Firebase not configured (optional feature)');
    return null;
  }
};

module.exports = {
  initializeFirebase,
  getStorage: () => {
    if (!firebaseApp) return null;
    return admin.storage();
  },
};

