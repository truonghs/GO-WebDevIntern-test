import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { routes } from "./routes/routes";

function RouteProvider() {
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => {
          const Page = route.component;
          return <Route key={index} path={route.path} element={<Page />} />;
        })}
      </Routes>
    </Router>
  );
}

export default RouteProvider;
