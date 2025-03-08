import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import "./tailwind.css";
import AlphaTestingDisclaimer from "components/AlphaTestingDisclaimer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AlphaTestingDisclaimer />
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        <footer className="text-center text-gray-500 text-sm p-4 flex justify-center items-center gap-2">
          <a
            href="https://github.com/ybot1122/sprint-refinement-tool"
            className="hover:underline"
          >
            Source Code on GitHub
          </a>{" "}
          | <p>Alpha Testing - Do Not Type Sensitive Information</p>
        </footer>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
