import React, { useState } from 'react';
import NFAEditor from './components/NFAEditor';
import StringTester from './components/StringTester';
import './App.css';


function App() {
  const [nfa, setNfa] = useState({
    states: [],
    transitions: {},
    startState: null,
    acceptState: null,
  });

  const [result, setResult] = useState(null);

  // Test the string for NFA
  const testString = (input) => {
    let currentStates = new Set([nfa.startState]);  // Start with the start state

    for (let char of input) {
      let nextStates = new Set();

      // For each current state, get all the possible next states for the given symbol
      currentStates.forEach((state) => {
        const transitions = nfa.transitions[state]?.[char];
        if (transitions) {
          transitions.forEach((nextState) => nextStates.add(nextState));
        }
      });

      currentStates = nextStates;  // Set the new current states
    }

    // Check if any of the current states is an accept state
    return Array.from(currentStates).includes(nfa.acceptState);
  };

  return (
    <div>
      <h1>NFA Simulator</h1>
      <NFAEditor nfa={nfa} setNfa={setNfa} />
      <StringTester testString={testString} setResult={setResult} />
      {result !== null && (
        <p>{result ? 'String Accepted' : 'String Rejected'}</p>
      )}
    </div>
  );
}

export default App;
