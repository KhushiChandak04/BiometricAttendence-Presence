const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    projects: [{
        name: String,
        description: String,
        status: {
            type: String,
            enum: ['active', 'completed', 'on_hold'],
            default: 'active'
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
