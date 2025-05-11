import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsPage from './pages/EventsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventsPage />} />
      </Routes>
    </Router>
  );
}

export default App;