"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsultantLoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/consultor");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/consultor");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/consultor-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(payload.error || "Nao foi possivel entrar.");
      return;
    }

    router.push(nextPath);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <Link className="brand" href="/">
            <strong>RJLF Consultoria</strong>
            <span>Acesso restrito do consultor</span>
          </Link>
        </div>
      </header>

      <section className="page hero">
        <form className="panel" onSubmit={handleSubmit}>
          <h1>Entrada do consultor</h1>
          <p>Digite a senha administrativa para acessar convites, importacao, organograma e devolutiva.</p>

          <div className="field full">
            <label htmlFor="consultant-password">Senha do consultor</label>
            <input
              id="consultant-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite a senha"
              required
              type="password"
              value={password}
            />
          </div>

          {message && <div className="warning">{message}</div>}

          <div className="actions">
            <button className="button" disabled={loading} type="submit">
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <Link className="button secondary" href="/">
              Voltar
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
