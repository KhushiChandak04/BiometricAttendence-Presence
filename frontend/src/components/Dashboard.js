import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const Dashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    fetchAttendanceData();
    // Set up polling every 5 minutes
    const interval = setInterval(fetchAttendanceData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('/api/attendance');
      if (response.data && Array.isArray(response.data)) {
        setAttendanceData(response.data);
        setError('');
      } else {
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!Array.isArray(attendanceData)) return [];
    
    return [...attendanceData].sort((a, b) => {
      if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    }
    return null;
  };

  const getStatistics = () => {
    if (!Array.isArray(attendanceData)) return { todayCount: 0, monthCount: 0, totalCount: 0, uniqueEmployees: 0 };

    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    return {
      todayCount: attendanceData.filter(record => record.date?.startsWith(today)).length,
      monthCount: attendanceData.filter(record => record.date?.startsWith(thisMonth)).length,
      totalCount: attendanceData.length,
      uniqueEmployees: new Set(attendanceData.map(record => record.employee_id)).size
    };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Attendance
              </Typography>
              <Typography variant="h4">{stats.todayCount}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <AccessTimeIcon color="primary" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Last 24 hours
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Monthly Attendance
              </Typography>
              <Typography variant="h4">{stats.monthCount}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <CalendarIcon color="primary" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  This Month
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Records
              </Typography>
              <Typography variant="h4">{stats.totalCount}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  All Time
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Unique Employees
              </Typography>
              <Typography variant="h4">{stats.uniqueEmployees}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <PersonIcon color="primary" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Total Registered
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Attendance Table */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Recent Attendance Records
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                           onClick={() => handleSort('employee_id')}>
                        Employee ID
                        {getSortIcon('employee_id')}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                           onClick={() => handleSort('date')}>
                        Date
                        {getSortIcon('date')}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                           onClick={() => handleSort('time')}>
                        Time
                        {getSortIcon('time')}
                      </Box>
                    </TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSortedData().map((record, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{record.employee_id}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                          {record.location || 'N/A'}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getSortedData().length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No attendance records found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
