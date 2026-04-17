import {
  RouterProvider,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router";
import { AuthProvider } from "./hooks/useAuth";
import { Route as rootRoute } from "./routes/__root";

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree: rootRoute,
  history: hashHistory,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
