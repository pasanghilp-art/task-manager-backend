const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('./login-server/userSchema');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) return res.status(400).json({ message: 'Email already used' });

        const hashed = await bcrypt.hash(password, 10);
        await User.create({ name, email: email.toLowerCase(), password: hashed });
        res.status(201).json({ message: 'Registered' });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return next(err);
            res.json({ id: user.id, name: user.name, email: user.email });
        });
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: 'Logged out' });
    });
});

router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: 'Not logged in' });
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
});

module.exports = router;