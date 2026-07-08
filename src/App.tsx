import { Router, Switch, Route } from "wouter";
import { ThemeProvider } from "./components/ThemeProvider";
import Home from "./pages/home";
import Admin from "./pages/admin";
import NotFound from "./pages/not-found";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

// Note: framer's global reducedMotion="user" is intentionally NOT used here.
// Motion is the product on this site; scroll-driven parallax and smooth
// scrolling run for everyone. Only decorative infinite CSS loops (grain,
// float, marquee) are disabled via the prefers-reduced-motion media query.
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
      <Router base={base}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
