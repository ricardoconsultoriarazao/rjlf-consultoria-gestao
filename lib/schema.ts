export type CompanyData = {
  companyName: string;
  tradeName: string;
  cnpj: string;
  city: string;
  state: string;
  segment: string;
  employees: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  mainChallenge: string;
};

export type PveData = {
  vision: string;
  mission: string;
  bigAmbition: string;
  values: string;
  admiredBehaviors: string;
  intolerableBehaviors: string;
  desiredProfile: string;
  undesiredProfile: string;
  dailyCulture: string;
  livingCulture: string;
};

export type RcfData = {
  id: string;
  roleName: string;
  roleMission: string;
  mainResult: string;
  keyResponsibilities: string;
  dailyActivities: string;
  resultGoals: string;
  routineGoals: string;
  indicators: string;
  expectedBehaviors: string;
  unacceptableBehaviors: string;
  autonomy: string;
  internalInterfaces: string;
  deliveries30: string;
  deliveries60: string;
  deliveries90: string;
};

export type WorkspaceData = {
  company: CompanyData;
  pve: PveData;
  rcfs: RcfData[];
};

export const emptyCompany: CompanyData = {
  companyName: "",
  tradeName: "",
  cnpj: "",
  city: "",
  state: "",
  segment: "",
  employees: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  mainChallenge: ""
};

export const emptyPve: PveData = {
  vision: "",
  mission: "",
  bigAmbition: "",
  values: "",
  admiredBehaviors: "",
  intolerableBehaviors: "",
  desiredProfile: "",
  undesiredProfile: "",
  dailyCulture: "",
  livingCulture: ""
};

export function createEmptyRcf(): RcfData {
  return {
    id: crypto.randomUUID(),
    roleName: "",
    roleMission: "",
    mainResult: "",
    keyResponsibilities: "",
    dailyActivities: "",
    resultGoals: "",
    routineGoals: "",
    indicators: "",
    expectedBehaviors: "",
    unacceptableBehaviors: "",
    autonomy: "",
    internalInterfaces: "",
    deliveries30: "",
    deliveries60: "",
    deliveries90: ""
  };
}

export const storageKey = "rjlf-consultoria-gestao";
