const express = require('express');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const METRO_EXEC = path.join(__dirname, 'metro');

// Helper to execute the C++ binary
const runMetro = (args) => {
    return new Promise((resolve, reject) => {
        execFile(METRO_EXEC, args, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error('Execution Error:', error);
                return reject({ error: 'Internal Server Error', details: stderr || stdout });
            }
            resolve(stdout.trim());
        });
    });
};

// 1. Get all stations
app.get('/api/stations', async (req, res) => {
    try {
        const output = await runMetro(['showAll']);
        // Parse the output if needed, or just return the text
        res.json({ success: true, message: output });
    } catch (err) {
        res.status(500).json({ success: false, ...err });
    }
});

// 2. Add a new station
app.post('/api/station', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Station name is required' });

    try {
        const output = await runMetro(['addStation', name]);
        res.json({ success: true, message: output });
    } catch (err) {
        res.status(500).json({ success: false, ...err });
    }
});

// 3. Add a connection
app.post('/api/connection', async (req, res) => {
    const { from, to, time } = req.body;
    if (!from || !to || time === undefined) {
        return res.status(400).json({ success: false, error: 'From, To, and Time are required' });
    }

    try {
        const output = await runMetro(['addConnection', from, to, time.toString()]);
        res.json({ success: true, message: output });
    } catch (err) {
        res.status(500).json({ success: false, ...err });
    }
});

// 4. Find shortest path
app.get('/api/path', async (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) {
        return res.status(400).json({ success: false, error: 'From and To queried strings are required' });
    }

    try {
        const output = await runMetro(['findPath', from, to]);
        res.json({ success: true, message: output });
    } catch (err) {
        res.status(500).json({ success: false, ...err });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Metro API server running on http://localhost:${PORT}`);
});
