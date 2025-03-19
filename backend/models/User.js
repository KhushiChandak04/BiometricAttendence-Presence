const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    employee_id: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['employee', 'manager', 'admin']
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    face_data: String,
    qr_code: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    joining_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'on_leave'],
        default: 'active'
    }
}, {
    timestamps: true
});

userSchema.index({ employee_id: 1 }, { unique: true });
module.exports = mongoose.model('User', userSchema);
