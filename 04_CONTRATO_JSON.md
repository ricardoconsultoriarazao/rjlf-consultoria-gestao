# Contrato JSON para exportacao

Este e o formato que a ferramenta do consultor deve importar.

```json
{
  "schema_version": "1.0",
  "exported_at": "2026-10-06T19:30:00.000Z",
  "company": {
    "id": "uuid",
    "name": "Empresa Exemplo",
    "segment": "Clinica de estetica",
    "city": "Irati",
    "state": "PR",
    "size": "6 a 15 pessoas",
    "main_challenge": "Equipe sem clareza de funcao",
    "context_notes": "Observacoes do gestor"
  },
  "respondents": [
    {
      "id": "uuid",
      "full_name": "Nome do Gestor",
      "email": "gestor@empresa.com.br",
      "role": "gestor"
    }
  ],
  "modules": {
    "pve": {
      "enabled": true,
      "status": "enviado",
      "submitted_at": "2026-10-06T19:30:00.000Z"
    },
    "rcf": {
      "enabled": true,
      "status": "enviado",
      "submitted_at": "2026-10-06T19:30:00.000Z"
    }
  },
  "pve": {
    "vision": "",
    "mission": "",
    "ambition": "",
    "values": [
      {
        "name": "Responsabilidade",
        "meaning": "Assumir combinados e resolver problemas.",
        "expected_behaviors": "Cumprir prazos...",
        "opposite_behaviors": "Culpar colegas..."
      }
    ],
    "admired_behaviors": "",
    "intolerable_behaviors": "",
    "desired_profile": "",
    "undesired_profile": "",
    "culture_daily": "",
    "culture_rituals": ""
  },
  "rcf_functions": [
    {
      "id": "uuid",
      "function_name": "Consultora Comercial",
      "mission": "",
      "main_result": "",
      "key_responsibilities": "",
      "daily_activities": "",
      "result_goals": "",
      "routine_goals": "",
      "indicators": "",
      "expected_behaviors": "",
      "unacceptable_behaviors": "",
      "autonomy_can": "",
      "autonomy_validate": "",
      "autonomy_cannot": "",
      "internal_interfaces": "",
      "delivery_30": "",
      "delivery_60": "",
      "delivery_90": ""
    }
  ]
}
```

## Regra

A ferramenta do gestor gera dados brutos.  
A ferramenta do consultor interpreta os dados e cria organograma, diagnostico e recomendacoes.

