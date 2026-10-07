const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./Schemas/userSchema');
const checkAuthenticated = require('./authMiddleware');

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

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if(!user){
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match){
            return res.status(401).json({ message: 'Invalid email or password '});
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );

        res.json({ token, id: user.id, name: user.name, email: user.email});
    } catch (e){
        console.log(e.message);
        res.status(500).json({ message: 'Server error'});
    }
});

router.post('/guest', (req, res)=> {
    try {
    const token = jwt.sign(
        { guest: true, name: 'Guest'},
        process.env.JWT_SECRET,
        { expiresIn: '1h'},
    );
    } catch (err){
        console.log(err);
    }
    res.json({ token, name: 'Guest', guest: true });
});

router.get('/me', checkAuthenticated, (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email,
        guest: !!req.user.guest,
     });
});

module.exports = router;