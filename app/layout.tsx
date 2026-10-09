import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Portal | Email-Based ATS Demo",
  description: "A full-stack career portal portfolio project with application submission, resume validation, and email delivery.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <a href="/careers" className="brand" aria-label="Career Portal home">
              <span className="brand-mark">A</span>
              <span>AltHire <span className="brand-muted">Careers</span></span>
            </a>
            <nav className="top-nav" aria-label="Main navigation">
              <a href="/careers#positions">Open positions</a>
              <a href="/careers#portfolio-demo">About this demo</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <span>Career portal & email ATS portfolio project</span>
            <span>Next.js · TypeScript · Nodemailer</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
