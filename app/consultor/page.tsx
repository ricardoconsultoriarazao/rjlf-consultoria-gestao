"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FormField } from "../../components/FormField";
import { downloadJson } from "../../lib/export";
import {
  ConsultantData,
  OrganogramArea,
  WorkspaceData,
  consultantStorageKey,
  createEmptyOrganogramArea
} from "../../lib/schema";

const steps = [
  { id: "invite", title: "Convites", detail: "Enviar acesso ao gestor" },
  { id: "import", title: "Importar", detail: "Dados do gestor" },
  { id: "organogram", title: "Organograma", detail: "Areas e decisoes" },
  { id: "diagnosis", title: "Diagnostico", detail: "Analise do consultor" },
  { id: "deliverable", title: "Resultado", detail: "Exportar devolutiva" }
] as const;

type StepId = (typeof steps)[number]["id"];

const emptyConsultantData: ConsultantData = {
  imported: null,
  organogram: [],
  diagnosis: "",
  recommendations: "",
  nextSteps: ""
};

export default function ConsultantPage() {
  const [activeStep, setActiveStep] = useState<StepId>("invite");
  const [data, setData] = useState<ConsultantData>(emptyConsultantData);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [message, setMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [sendPve, setSendPve] = useState(true);
  const [sendRcf, setSendRcf] = useState(true);
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(consultantStorageKey);
    if (!saved) {
      const area = createEmptyOrganogramArea();
      setData({ ...emptyConsultantData, organogram: [area] });
      setSelectedAreaId(area.id);
      return;
    }

    const parsed = JSON.parse(saved) as ConsultantData;
    const organogram = parsed.organogram?.length
      ? parsed.organogram
      : [createEmptyOrganogramArea()];
    setData({ ...emptyConsultantData, ...parsed, organogram });
    setSelectedAreaId(organogram[0]?.id || "");
  }, []);

  const selectedArea = useMemo(
    () =>
      data.organogram.find((area) => area.id === selectedAreaId) ||
      data.organogram[0],
    [data.organogram, selectedAreaId]
  );

  function persist(nextData: ConsultantData = data) {
    localStorage.setItem(consultantStorageKey, JSON.stringify(nextData));
    setMessage("Rascunho do consultor salvo.");
    setTimeout(() => setMessage(""), 2200);
  }

  async function sendInvite() {
    setSendingInvite(true);
    setMessage("");

    const response = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: inviteEmail,
        modules: {
          pve: sendPve,
          rcf: sendRcf
        }
      })
    });

    const payload = await response.json();
    setSendingInvite(false);

    if (!response.ok) {
      setMessage(payload.error || "Nao foi possivel enviar o convite.");
      return;
    }

    setMessage("Convite enviado pelo Supabase.");
    setInviteEmail("");
  }

  function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const imported = normalizeImportedData(parsed);
        const nextData = { ...data, imported };
        setData(nextData);
        persist(nextData);
        setMessage("Arquivo importado com sucesso.");
      } catch {
        setMessage("Nao foi possivel ler o JSON. Confira se exportou pela ferramenta do gestor.");
      }
    };
    reader.readAsText(file);
  }

  function normalizeImportedData(payload: any): WorkspaceData {
    if (payload?.modules?.company && payload?.modules?.pve && payload?.modules?.rcf) {
      return {
        company: payload.modules.company,
        pve: payload.modules.pve,
        rcfs: payload.modules.rcf
      };
    }

    return payload as WorkspaceData;
  }

  function updateArea(field: keyof OrganogramArea, value: string) {
    const nextData = {
      ...data,
      organogram: data.organogram.map((area) =>
        area.id === selectedArea.id ? { ...area, [field]: value } : area
      )
    };
    setData(nextData);
  }

  function addArea() {
    const area = createEmptyOrganogramArea();
    const nextData = { ...data, organogram: [...data.organogram, area] };
    setData(nextData);
    setSelectedAreaId(area.id);
  }

  function removeArea(id: string) {
    const nextAreas = data.organogram.filter((area) => area.id !== id);
    const fallback = nextAreas[0] || createEmptyOrganogramArea();
    const nextData = {
      ...data,
      organogram: nextAreas.length ? nextAreas : [fallback]
    };
    setData(nextData);
    setSelectedAreaId(fallback.id);
  }

  function updateText(field: "diagnosis" | "recommendations" | "nextSteps", value: string) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function exportConsultantJson() {
    const company = data.imported?.company.tradeName || data.imported?.company.companyName || "empresa";
    const filename = `rjlf-consultor-${company}.json`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    downloadJson(filename, {
      source: "RJLF Consultoria - Ferramenta do Consultor",
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      imported: data.imported,
      organogram: data.organogram,
      diagnosis: data.diagnosis,
      recommendations: data.recommendations,
      nextSteps: data.nextSteps
    });
  }

  function exportConsultantText() {
    const company = data.imported?.company.tradeName || data.imported?.company.companyName || "Empresa";
    const lines = [
      `RJLF Consultoria - Devolutiva de Gestao`,
      ``,
      `Empresa: ${company}`,
      `Responsavel: ${data.imported?.company.ownerName || ""}`,
      ``,
      `1. ORGANOGRAMA FUNCIONAL`,
      ...data.organogram.flatMap((area, index) => [
        ``,
        `${index + 1}. ${area.areaName || "Area sem nome"}`,
        `Responsavel: ${area.responsible}`,
        `Missao da area: ${area.areaMission}`,
        `Indicadores: ${area.indicators}`,
        `Funcoes existentes: ${area.existingRoles}`,
        `Funcoes necessarias: ${area.neededRoles}`,
        `Acumulos: ${area.accumulatedRoles}`,
        `Lacunas: ${area.gaps}`,
        `Sobreposicoes: ${area.responsibilityOverlap}`,
        `Alcadas de decisao: ${area.decisionAuthority}`
      ]),
      ``,
      `2. DIAGNOSTICO DO CONSULTOR`,
      data.diagnosis,
      ``,
      `3. RECOMENDACOES`,
      data.recommendations,
      ``,
      `4. PROXIMOS PASSOS`,
      data.nextSteps
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rjlf-devolutiva-${company}`.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <Link className="brand" href="/">
            <strong>RJLF Consultoria</strong>
            <span>Ferramenta do consultor</span>
          </Link>
          <button className="button ghost" onClick={() => persist()} type="button">
            Salvar consultoria
          </button>
        </div>
      </header>

      <section className="page workspace">
        <aside className="panel">
          <h2>Consultor</h2>
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
          {message && <div className="notice">{message}</div>}
        </aside>

        <section className="panel">
          {activeStep === "invite" && (
            <>
              <h1>Enviar convite ao gestor</h1>
              <p>Escolha se o cliente respondera PVE, RCF ou os dois modulos.</p>
              <div className="grid">
                <FormField
                  full
                  label="E-mail do gestor"
                  onChange={setInviteEmail}
                  placeholder="gestor@empresa.com.br"
                  value={inviteEmail}
                />
                <label className="check-row">
                  <input checked={sendPve} onChange={(event) => setSendPve(event.target.checked)} type="checkbox" />
                  Enviar modulo PVE
                </label>
                <label className="check-row">
                  <input checked={sendRcf} onChange={(event) => setSendRcf(event.target.checked)} type="checkbox" />
                  Enviar modulo RCF
                </label>
              </div>
              <div className="actions">
                <button className="button" disabled={sendingInvite || !inviteEmail} onClick={sendInvite} type="button">
                  {sendingInvite ? "Enviando..." : "Enviar convite"}
                </button>
              </div>
              <div className="warning">
                Para o envio funcionar, confirme no Supabase Auth se o envio de e-mail esta habilitado e se a URL do site esta liberada.
              </div>
            </>
          )}

          {activeStep === "import" && (
            <>
              <h1>Importar respostas do gestor</h1>
              <p>Use o JSON exportado na ferramenta do gestor ou recebido pelo Supabase.</p>
              <input accept="application/json" onChange={importJson} type="file" />
              {data.imported && (
                <div className="summary-box">
                  <h2>{data.imported.company.tradeName || data.imported.company.companyName}</h2>
                  <p>Responsavel: {data.imported.company.ownerName}</p>
                  <p>Funcoes importadas: {data.imported.rcfs.length}</p>
                </div>
              )}
            </>
          )}

          {activeStep === "organogram" && selectedArea && (
            <>
              <div className="toolbar">
                <div>
                  <h1>Organograma funcional</h1>
                  <p>Monte areas, responsaveis, lacunas e alcadas a partir das respostas.</p>
                </div>
                <button className="button secondary" onClick={addArea} type="button">
                  Nova area
                </button>
              </div>

              <div className="rcf-list">
                {data.organogram.map((area) => (
                  <div className="rcf-item" key={area.id}>
                    <button className="button secondary" onClick={() => setSelectedAreaId(area.id)} type="button">
                      {area.areaName || "Area sem nome"}
                    </button>
                    <button className="button secondary" onClick={() => removeArea(area.id)} type="button">
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid" style={{ marginTop: 18 }}>
                <FormField label="Area da empresa" onChange={(v) => updateArea("areaName", v)} value={selectedArea.areaName} />
                <FormField label="Responsavel pela area" onChange={(v) => updateArea("responsible", v)} value={selectedArea.responsible} />
                <FormField full label="Missao da area" multiline onChange={(v) => updateArea("areaMission", v)} value={selectedArea.areaMission} />
                <FormField full label="Indicadores da area" multiline onChange={(v) => updateArea("indicators", v)} value={selectedArea.indicators} />
                <FormField full label="Funcoes existentes" multiline onChange={(v) => updateArea("existingRoles", v)} value={selectedArea.existingRoles} />
                <FormField full label="Funcoes necessarias" multiline onChange={(v) => updateArea("neededRoles", v)} value={selectedArea.neededRoles} />
                <FormField full label="Acumulos de funcao" multiline onChange={(v) => updateArea("accumulatedRoles", v)} value={selectedArea.accumulatedRoles} />
                <FormField full label="Lacunas" multiline onChange={(v) => updateArea("gaps", v)} value={selectedArea.gaps} />
                <FormField full label="Sobreposicao de responsabilidades" multiline onChange={(v) => updateArea("responsibilityOverlap", v)} value={selectedArea.responsibilityOverlap} />
                <FormField full label="Alcadas de decisao" multiline onChange={(v) => updateArea("decisionAuthority", v)} value={selectedArea.decisionAuthority} />
              </div>
            </>
          )}

          {activeStep === "diagnosis" && (
            <>
              <h1>Diagnostico e recomendacoes</h1>
              <p>Esta area e sua, sem aparecer para o gestor antes da devolutiva.</p>
              <div className="grid">
                <FormField full label="Diagnostico inteligente do consultor" multiline onChange={(v) => updateText("diagnosis", v)} value={data.diagnosis} />
                <FormField full label="Recomendacoes" multiline onChange={(v) => updateText("recommendations", v)} value={data.recommendations} />
                <FormField full label="Proximos passos" multiline onChange={(v) => updateText("nextSteps", v)} value={data.nextSteps} />
              </div>
            </>
          )}

          {activeStep === "deliverable" && (
            <>
              <h1>Gerar resultado</h1>
              <p>Exporte o trabalho completo para guardar, editar ou usar como base da devolutiva.</p>
              <div className="actions">
                <button className="button" onClick={exportConsultantJson} type="button">
                  Baixar JSON completo
                </button>
                <button className="button secondary" onClick={exportConsultantText} type="button">
                  Baixar devolutiva em texto
                </button>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
