// Firebase web app settings for the public comment wall.
// Where to find them: Firebase console → Project settings → Your apps → Web app → "SDK setup and configuration" → Config.
// These values are meant to be public (they only identify the project). What visitors are allowed
// to do is decided by firestore.rules: read comments and add new ones, nothing else.

export const firebaseConfig = {
  apiKey: "AIzaSyBCTA3RWTeLammc05RxgXZKFZuSGaoqmhA",
  authDomain: "portfolio-panji.firebaseapp.com",
  projectId: "portfolio-panji",
  storageBucket: "portfolio-panji.firebasestorage.app",
  messagingSenderId: "964094828863",
  appId: "1:964094828863:web:ce983cf6436b93c845738a",
};

export const commentsEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
