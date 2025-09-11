import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import MUI components
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

function PatientListPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/patients')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="md">
        <Typography variant="h4" component="h2" gutterBottom>
            Patient List
        </Typography>

        {loading && <CircularProgress />}

        {error && <Alert severity="error">Failed to load patients: {error}</Alert>}

        {!loading && !error && (
            <List>
                {patients.map(patient => (
                    <ListItem 
                        key={patient.id} 
                        component={Link} 
                        to={`/patient/${patient.id}`}
                        button
                    >
                        <ListItemText 
                            primary={patient.full_name} 
                            secondary={`${patient.age} years old`} 
                        />
                    </ListItem>
                ))}
            </List>
        )}
    </Container>
  );
}

export default PatientListPage;