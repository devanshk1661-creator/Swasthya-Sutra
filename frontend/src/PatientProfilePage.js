import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PatientProfilePage() {
  const [patient, setPatient] = useState(null);
  const { id } = useParams(); // Get the patient ID from the URL

  useEffect(() => {
    fetch(`http://localhost:3000/api/patients/${id}`)
      .then(response => response.json())
      .then(data => setPatient(data))
      .catch(error => console.error('Error fetching patient details:', error));
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Patient Profile</h2>
      <p><strong>Name:</strong> {patient.full_name}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Gender:</strong> {patient.gender}</p>
    </div>
  );
}

export default PatientProfilePage;