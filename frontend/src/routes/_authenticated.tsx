import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionStorage } from "@/lib/session-storage";

/**
 * Pathless layout that gates every authenticated page. Runs client-side
 * only (ssr:false) so we can read the mock session from localStorage.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: ({ location }) => {
    const session = sessionStorage.read();
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
