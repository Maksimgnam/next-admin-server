
const express = require("express");
const admin = require("firebase-admin");
const path = require('path')
const cors = require('cors');
const multer = require('multer')

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize Firebase Admin SDK
const serviceAccount = require("./test-79539-firebase-adminsdk-8p9jt-397071f53c.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://your-project-id.firebaseio.com"
});

// Get a Firestore reference
const db = admin.firestore();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// app.use(express.static(path.join(__dirname, 'public')));
// Add data to Firestore collection
app.post("/api/add-news", async (req, res) => {
    try {
        const data = req.body; // Assuming data comes in as JSON
        const docRef = await db.collection("news").add(data);
        res.status(201).json({ message: "Data added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding document: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/api/add-lesson", async (req, res) => {
    try {
        const data = req.body; // Assuming data comes in as JSON
        const docRef = await db.collection("lessons").add(data);
        res.status(201).json({ message: "Data added successfully", id: docRef.id });
    } catch (error) {
        console.error("Error adding document: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all data from Firestore collection
app.get("/api/get-news", async (req, res) => {
    try {
        const snapshot = await db.collection("news").get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error getting documents: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/api/get-lessons", async (req, res) => {
    try {
        const snapshot = await db.collection("lessons").get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error getting documents: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // specify the directory where you want to store the uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // generate a unique filename
    }
});

const upload = multer({ storage: storage });
app.post("/add-photo", upload.single('photo'), async (req, res) => {
    try {
        const data = req.body;
        const photo = req.file;

        const docRef = await db.collection("gallery").add({ ...data, photo: photo.filename });
        res.status(201).json({ message: "Photo added successfully", id: docRef.id, photo: photo.filename });
    } catch (error) {
        console.error("Error adding photo document: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/api/gallery", async (req, res) => {
    try {
        const snapshot = await db.collection("gallery").get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error getting photo documents: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.get("/api/rules", async (req, res) => {
    const snapshot = await db.collection("rules").get();
    const data = [];

    snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
    });


    res.status(200).json(data);
    console.log(data)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// const express = require("express");
// const admin = require("firebase-admin");
// const path = require('path')
// const cors = require('cors')
// const multer = require('multer')

// const app = express();
// const PORT = process.env.PORT || 8000;

// // Initialize Firebase Admin SDK
// const serviceAccount = require("./test-79539-firebase-adminsdk-8p9jt-397071f53c.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://your-project-id.firebaseio.com"
// });

// // Get a Firestore reference
// const db = admin.firestore();

// // Middleware to parse JSON bodies
// app.use(express.json());
// app.use(cors());
// app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // specify the directory where you want to store the uploaded images
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // generate a unique filename
//     }
// });

// const upload = multer({ storage: storage });
// app.post("/add-photo", upload.single('photo'), async (req, res) => {
//     try {
//         const data = req.body;
//         const photo = req.file;

//         // Save the file information to Firestore or your preferred storage solution
//         // For example, you can store the file URL or path in your Firestore collection

//         // Now, add the other data along with the file information to Firestore
//         const docRef = await db.collection("gallery").add({ ...data, photo: photo.filename });
//         res.status(201).json({ message: "Photo added successfully", id: docRef.id, photo: photo.filename });
//     } catch (error) {
//         console.error("Error adding photo document: ", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });
// // Get all photos from Firestore collection
// app.get("/api/gallery", async (req, res) => {
//     try {
//         const snapshot = await db.collection("gallery").get();
//         const data = [];
//         snapshot.forEach(doc => {
//             data.push({ id: doc.id, ...doc.data() });
//         });
//         res.status(200).json(data);
//     } catch (error) {
//         console.error("Error getting photo documents: ", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });



// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// const express = require("express");
// const admin = require("firebase-admin");
// const path = require('path');
// const cors = require('cors');
// const multer = require('multer'); // Import multer middleware

// const app = express();
// const PORT = process.env.PORT || 8000;

// // Initialize Firebase Admin SDK
// const serviceAccount = require("./test-79539-firebase-adminsdk-8p9jt-397071f53c.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://your-project-id.firebaseio.com"
// });

// // Get a Firestore reference
// const db = admin.firestore();

// // Middleware to parse JSON bodies
// app.use(express.json());
// app.use(cors());

// // Multer storage configuration
// const storage = multer.memoryStorage(); // Store files in memory for now
// const upload = multer({ storage });

// // Add data to Firestore collection with file upload
// app.post("/api/add-data", upload.single('image'), async (req, res) => {
//     try {
//         const { name, age, email } = req.body;
//         const imageData = req.file; // Get the uploaded image file

//         // Assuming data comes in as form fields
//         const data = {
//             name,
//             age,
//             email,
//             imageUrl: {
//                 originalName: imageData.originalname,
//                 mimetype: imageData.mimetype,
//                 size: imageData.size,
//                 buffer: imageData.buffer.toString('base64') // Convert buffer to base64 string
//             }
//         };

//         const docRef = await db.collection("users").add(data);
//         res.status(201).json({ message: "Data added successfully", id: docRef.id });
//     } catch (error) {
//         console.error("Error adding document: ", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// // Get all data from Firestore collection
// app.get("/api/get-data", async (req, res) => {
//     try {
//         const snapshot = await db.collection("users").get();
//         const data = [];
//         snapshot.forEach(doc => {
//             data.push({ id: doc.id, ...doc.data() });
//         });
//         res.status(200).json(data);
//     } catch (error) {
//         console.error("Error getting documents: ", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
