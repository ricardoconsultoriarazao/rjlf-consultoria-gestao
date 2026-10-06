import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RJLF Consultoria | Gestão Empresarial",
  description: "Ferramenta de coleta PVE e RCF para construção de gestão empresarial."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
