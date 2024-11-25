import React, { useState } from 'react';

function NFAEditor({ nfa, setNfa }) {
  const [transition, setTransition] = useState({
    from: '',
    to: '',
    symbol: '',
  });

  const addState = () => {
    const newState = `q${nfa.states.length + 1}`;
    if (nfa.states.includes(newState)) return; // Avoid duplicate state names
    setNfa({
      ...nfa,
      states: [...nfa.states, newState],
    });
  };

  const deleteState = (state) => {
    if (state === nfa.startState || state === nfa.acceptState) {
      alert("Can't delete start or accept state");
      return;
    }

    const newTransitions = { ...nfa.transitions };
    for (let from in newTransitions) {
      for (let symbol in newTransitions[from]) {
        newTransitions[from][symbol] = newTransitions[from][symbol].filter(
          (s) => s !== state
        );
      }
    }

    setNfa({
      ...nfa,
      states: nfa.states.filter((s) => s !== state),
      transitions: newTransitions,
    });
  };

  const setStartState = (state) => {
    setNfa({ ...nfa, startState: state });
  };

  const setAcceptState = (state) => {
    if (nfa.acceptState === state) return; // Prevent setting the same accept state again
    setNfa({ ...nfa, acceptState: state });
  };

  const toggleTransition = (from, symbol, to) => {
    const newTransitions = { ...nfa.transitions };
    if (!newTransitions[from]) newTransitions[from] = {};
    if (!newTransitions[from][symbol]) newTransitions[from][symbol] = [];
    newTransitions[from][symbol].push(to);
    setNfa({
      ...nfa,
      transitions: newTransitions,
    });
  };

  const deleteTransition = (from, symbol, to) => {
    const newTransitions = { ...nfa.transitions };
    if (newTransitions[from]) {
      newTransitions[from][symbol] = newTransitions[from][symbol].filter(
        (state) => state !== to
      );
      setNfa({
        ...nfa,
        transitions: newTransitions,
      });
    }
  };

  return (
    <div className="nfa-editor">
      <h2>NFA Editor</h2>
      
      {/* Add State Button */}
      <button onClick={addState}>Add State</button>
      
      {/* States List */}
      <div className="states-list">
        {nfa.states.map((state) => (
          <div key={state} className="state-item">
            <span>{state}</span>
            <button onClick={() => deleteState(state)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Set Start State */}
      <div className="state-select">
        <h3>Set Start State</h3>
        <select
          onChange={(e) => setStartState(e.target.value)}
          value={nfa.startState || ''}
        >
          <option value="">Select</option>
          {nfa.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Set Accept State */}
      <div className="state-select">
        <h3>Set Accept State</h3>
        <select
          onChange={(e) => setAcceptState(e.target.value)}
          value={nfa.acceptState || ''}
        >
          <option value="">Select</option>
          {nfa.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Add Transition */}
      <h3>Add Transition</h3>
      <div className="transition-form">
        <select
          value={transition.from}
          onChange={(e) => setTransition({ ...transition, from: e.target.value })}
        >
          <option value="">From State</option>
          {nfa.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Symbol"
          value={transition.symbol}
          onChange={(e) => setTransition({ ...transition, symbol: e.target.value })}
        />
        <select
          value={transition.to}
          onChange={(e) => setTransition({ ...transition, to: e.target.value })}
        >
          <option value="">To State</option>
          {nfa.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <button onClick={() => toggleTransition(transition.from, transition.symbol, transition.to)}>
          Add Transition
        </button>
      </div>

      {/* Existing Transitions */}
      <h3>Existing Transitions</h3>
      <div className="transitions-list">
        {Object.entries(nfa.transitions).map(([from, symbols]) =>
          Object.entries(symbols).map(([symbol, toStates]) =>
            toStates.map((to) => (
              <div key={`${from}-${symbol}-${to}`} className="transition-item">
                <span>
                  {from} --{symbol}--&gt; {to}
                </span>
                <button onClick={() => deleteTransition(from, symbol, to)}>Delete</button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

export default NFAEditor;
