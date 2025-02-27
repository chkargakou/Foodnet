import React from "react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {window.location.replace("/")}
        {document.cookie = 'SessionID=; Max-Age=-99999999;'}
        {localStorage.clear()}
      </header>
    </div>
  );
};

export default App;