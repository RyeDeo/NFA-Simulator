import React, { useState } from 'react';

function StringTester({ testString, setResult }) {
  const [input, setInput] = useState('');

  const handleTest = () => {
    const result = testString(input);
    setResult(result);
  };

  return (
    <div>
      <h2>Test a String</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter string"
      />
      <button onClick={handleTest}>Test</button>
    </div>
  );
}

export default StringTester;
