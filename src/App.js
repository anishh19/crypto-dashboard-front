import Box from "./components/box";
import './App.css';
import News from "./components/news";




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
        Crypto Dashboard
         
        </h1>
        <div className="flex-container" id="main">
        <Box/>
        <News/>
        </div>
      </header>
    </div>
  );
}

export default App;
