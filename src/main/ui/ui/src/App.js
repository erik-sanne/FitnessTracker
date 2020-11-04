import logo from '. 1   /logo.svg';
import './styles/App.css';
import Header from "./components/Header";
import Menu from "./components/Menu";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import SectionStart from "./components/SectionStart";

function App() {
  return (
      <BrowserRouter>
          <Header />
          <section className={Container}>
              <Switch>
                  <Route path="/history">
                      <h2>History</h2>
                  </Route>
                  <Route path="/">
                      <SectionStart />
                  </Route>
              </Switch>
          </section>
          <Menu />
      </BrowserRouter>
  );
}

export default App;
