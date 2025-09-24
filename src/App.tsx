import Canvas from "./components/canvas/Canvas";
import { AppBar } from "./components/layout/AppBar";

function App() {
  return (
    <div className="App h-screen w-screen flex flex-col bg-gray-50">
      <AppBar />
      <div className="flex-1 overflow-hidden">
        <Canvas />
      </div>
    </div>
  );
}

export default App;
