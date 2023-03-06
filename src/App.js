import './App.css';
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen/HomeScreen";
import IDEScreen from './pages/IDEScreen/IDEScreen';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/stale-ide" component={HomeScreen} />
        <Route exact path="/" component={IDEScreen} />

      </Switch>
    </Router>
  );
}

export default App;
