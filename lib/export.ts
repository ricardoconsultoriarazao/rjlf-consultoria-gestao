import { WorkspaceData } from "./schema";

export function buildConsultantExport(data: WorkspaceData) {
  return {
    source: "RJLF Consultoria - Coleta Gestor",
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    modules: {
      company: data.company,
      pve: data.pve,
      rcf: data.rcfs
    },
    consultantUse: {
      organogramStatus: "pendente_consultor",
      diagnosisStatus: "pendente_consultor",
      recommendationsStatus: "pendente_consultor"
    }
  };
}

export function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
