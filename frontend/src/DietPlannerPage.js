import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Button, Select, MenuItem, FormControl, InputLabel, Box, Paper, CircularProgress } from '@mui/material';

function DietPlannerPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const dietPlanRef = useRef(null); // Ref to capture the HTML of the diet plan

  useEffect(() => {
    fetch('http://localhost:3000/api/patients')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  const handleGeneratePlan = () => {
    setLoading(true);
    setDietPlan(null);
    fetch('http://localhost:3000/api/generate-diet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: selectedPatient }),
    })
    .then(response => response.json())
    .then(data => {
        setDietPlan(data);
        setLoading(false);
    })
    .catch(error => {
        console.error('Error generating diet plan:', error);
        setLoading(false);
    });
  };

  const handleDownloadPdf = () => {
    const planHtml = dietPlanRef.current.innerHTML;
    const patientName = patients.find(p => p.id === selectedPatient)?.full_name || 'Patient';

    // Add some styling and a title to the HTML for the PDF
    const fullHtml = `
        <html>
            <head><style>body { font-family: sans-serif; padding: 20px; } h1, h2 { color: #333; } .meal { margin-bottom: 15px; }</style></head>
            <body>
                <h1>Diet Plan for ${patientName}</h1>
                ${planHtml}
            </body>
        </html>
    `;

    fetch('http://localhost:3000/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: fullHtml }),
    })
    .then(res => res.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diet-plan.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => console.error('Error downloading PDF:', error));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" gutterBottom>
        Automatic Diet Planner
      </Typography>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel>Select a Patient</InputLabel>
          <Select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
            {patients.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.full_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleGeneratePlan} disabled={!selectedPatient || loading} style={{ marginTop: '20px' }}>
          Generate One-Day Plan
        </Button>
      </Paper>

      {loading && <CircularProgress />}

      {dietPlan && (
        <Paper elevation={3} style={{ padding: '20px' }}>
          <div ref={dietPlanRef}>
            <Typography variant="h5" gutterBottom>Generated Meal Plan</Typography>
            <div className="meal">
                <Typography variant="h6">Breakfast:</Typography>
                <p>{dietPlan.breakfast ? dietPlan.breakfast.name : 'No suggestion available'}</p>
            </div>
            <div className="meal">
                <Typography variant="h6">Lunch:</Typography>
                <p>{dietPlan.lunch ? dietPlan.lunch.name : 'No suggestion available'}</p>
            </div>
            <div className="meal">
                <Typography variant="h6">Dinner:</Typography>
                <p>{dietPlan.dinner ? dietPlan.dinner.name : 'No suggestion available'}</p>
            </div>
          </div>
          <Button variant="contained" color="secondary" onClick={handleDownloadPdf} style={{ marginTop: '20px' }}>
            Download as PDF
          </Button>
        </Paper>
      )}
    </Container>
  );
}

export default DietPlannerPage;