import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';
import EditorPage from '../src/pages/EditorPage'; // This will be created below

function App() {
  return (
    <BrowserRouter>
      <div className="font-sans">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
