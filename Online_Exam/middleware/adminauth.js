const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) return res.redirect('/admin/login');

    try {
        const verified = jwt.verify(token, 'adminsecretkey');
        req.admin = verified;
        next();
    } catch (err) {
        res.redirect('/admin/login');
    }
};

module.exports = adminAuth;