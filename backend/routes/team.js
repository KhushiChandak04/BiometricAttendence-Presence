const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');

// Get all teams with detailed information
router.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('manager', 'name employee_id email')
            .populate('members', 'name employee_id email department status')
            .lean();

        const enhancedTeams = await Promise.all(teams.map(async (team) => {
            const activeProjects = team.projects.filter(p => p.status === 'active').length;
            const completedProjects = team.projects.filter(p => p.status === 'completed').length;
            const activeMembers = team.members.filter(m => m.status === 'active').length;

            return {
                ...team,
                stats: {
                    totalMembers: team.members.length,
                    activeMembers,
                    activeProjects,
                    completedProjects
                }
            };
        }));

        res.json(enhancedTeams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific team details
router.get('/teams/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('manager', 'name employee_id email')
            .populate('members', 'name employee_id email department status')
            .lean();

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new team
router.post('/teams', async (req, res) => {
    try {
        // Verify manager exists
        const manager = await User.findById(req.body.manager);
        if (!manager) {
            return res.status(400).json({ error: 'Invalid manager ID' });
        }

        // Verify all members exist
        if (req.body.members) {
            const members = await User.find({ _id: { $in: req.body.members } });
            if (members.length !== req.body.members.length) {
                return res.status(400).json({ error: 'One or more invalid member IDs' });
            }
        }

        const team = new Team(req.body);
        await team.save();

        // Update users' team field
        await User.updateMany(
            { _id: { $in: req.body.members } },
            { $set: { team: team._id } }
        );

        const populatedTeam = await Team.findById(team._id)
            .populate('manager', 'name employee_id email')
            .populate('members', 'name employee_id email department status');

        res.status(201).json(populatedTeam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update team
router.put('/teams/:id', async (req, res) => {
    try {
        const { members, ...updateData } = req.body;
        
        // If updating members, verify they exist
        if (members) {
            const existingMembers = await User.find({ _id: { $in: members } });
            if (existingMembers.length !== members.length) {
                return res.status(400).json({ error: 'One or more invalid member IDs' });
            }

            // Remove team reference from old members
            await User.updateMany(
                { team: req.params.id },
                { $unset: { team: "" } }
            );

            // Add team reference to new members
            await User.updateMany(
                { _id: { $in: members } },
                { $set: { team: req.params.id } }
            );
        }

        const team = await Team.findByIdAndUpdate(
            req.params.id,
            { ...updateData, members },
            { new: true }
        )
        .populate('manager', 'name employee_id email')
        .populate('members', 'name employee_id email department status');

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete team
router.delete('/teams/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Remove team reference from all members
        await User.updateMany(
            { team: req.params.id },
            { $unset: { team: "" } }
        );

        await Team.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add member to team
router.post('/teams/:id/members', async (req, res) => {
    try {
        const { memberId } = req.body;
        
        // Verify member exists
        const member = await User.findById(memberId);
        if (!member) {
            return res.status(400).json({ error: 'Invalid member ID' });
        }

        const team = await Team.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { members: memberId } },
            { new: true }
        )
        .populate('manager', 'name employee_id email')
        .populate('members', 'name employee_id email department status');

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Update user's team reference
        await User.findByIdAndUpdate(memberId, { team: req.params.id });

        res.json(team);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Remove member from team
router.delete('/teams/:id/members/:memberId', async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(
            req.params.id,
            { $pull: { members: req.params.memberId } },
            { new: true }
        )
        .populate('manager', 'name employee_id email')
        .populate('members', 'name employee_id email department status');

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Remove team reference from user
        await User.findByIdAndUpdate(req.params.memberId, { $unset: { team: "" } });

        res.json(team);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
