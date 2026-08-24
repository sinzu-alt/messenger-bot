const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Path papunta sa config.json ng bot
const configPath = path.join(__dirname, 'config.json');

// Function para basahin ang config
const getConfig = () => {
    if (fs.existsSync(configPath)) {
        try {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (e) {
            return { COOKIE: '', PREFIX: '!', ADMIN_ID: '' };
        }
    }
    return { COOKIE: '', PREFIX: '!', ADMIN_ID: '' };
};

// Route: Dashboard Home
app.get('/', (req, res) => {
    const config = getConfig();
    res.render('index', { config, success: null });
});

// Route: I-save ang Configuration
app.post('/save', (req, res) => {
    const { cookie, prefix, adminId } = req.body;
    
    // Depende sa format na ginagamit ng bot repository (maaaring lowercase o uppercase)
    const newConfig = {
        cookie: cookie.trim(),
        prefix: prefix.trim(),
        adminId: adminId.trim()
    };
    
    // Isulat sa config.json
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf8');
    
    res.render('index', { 
        config: newConfig, 
        success: 'Matagumpay na nai-save ang mga setting! Maaari mo nang i-restart ang bot mo.' 
    });
});

app.listen(PORT, () => {
    console.log(`Web Dashboard ay aktibo sa: http://localhost:${PORT}`);
});
