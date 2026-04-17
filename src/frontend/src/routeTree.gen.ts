import { Route as RootRoute } from "./routes/__root";

export const routeTree = RootRoute;

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof RootRoute;
      parentRoute: typeof import("@tanstack/react-router").RootRoute;
    };
  }
}
