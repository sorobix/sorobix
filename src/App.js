import './App.css';
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen/HomeScreen";
import IDEScreen from './pages/IDEScreen/IDEScreen';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomeScreen} />
        <Route exact path="/ide" component={IDEScreen} />

      </Switch>
    </Router>
  );
}

export default App;
