import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "LiiBRA",
  description: "Plataforma de acesso aberto à informação jurídica do Brasil",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

