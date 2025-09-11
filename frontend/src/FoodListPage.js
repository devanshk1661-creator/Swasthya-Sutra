import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';

function FoodListPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/food-items')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFoods(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching food items:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom>
        Food Database
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load food items: {error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={3}>
          {foods.map(food => (
            <Grid item xs={12} sm={6} md={4} key={food.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {food.name}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Calories: {food.calories} kcal
                  </Typography>
                  <Typography variant="body2">
                    <strong>Protein:</strong> {food.protein}g | <strong>Carbs:</strong> {food.carbohydrates}g | <strong>Fat:</strong> {food.fat}g
                  </Typography>
                  <hr />
                  <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                    Ayurvedic Properties
                  </Typography>
                  <Typography variant="body2">
                    <strong>Quality:</strong> {food.quality}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Rasa (Taste):</strong> {food.rasa}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Digestion:</strong> {food.digestion_difficulty}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Dosha Effect:</strong> {food.dosha_suitability}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default FoodListPage;