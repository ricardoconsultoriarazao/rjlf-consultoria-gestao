import Link from "next/link";

export default function HomePage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <div className="brand">
            <strong>RJLF Consultoria</strong>
            <span>Gestao empresarial para pequenas e medias empresas</span>
          </div>
          <Link className="button ghost" href="/login">
            Acessar ferramenta
          </Link>
        </div>
      </header>

      <section className="page hero">
        <div className="panel">
          <h1>Construcao guiada de PVE e RCF</h1>
          <p>
            Ferramenta segura para coletar as respostas do gestor e organizar as
            informacoes essenciais antes da etapa de organograma, diagnostico e
            recomendacoes conduzidas pelo consultor.
          </p>
          <div className="actions">
            <Link className="button" href="/login">
              Entrar como gestor
            </Link>
            <Link className="button secondary" href="/consultor">
              Entrar como consultor
            </Link>
          </div>
        </div>

        <div className="panel">
          <h2>Modulos desta versao</h2>
          <div className="steps">
            <div className="step-card active">
              <strong>1. Dados da Empresa</strong>
              <span>Identificacao, responsavel e desafio principal.</span>
            </div>
            <div className="step-card">
              <strong>2. PVE</strong>
              <span>Proposito, valores e cultura desejada na pratica.</span>
            </div>
            <div className="step-card">
              <strong>3. RCF</strong>
              <span>Construcao individual por funcao.</span>
            </div>
            <div className="step-card">
              <strong>Consultor</strong>
              <span>Convites, importacao, organograma e devolutiva.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
