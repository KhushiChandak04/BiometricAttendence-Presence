const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['check_in', 'check_out'],
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    method: {
        type: String,
        enum: ['face', 'qr'],
        required: true
    },
    device_info: {
        type: String
    },
    status: {
        type: String,
        enum: ['valid', 'invalid', 'pending'],
        default: 'valid'
    }
}, {
    timestamps: true
});

attendanceSchema.index({ employee_id: 1, timestamp: 1 });
attendanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Attendance', attendanceSchema);
