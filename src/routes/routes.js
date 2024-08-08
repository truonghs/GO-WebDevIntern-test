import { Dashboard, EmailConfirmation, History, Home, Unsubscribe } from "../pages";
const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/history",
    component: History,
  },
  {
    path: "/email-confirm",
    component: EmailConfirmation,
  },
  {
    path: "/unsubscribe",
    component: Unsubscribe,
  },
];

export { routes };
