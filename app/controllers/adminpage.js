const path = require('path');

const adminpagePath = "/usr/app/public/index.html";

// Controller end points
exports.getAdminpage = async (req, res) => {
    try {
        res.sendFile(adminpagePath);
    }
    catch (err) {
        console.error(err);
    }
}