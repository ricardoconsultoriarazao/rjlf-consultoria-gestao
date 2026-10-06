"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FormField } from "../../components/FormField";
import { buildConsultantExport, downloadJson } from "../../lib/export";
import {
  CompanyData,
  PveData,
  RcfData,
  WorkspaceData,
  createEmptyRcf,
  emptyCompany,
  emptyPve,
  storageKey
} from "../../lib/schema";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";

const steps = [
  { id: "company", title: "Dados da Empresa", detail: "Identificacao e contexto" },
  { id: "pve", title: "PVE", detail: "Cultura e direcao" },
  { id: "rcf", title: "RCF", detail: "Funcao por funcao" },
  { id: "export", title: "Exportar", detail: "Arquivo do consultor" }
] as const;

type StepId = (typeof steps)[number]["id"];

export default function DashboardPage() {
  const [activeStep, setActiveStep] = useState<StepId>("company");
  const [company, setCompany] = useState<CompanyData>(emptyCompany);
  const [pve, setPve] = useState<PveData>(emptyPve);
  const [rcfs, setRcfs] = useState<RcfData[]>([]);
  const [selectedRcfId, setSelectedRcfId] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      const firstRcf = createEmptyRcf();
      setRcfs([firstRcf]);
      setSelectedRcfId(firstRcf.id);
      return;
    }

    const parsed = JSON.parse(saved) as WorkspaceData;
    setCompany(parsed.company || emptyCompany);
    setPve(parsed.pve || emptyPve);
    setRcfs(parsed.rcfs?.length ? parsed.rcfs : [createEmptyRcf()]);
    setSelectedRcfId(parsed.rcfs?.[0]?.id || "");
  }, []);

  const selectedRcf = useMemo(
    () => rcfs.find((rcf) => rcf.id === selectedRcfId) || rcfs[0],
    [rcfs, selectedRcfId]
  );

  const data: WorkspaceData = { company, pve, rcfs };

  function persist(nextData: WorkspaceData = data) {
    localStorage.setItem(storageKey, JSON.stringify(nextData));
    setSaveMessage("Rascunho salvo neste navegador.");
    setTimeout(() => setSaveMessage(""), 2200);
  }

  async function submitToSupabase() {
    persist();

    if (!hasSupabaseConfig || !supabase) {
      setSaveMessage("Modo demonstracao: exporte o JSON para enviar ao consultor.");
      return;
    }

    const { error } = await supabase.from("form_submissions").insert({
      payload: buildConsultantExport(data),
      status: "submitted"
    });

    setSaveMessage(
      error
        ? "Nao foi possivel enviar ao Supabase. Exporte o JSON e confira as tabelas."
        : "Respostas enviadas ao consultor."
    );
  }

  function updateCompany(field: keyof CompanyData, value: string) {
    setCompany((current) => ({ ...current, [field]: value }));
  }

  function updatePve(field: keyof PveData, value: string) {
    setPve((current) => ({ ...current, [field]: value }));
  }

  function updateRcf(field: keyof RcfData, value: string) {
    setRcfs((current) =>
      current.map((rcf) =>
        rcf.id === selectedRcf.id ? { ...rcf, [field]: value } : rcf
      )
    );
  }

  function addRcf() {
    const rcf = createEmptyRcf();
    setRcfs((current) => [...current, rcf]);
    setSelectedRcfId(rcf.id);
  }

  function removeRcf(id: string) {
    const next = rcfs.filter((rcf) => rcf.id !== id);
    const fallback = next[0] || createEmptyRcf();
    setRcfs(next.length ? next : [fallback]);
    setSelectedRcfId(fallback.id);
  }

  function exportJson() {
    const filename = `rjlf-${company.tradeName || company.companyName || "empresa"}-pve-rcf.json`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    downloadJson(filename, buildConsultantExport(data));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <Link className="brand" href="/">
            <strong>RJLF Consultoria</strong>
            <span>Formulario guiado do gestor</span>
          </Link>
          <button className="button ghost" onClick={() => persist()} type="button">
            Salvar rascunho
          </button>
        </div>
      </header>

      <section className="page workspace">
        <aside className="panel">
          <h2>Etapas</h2>
          <div className="steps">
            {steps.map((step) => (
              <button
                className={`step-card ${activeStep === step.id ? "active" : ""}`}
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                type="button"
              >
                <strong>{step.title}</strong>
                <span>{step.detail}</span>
              </button>
            ))}
          </div>
          {saveMessage && <div className="notice">{saveMessage}</div>}
        </aside>

        <section className="panel">
          {activeStep === "company" && (
            <>
              <div className="toolbar">
                <div>
                  <h1>Dados da Empresa</h1>
                  <p>Comece pelo contexto basico para orientar PVE e RCF.</p>
                </div>
              </div>
              <div className="grid">
                <FormField label="Razao social" onChange={(v) => updateCompany("companyName", v)} value={company.companyName} />
                <FormField label="Nome fantasia" onChange={(v) => updateCompany("tradeName", v)} value={company.tradeName} />
                <FormField label="CNPJ" onChange={(v) => updateCompany("cnpj", v)} value={company.cnpj} />
                <FormField label="Cidade" onChange={(v) => updateCompany("city", v)} value={company.city} />
                <FormField label="Estado" onChange={(v) => updateCompany("state", v)} value={company.state} />
                <FormField label="Segmento" example="Clinica estetica, comercio, servicos, industria leve" onChange={(v) => updateCompany("segment", v)} value={company.segment} />
                <FormField label="Numero de colaboradores" onChange={(v) => updateCompany("employees", v)} value={company.employees} />
                <FormField label="Responsavel principal" onChange={(v) => updateCompany("ownerName", v)} value={company.ownerName} />
                <FormField label="E-mail do responsavel" onChange={(v) => updateCompany("ownerEmail", v)} value={company.ownerEmail} />
                <FormField label="Telefone/WhatsApp" onChange={(v) => updateCompany("ownerPhone", v)} value={company.ownerPhone} />
                <FormField full label="Principal desafio de gestao hoje" multiline example="Cresceu, mas as funcoes ficaram confusas e tudo depende do dono." onChange={(v) => updateCompany("mainChallenge", v)} value={company.mainChallenge} />
              </div>
            </>
          )}

          {activeStep === "pve" && (
            <>
              <h1>PVE</h1>
              <p>Registre a cultura desejada com exemplos praticos do dia a dia.</p>
              <div className="grid">
                <FormField full label="Visao" multiline example="Ser referencia regional em experiencia, resultado e gestao profissional." onChange={(v) => updatePve("vision", v)} value={pve.vision} />
                <FormField full label="Missao" multiline example="Entregar resultados consistentes aos clientes por meio de metodo, cuidado e equipe preparada." onChange={(v) => updatePve("mission", v)} value={pve.mission} />
                <FormField full label="Grande ambicao" multiline example="Dobrar o faturamento com previsibilidade sem depender exclusivamente do dono." onChange={(v) => updatePve("bigAmbition", v)} value={pve.bigAmbition} />
                <FormField full label="Valores" multiline example="Responsabilidade, verdade nos numeros, cuidado com o cliente, disciplina e aprendizado." onChange={(v) => updatePve("values", v)} value={pve.values} />
                <FormField full label="Comportamentos admirados" multiline example="Assumir problemas, cumprir combinados, registrar informacoes e pedir ajuda cedo." onChange={(v) => updatePve("admiredBehaviors", v)} value={pve.admiredBehaviors} />
                <FormField full label="Comportamentos intoleraveis" multiline example="Omitir falhas, culpar colegas, prometer sem entregar ou tratar cliente com descuido." onChange={(v) => updatePve("intolerableBehaviors", v)} value={pve.intolerableBehaviors} />
                <FormField full label="Perfil profissional desejado" multiline onChange={(v) => updatePve("desiredProfile", v)} value={pve.desiredProfile} />
                <FormField full label="Perfil profissional nao desejado" multiline onChange={(v) => updatePve("undesiredProfile", v)} value={pve.undesiredProfile} />
                <FormField full label="Como a cultura aparece no dia a dia" multiline onChange={(v) => updatePve("dailyCulture", v)} value={pve.dailyCulture} />
                <FormField full label="Como a cultura sera mantida viva" multiline example="Reuniao semanal, feedback, indicadores visiveis, rituais de reconhecimento e consequencia." onChange={(v) => updatePve("livingCulture", v)} value={pve.livingCulture} />
              </div>
            </>
          )}

          {activeStep === "rcf" && selectedRcf && (
            <>
              <div className="toolbar">
                <div>
                  <h1>RCF por Funcao</h1>
                  <p>Crie uma ficha para cada funcao existente ou necessaria.</p>
                </div>
                <button className="button secondary" onClick={addRcf} type="button">
                  Nova funcao
                </button>
              </div>

              <div className="rcf-list">
                {rcfs.map((rcf) => (
                  <div className="rcf-item" key={rcf.id}>
                    <button
                      className="button secondary"
                      onClick={() => setSelectedRcfId(rcf.id)}
                      type="button"
                    >
                      {rcf.roleName || "Funcao sem nome"}
                    </button>
                    <button className="button secondary" onClick={() => removeRcf(rcf.id)} type="button">
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid" style={{ marginTop: 18 }}>
                <FormField label="Nome da funcao" onChange={(v) => updateRcf("roleName", v)} value={selectedRcf.roleName} />
                <FormField label="Resultado principal esperado" onChange={(v) => updateRcf("mainResult", v)} value={selectedRcf.mainResult} />
                <FormField full label="Missao da funcao" multiline example="Garantir que os clientes sejam atendidos com qualidade e que a rotina comercial gere agenda e vendas." onChange={(v) => updateRcf("roleMission", v)} value={selectedRcf.roleMission} />
                <FormField full label="Responsabilidades-chave" multiline onChange={(v) => updateRcf("keyResponsibilities", v)} value={selectedRcf.keyResponsibilities} />
                <FormField full label="Atividades do dia a dia" multiline onChange={(v) => updateRcf("dailyActivities", v)} value={selectedRcf.dailyActivities} />
                <FormField full label="Metas de resultado" multiline example="Faturamento, conversao, recompra, ticket medio, inadimplencia ou produtividade." onChange={(v) => updateRcf("resultGoals", v)} value={selectedRcf.resultGoals} />
                <FormField full label="Metas de rotina" multiline example="Ligar para X leads por dia, atualizar CRM, revisar agenda, conferir pendencias." onChange={(v) => updateRcf("routineGoals", v)} value={selectedRcf.routineGoals} />
                <FormField full label="Indicadores" multiline example="Conversao, agenda comparecida, NPS, taxa de retorno, prazo de entrega, retrabalho." onChange={(v) => updateRcf("indicators", v)} value={selectedRcf.indicators} />
                <FormField full label="Comportamentos esperados" multiline onChange={(v) => updateRcf("expectedBehaviors", v)} value={selectedRcf.expectedBehaviors} />
                <FormField full label="Comportamentos inaceitaveis" multiline onChange={(v) => updateRcf("unacceptableBehaviors", v)} value={selectedRcf.unacceptableBehaviors} />
                <FormField full label="Autonomia" multiline example="Pode decidir sozinho, precisa consultar gestor ou precisa aprovar com o dono." onChange={(v) => updateRcf("autonomy", v)} value={selectedRcf.autonomy} />
                <FormField full label="Interfaces internas" multiline example="Comercial, financeiro, operacional, atendimento, marketing, dono." onChange={(v) => updateRcf("internalInterfaces", v)} value={selectedRcf.internalInterfaces} />
                <FormField label="Entregas em 30 dias" multiline onChange={(v) => updateRcf("deliveries30", v)} value={selectedRcf.deliveries30} />
                <FormField label="Entregas em 60 dias" multiline onChange={(v) => updateRcf("deliveries60", v)} value={selectedRcf.deliveries60} />
                <FormField full label="Entregas em 90 dias" multiline onChange={(v) => updateRcf("deliveries90", v)} value={selectedRcf.deliveries90} />
              </div>
            </>
          )}

          {activeStep === "export" && (
            <>
              <h1>Exportacao para o consultor</h1>
              <p>
                O arquivo JSON concentra Dados da Empresa, PVE e RCFs. Ele foi
                pensado para ser importado depois na ferramenta do consultor,
                onde ficarao organograma, diagnostico e recomendacoes.
              </p>
              <div className="notice">
                O diagnostico nao aparece para o gestor nesta versao. Ele fica
                reservado para a analise consultiva.
              </div>
              <div className="actions">
                <button className="button" onClick={submitToSupabase} type="button">
                  Enviar respostas
                </button>
                <button className="button secondary" onClick={exportJson} type="button">
                  Baixar JSON
                </button>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
