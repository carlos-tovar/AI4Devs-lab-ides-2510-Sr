import React, { useState } from 'react';
import './App.css';
import AddCandidateForm from './components/AddCandidateForm';

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: '10vh', fontSize: 'calc(10px + 2vmin)' }}>
        <p>LTI Recruiter Dashboard</p>
      </header>
      <main style={{ padding: '20px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', marginBottom: '20px', fontSize: '16px', cursor: 'pointer' }}
        >
          {showForm ? 'Close Form' : 'Add Candidate'}
        </button>
        {showForm && <AddCandidateForm />}
      </main>
    </div>
  );
}

export default App;
