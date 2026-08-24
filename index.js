const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const configPath = path.join(__dirname, 'config.json');
const appStatePath = path.join(__dirname, 'appstate.json');

const getConfig = () => {
    let config = { cookie: '', prefix: '!', adminId: '61592910700010' };
    if (fs.existsSync(configPath)) {
        try { config = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (e) {}
    }
    if (fs.existsSync(appStatePath)) {
        try { config.cookie = fs.readFileSync(appStatePath, 'utf8'); } catch (e) {}
    }
    return config;
};

app.get('/', (req, res) => {
    const config = getConfig();
    res.render('index', { config, success: null });
});

app.post('/save', (req, res) => {
    const { cookie, prefix, adminId } = req.body;
    
    const newConfig = { prefix: prefix.trim(), adminId: adminId.trim() };
    
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf8');
    fs.writeFileSync(appStatePath, cookie.trim(), 'utf8');
    
    res.render('index', { 
        config: { ...newConfig, cookie: cookie.trim() }, 
        success: 'Tagumpay! Nai-save na ang config at appstate.json.' 
    });
});

app.listen(PORT, () => {
    console.log(`Web Dashboard ay aktibo sa: http://localhost:${PORT}`);
});
