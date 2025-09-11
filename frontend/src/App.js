import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PatientListPage from './PatientListPage';
import PatientProfilePage from './PatientProfilePage';
import FoodListPage from './FoodListPage';
import CreateRecipePage from './CreateRecipePage';
import DietPlannerPage from './DietPlannerPage'; // New import
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Swasthya Sutra</h1>
          {/* Navigation Links */}
          <nav>
            <Link to="/" style={{margin: '10px'}}>Patient List</Link>
            <Link to="/foods" style={{margin: '10px'}}>Food Database</Link>
            <Link to="/create-recipe" style={{margin: '10px'}}>Create Recipe</Link>
            <Link to="/diet-planner" style={{margin: '10px'}}>Diet Planner</Link>
          </nav>
          <hr />
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/patient/:id" element={<PatientProfilePage />} />
            <Route path="/foods" element={<FoodListPage />} />
            <Route path="/create-recipe" element={<CreateRecipePage />} />
            <Route path="/diet-planner" element={<DietPlannerPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;