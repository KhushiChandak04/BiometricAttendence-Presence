const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Team = require('../models/Team');
const moment = require('moment');

// Enhanced analytics endpoints
router.get('/stats', async (req, res) => {
    try {
        const [totalEmployees, presentToday, attendanceRate, departmentStats, teamPerformance] = await Promise.all([
            User.countDocuments({ status: 'active' }),
            Attendance.countDocuments({
                timestamp: { 
                    $gte: moment().startOf('day').toDate(),
                    $lte: moment().endOf('day').toDate()
                },
                type: 'check_in',
                status: 'valid'
            }),
            calculateAttendanceRate(),
            calculateDepartmentStats(),
            calculateTeamPerformance()
        ]);

        res.json({
            totalEmployees,
            presentToday,
            attendanceRate,
            departmentStats,
            teamPerformance
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/attendance-trend', async (req, res) => {
    try {
        const { period = 'week' } = req.query;
        const dateRange = getDateRange(period);
        
        const attendanceData = await Attendance.aggregate([
            {
                $match: {
                    timestamp: { $gte: dateRange.start },
                    type: 'check_in',
                    status: 'valid'
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.date': 1 } }
        ]);

        const dates = [];
        const counts = [];
        
        // Fill in missing dates with zero counts
        let currentDate = moment(dateRange.start);
        const endDate = moment(dateRange.end);
        
        while (currentDate <= endDate) {
            const formattedDate = currentDate.format('YYYY-MM-DD');
            const dayData = attendanceData.find(d => d._id.date === formattedDate);
            
            dates.push(formattedDate);
            counts.push(dayData ? dayData.count : 0);
            
            currentDate.add(1, 'day');
        }

        res.json({ dates, counts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/recent-activity', async (req, res) => {
    try {
        const activities = await Attendance.find()
            .sort({ timestamp: -1 })
            .limit(20)
            .populate('employee_id', 'name department')
            .lean();

        const formattedActivities = activities.map(activity => ({
            employee: activity.employee_id.name,
            department: activity.employee_id.department,
            action: `${activity.type === 'check_in' ? 'Checked In' : 'Checked Out'}`,
            time: moment(activity.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            location: activity.location,
            method: activity.method,
            status: activity.status
        }));

        res.json(formattedActivities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Department-wise attendance
router.get('/department-stats', async (req, res) => {
    try {
        const stats = await calculateDepartmentStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Team performance metrics
router.get('/team-performance', async (req, res) => {
    try {
        const stats = await calculateTeamPerformance();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper functions
async function calculateAttendanceRate() {
    const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
    const totalAttendance = await Attendance.countDocuments({
        timestamp: { $gte: thirtyDaysAgo },
        type: 'check_in',
        status: 'valid'
    });
    
    const totalEmployees = await User.countDocuments({ status: 'active' });
    const workingDays = 22; // Assuming 22 working days per month
    
    return Math.round((totalAttendance / (totalEmployees * workingDays)) * 100);
}

async function calculateDepartmentStats() {
    const today = moment().startOf('day').toDate();
    
    const departments = await User.distinct('department');
    const stats = await Promise.all(departments.map(async (dept) => {
        const totalEmployees = await User.countDocuments({ department: dept, status: 'active' });
        const presentToday = await Attendance.countDocuments({
            timestamp: { $gte: today },
            type: 'check_in',
            status: 'valid',
            employee_id: { 
                $in: await User.find({ department: dept }).distinct('_id')
            }
        });
        
        return {
            department: dept,
            totalEmployees,
            presentToday,
            attendanceRate: totalEmployees ? Math.round((presentToday / totalEmployees) * 100) : 0
        };
    }));
    
    return stats;
}

async function calculateTeamPerformance() {
    const today = moment().startOf('day').toDate();
    const teams = await Team.find().populate('members');
    
    const performance = await Promise.all(teams.map(async (team) => {
        const memberIds = team.members.map(member => member._id);
        const presentToday = await Attendance.countDocuments({
            timestamp: { $gte: today },
            type: 'check_in',
            status: 'valid',
            employee_id: { $in: memberIds }
        });
        
        return {
            teamName: team.name,
            totalMembers: team.members.length,
            presentToday,
            attendanceRate: team.members.length ? Math.round((presentToday / team.members.length) * 100) : 0
        };
    }));
    
    return performance;
}

function getDateRange(period) {
    const end = moment().endOf('day').toDate();
    let start;
    
    switch (period) {
        case 'week':
            start = moment().subtract(7, 'days').startOf('day').toDate();
            break;
        case 'month':
            start = moment().subtract(30, 'days').startOf('day').toDate();
            break;
        case 'quarter':
            start = moment().subtract(90, 'days').startOf('day').toDate();
            break;
        default:
            start = moment().subtract(7, 'days').startOf('day').toDate();
    }
    
    return { start, end };
}

module.exports = router;
