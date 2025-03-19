import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  makeStyles,
  Card,
  CardContent,
  Button,
  Box,
  useTheme,
  IconButton,
  Tooltip,
  Zoom,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { 
  Face as FaceIcon,
  CropFree as QrCodeIcon,
  PersonAdd as PersonAddIcon,
  LocationOn as LocationIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 'calc(100vh - 64px)',
    padding: theme.spacing(4),
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '200%',
      height: '200%',
      background: `repeating-linear-gradient(
        transparent 0,
        rgba(32, 43, 67, 0.3) 2px,
        transparent 4px
      )`,
      animation: '$gridMove 20s linear infinite',
    }
  },
  '@keyframes gridMove': {
    '0%': {
      transform: 'translate(-50%, -50%) rotate(0deg)',
    },
    '100%': {
      transform: 'translate(-50%, -50%) rotate(360deg)',
    },
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  welcomeTitle: {
    color: '#ffffff',
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: theme.spacing(1),
    textShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
    fontFamily: "'Orbitron', sans-serif",
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: theme.spacing(4),
    fontFamily: "'Rajdhani', sans-serif",
  },
  card: {
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 8px 30px rgba(33, 150, 243, 0.3)',
    },
  },
  cardContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  icon: {
    fontSize: 48,
    marginBottom: theme.spacing(2),
    color: '#2196F3',
    filter: 'drop-shadow(0 0 8px rgba(33, 150, 243, 0.5))',
  },
  statsCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2196F3',
    textShadow: '0 0 10px rgba(33, 150, 243, 0.3)',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
  },
  tableContainer: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    marginTop: theme.spacing(3),
  },
  tableCell: {
    color: 'rgba(255, 255, 255, 0.7)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tableHeader: {
    color: '#ffffff',
    fontWeight: 'bold',
    borderBottom: '2px solid rgba(33, 150, 243, 0.5)',
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    averageAttendance: 0,
  });
  const [attendanceData, setAttendanceData] = useState({
    labels: [],
    datasets: [],
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await axios.get('http://localhost:5000/api/analytics/stats');
        setStats(statsResponse.data);

        // Fetch attendance trend data
        const trendResponse = await axios.get('http://localhost:5000/api/analytics/attendance-trend');
        setAttendanceData({
          labels: trendResponse.data.dates,
          datasets: [{
            label: 'Daily Attendance',
            data: trendResponse.data.counts,
            fill: false,
            borderColor: '#2196F3',
            tension: 0.4,
          }],
        });

        // Fetch recent activity
        const activityResponse = await axios.get('http://localhost:5000/api/analytics/recent-activity');
        setRecentActivity(activityResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const navigateTo = (path) => {
    history.push(path);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={classes.root}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={4}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h4" className={classes.welcomeTitle}>
                Biometric Attendance Dashboard
              </Typography>
              <Typography variant="subtitle1" className={classes.subtitle}>
                Monitor your workforce attendance in real-time
              </Typography>
            </Paper>
          </Grid>

          {/* Statistics Cards */}
          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <PeopleIcon className={classes.icon} />
                  <Typography className={classes.statValue}>{stats.totalEmployees}</Typography>
                  <Typography className={classes.statLabel}>Total Employees</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <TrendingUpIcon className={classes.icon} />
                  <Typography className={classes.statValue}>{stats.presentToday}</Typography>
                  <Typography className={classes.statLabel}>Present Today</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className={classes.statsCard}>
                <CardContent>
                  <TimelineIcon className={classes.icon} />
                  <Typography className={classes.statValue}>{stats.averageAttendance}%</Typography>
                  <Typography className={classes.statLabel}>Average Attendance</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Attendance Chart */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6" className={classes.subtitle}>
                Attendance Trend
              </Typography>
              <Line data={attendanceData} options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }
                }
              }} />
            </Paper>
          </Grid>

          {/* Recent Activity Table */}
          <Grid item xs={12}>
            <TableContainer className={classes.tableContainer}>
              <Typography variant="h6" className={classes.subtitle} style={{ padding: '16px' }}>
                Recent Activity
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeader}>Employee</TableCell>
                    <TableCell className={classes.tableHeader}>Action</TableCell>
                    <TableCell className={classes.tableHeader}>Time</TableCell>
                    <TableCell className={classes.tableHeader}>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.tableCell}>{activity.employee}</TableCell>
                      <TableCell className={classes.tableCell}>{activity.action}</TableCell>
                      <TableCell className={classes.tableCell}>{activity.time}</TableCell>
                      <TableCell className={classes.tableCell}>{activity.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className={classes.card} onClick={() => navigateTo('/face-recognition')}>
                    <CardContent className={classes.cardContent}>
                      <FaceIcon className={classes.icon} />
                      <Typography>Face Recognition</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className={classes.card} onClick={() => navigateTo('/qr-scanner')}>
                    <CardContent className={classes.cardContent}>
                      <QrCodeIcon className={classes.icon} />
                      <Typography>QR Scanner</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className={classes.card} onClick={() => navigateTo('/team-management')}>
                    <CardContent className={classes.cardContent}>
                      <GroupIcon className={classes.icon} />
                      <Typography>Team Management</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className={classes.card} onClick={() => navigateTo('/registration')}>
                    <CardContent className={classes.cardContent}>
                      <PersonAddIcon className={classes.icon} />
                      <Typography>New Registration</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
