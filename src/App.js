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

  const [alphabet, setAlphabet] = useState(['ε']);
  const [result, setResult] = useState(null);

  const testString = (input) => {
    let currentStates = new Set([nfa.startState]);
  
    currentStates = followEpsilonTransitions(currentStates);
  
    for (let char of input) {
      let nextStates = new Set();
  
      currentStates.forEach((state) => {
        const transitions = nfa.transitions[state]?.[char];
        if (transitions) {
          transitions.forEach((nextState) => nextStates.add(nextState));
        }
      });
      currentStates = followEpsilonTransitions(nextStates);
    }
    return Array.from(currentStates).includes(nfa.acceptState);
  };

  const followEpsilonTransitions = (states) => {
    let newStates = new Set(states);
    let epsilonStates = new Set(states);
  
    // Keep track of states we've already visited to prevent infinite loops
    let visitedStates = new Set(states);
  
    while (epsilonStates.size > 0) {
      let state = epsilonStates.values().next().value;
      epsilonStates.delete(state);
  
      // Get epsilon transitions for the current state
      const epsilonTransitions = nfa.transitions[state]?.['ε'];
      if (epsilonTransitions) {
        epsilonTransitions.forEach((nextState) => {
          if (!visitedStates.has(nextState)) {
            visitedStates.add(nextState);
            newStates.add(nextState);
            epsilonStates.add(nextState);
          }
        });
      }
    }
  
    return newStates;
  };

  return (
    <div>
      <div className="container">
        <h1>NFA Simulator</h1>
      </div>
      <div className="container">
        <div className="alphabet-input">
          <h2>Define Alphabet</h2>
          <input
            type="text"
            placeholder="Enter symbols separated by commas (e.g., a,b,c)"
            onBlur={(e) =>
              setAlphabet(['ε', ...e.target.value.split(',').map((s) => s.trim())])
            }
          />
        </div>
      </div>
      <NFAEditor nfa={nfa} setNfa={setNfa} alphabet={alphabet} />
      <div className="container">
        <StringTester testString={testString} setResult={setResult} />
      </div>
      <div className="container">
        {result !== null && (
          <p>{result ? 'String Accepted' : 'String Rejected'}</p>
        )}
      </div>
    </div>
  );
}

export default App;
