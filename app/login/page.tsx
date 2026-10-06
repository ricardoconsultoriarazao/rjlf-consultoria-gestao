"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!hasSupabaseConfig || !supabase) {
      localStorage.setItem("rjlf-demo-session", email || "demo@rjlf.com.br");
      router.push("/dashboard");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);

    if (error) {
      setMessage("Nao foi possivel entrar. Confira o e-mail e a senha.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <Link className="brand" href="/">
            <strong>RJLF Consultoria</strong>
            <span>Area segura do gestor</span>
          </Link>
        </div>
      </header>

      <section className="page hero">
        <form className="panel" onSubmit={handleLogin}>
          <h1>Acessar ferramenta</h1>
          <p>
            Entre com o e-mail convidado pelo consultor. Na primeira publicacao,
            a autenticacao sera feita pelo Supabase.
          </p>

          {!hasSupabaseConfig && (
            <div className="warning">
              Supabase ainda nao configurado. Este acesso abre o modo demonstracao
              para testar os formularios.
            </div>
          )}

          <div className="grid">
            <div className="field full">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="gestor@empresa.com.br"
                required
                type="email"
                value={email}
              />
            </div>

            <div className="field full">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                required={hasSupabaseConfig}
                type="password"
                value={password}
              />
            </div>
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

        <aside className="panel">
          <h2>Como o convite funciona</h2>
          <p>
            O consultor cria o acesso, escolhe se o gestor respondera PVE, RCF
            ou ambos, e envia o convite por e-mail. O gestor responde em ambiente
            restrito e as respostas ficam prontas para exportacao.
          </p>
        </aside>
      </section>
    </main>
  );
}
