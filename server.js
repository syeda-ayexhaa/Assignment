const express = require("express");
const crypto = require("crypto");

const app = express();

const {
    createUser,
    getUserByEmail
} = require("./models/user");

const { hashPassword } = require("./utils/password");

// Middleware
app.use(express.json());

// Initialize first admin
const initializeAdmin = async () => {

    const email = "admin@gmail.com";
    const password = "Admin12345";

    const existingAdmin = getUserByEmail(email);

    if (!existingAdmin) {

        const hashedPassword = await hashPassword(password);

        createUser({
            id: crypto.randomUUID(),
            name: "Main Admin",
            email,
            password: hashedPassword,
            role: "admin",
            deletionRequested: false
        });

        console.log("Default admin created");
        console.log("Email:", email);
        console.log("Password:", password);
    }
};

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/user", require("./routes/userRoutes"));

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Authentication API is running"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
const PORT = 3000;

initializeAdmin().then(() => {

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}).catch(error => {
    console.error("Server initialization failed:", error);
});