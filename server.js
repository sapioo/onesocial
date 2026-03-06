/**
 * server.js
 *
 * OneSocial Backend – Express Server Entry Point
 */

// Load .env variables BEFORE other imports
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const generateRoute = require("./routes/generateRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Allowed Frontends ─────────────────────────────────────────

const allowedOrigins = [
    "http://localhost:5173", // local React dev server
    "https://onesocial-livid.vercel.app", // your deployed frontend
];

// ── Middleware ─────────────────────────────────────────────────

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Parse JSON requests
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────

// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        provider: process.env.AI_PROVIDER || "openrouter",
        timestamp: new Date().toISOString(),
    });
});

// Main AI generation endpoint
app.use("/api/generate", generateRoute);

// ── 404 Handler ───────────────────────────────────────────────

app.use((_req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: "Route does not exist.",
    });
});

// ── Global Error Handler ─────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error("[global-error-handler]", err.stack);

    res.status(500).json({
        error: "Internal Server Error",
        message: err.message || "Unexpected server error",
    });
});

// ── Start Server ─────────────────────────────────────────────

app.listen(PORT, () => {
    console.log("\n🚀 OneSocial Backend running");
    console.log(`   Server      : http://localhost:${PORT}`);
    console.log(`   Provider    : ${(process.env.AI_PROVIDER || "openrouter").toUpperCase()}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   Generate    : POST http://localhost:${PORT}/api/generate\n`);
});

module.exports = app;