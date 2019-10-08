var admin = require("firebase-admin");

var _bucket = null;
var _storage = null;

function conectar() {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
        storageBucket: "axdecortt.appspot.com",
    });

    _bucket = admin.storage().bucket();
    _storage = admin.storage();
}

module.exports = {
    conectar,
    bucket() {
        return _bucket;
    },
    storage() {
        return _storage;
    },
};
