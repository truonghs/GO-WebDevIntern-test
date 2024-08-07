import { Dashboard, EmailConfirmation, History, Unsubscribe } from "../pages";
const routes = [
  {
    path: "/",
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
