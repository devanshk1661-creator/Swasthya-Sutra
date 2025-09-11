import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Paper, Grid } from '@mui/material';

function CreateRecipePage() {
  const [allFoods, setAllFoods] = useState([]);
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([{ food_item_id: '', quantity: '', unit: 'grams' }]);

  // Fetch all available food items to populate the dropdowns
  useEffect(() => {
    fetch('http://localhost:3000/api/food-items')
      .then(response => response.json())
      .then(data => setAllFoods(data))
      .catch(error => console.error('Error fetching food items:', error));
  }, []);

  const handleIngredientChange = (index, event) => {
    const values = [...ingredients];
    values[index][event.target.name] = event.target.value;
    setIngredients(values);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { food_item_id: '', quantity: '', unit: 'grams' }]);
  };

  const handleRemoveIngredient = (index) => {
    const values = [...ingredients];
    values.splice(index, 1);
    setIngredients(values);
  };

  // This is the Nutrient Calculation Logic.
  // useMemo is a professional React practice to optimize complex calculations.
  const nutrientTotals = useMemo(() => {
    const totals = { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };
    ingredients.forEach(ing => {
      if (ing.food_item_id && ing.quantity) {
        const food = allFoods.find(f => f.id === parseInt(ing.food_item_id));
        if (food) {
          // Note: This is a simple calculation. A more advanced version would handle unit conversions (e.g., grams to cups).
          const quantity = parseFloat(ing.quantity) || 0;
          totals.calories += (food.calories || 0) * quantity / 100; // Assuming nutrient values are per 100g
          totals.protein += (food.protein || 0) * quantity / 100;
          totals.carbohydrates += (food.carbohydrates || 0) * quantity / 100;
          totals.fat += (food.fat || 0) * quantity / 100;
        }
      }
    });
    // Round to 2 decimal places
    for (const key in totals) {
      totals[key] = parseFloat(totals[key].toFixed(2));
    }
    return totals;
  }, [ingredients, allFoods]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:3000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: recipeName, ingredients }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Recipe created successfully!');
        setRecipeName('');
        setIngredients([{ food_item_id: '', quantity: '', unit: 'grams' }]);
    })
    .catch(error => console.error('Error creating recipe:', error));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" gutterBottom>
        Create New Recipe
      </Typography>
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <TextField 
            label="Recipe Name" 
            variant="outlined" 
            fullWidth 
            value={recipeName} 
            onChange={e => setRecipeName(e.target.value)} 
            required 
            style={{ marginBottom: '20px' }}
          />

          <Typography variant="h6">Ingredients</Typography>
          {ingredients.map((ingredient, index) => (
            <Grid container spacing={2} key={index} style={{ marginBottom: '10px' }}>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel>Ingredient</InputLabel>
                  <Select name="food_item_id" value={ingredient.food_item_id} onChange={e => handleIngredientChange(index, e)} required>
                    {allFoods.map(food => (
                      <MenuItem key={food.id} value={food.id}>{food.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField type="number" name="quantity" label="Quantity" variant="outlined" fullWidth value={ingredient.quantity} onChange={e => handleIngredientChange(index, e)} required />
              </Grid>
              <Grid item xs={2}>
                 <TextField name="unit" label="Unit" variant="outlined" fullWidth value={ingredient.unit} onChange={e => handleIngredientChange(index, e)} required />
              </Grid>
              <Grid item xs={2}>
                <Button variant="outlined" color="secondary" onClick={() => handleRemoveIngredient(index)}>Remove</Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="contained" onClick={handleAddIngredient} style={{ marginRight: '10px' }}>Add Ingredient</Button>
        </Paper>

        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h6">Live Nutrient Totals (per 100g of ingredients)</Typography>
            <Typography><strong>Calories:</strong> {nutrientTotals.calories} kcal</Typography>
            <Typography><strong>Protein:</strong> {nutrientTotals.protein} g</Typography>
            <Typography><strong>Carbohydrates:</strong> {nutrientTotals.carbohydrates} g</Typography>
            <Typography><strong>Fat:</strong> {nutrientTotals.fat} g</Typography>
        </Paper>

        <Button type="submit" variant="contained" color="primary" size="large">Save Recipe</Button>
      </form>
    </Container>
  );
}

export default CreateRecipePage;