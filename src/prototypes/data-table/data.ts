export type ParticipantStatus = "Confirmado" | "Pendente RSVP" | "Cadastro incompleto";
export type ParticipantProfile = "Titular" | "Acompanhante" | "VIP" | "Staff";

export interface ParticipantRow {
  id: string;
  name: string;
  code: string;
  profile: ParticipantProfile;
  status: ParticipantStatus;
  destination: string;
  fee: number;
  updatedAt: string;
}

export const participants: ParticipantRow[] = [
  { id: "1", name: "Ana Martins", code: "EV-1042", profile: "Titular", status: "Confirmado", destination: "São Paulo", fee: 1890, updatedAt: "Hoje, 10:42" },
  { id: "2", name: "Bruno Nogueira", code: "EV-1058", profile: "Acompanhante", status: "Pendente RSVP", destination: "Rio de Janeiro", fee: 980, updatedAt: "Hoje, 09:18" },
  { id: "3", name: "Camila Duarte", code: "EV-1071", profile: "VIP", status: "Confirmado", destination: "Belo Horizonte", fee: 3250, updatedAt: "Ontem, 18:04" },
  { id: "4", name: "Diego Ribeiro", code: "EV-1096", profile: "Staff", status: "Cadastro incompleto", destination: "Curitiba", fee: 0, updatedAt: "Ontem, 16:32" },
  { id: "5", name: "Elisa Mendonça", code: "EV-1114", profile: "Titular", status: "Pendente RSVP", destination: "Recife", fee: 1740, updatedAt: "20 ago, 14:07" },
  { id: "6", name: "Felipe Cardoso", code: "EV-1132", profile: "Titular", status: "Confirmado", destination: "Salvador", fee: 2100, updatedAt: "20 ago, 11:26" },
  { id: "7", name: "Gabriela Lima", code: "EV-1150", profile: "VIP", status: "Cadastro incompleto", destination: "Brasília", fee: 2980, updatedAt: "19 ago, 17:53" },
  { id: "8", name: "Henrique Souza", code: "EV-1178", profile: "Acompanhante", status: "Confirmado", destination: "Porto Alegre", fee: 920, updatedAt: "19 ago, 15:11" },
  { id: "9", name: "Isabela Costa", code: "EV-1192", profile: "Titular", status: "Confirmado", destination: "Florianópolis", fee: 1980, updatedAt: "19 ago, 12:40" },
  { id: "10", name: "João Azevedo", code: "EV-1210", profile: "VIP", status: "Pendente RSVP", destination: "São Paulo", fee: 3470, updatedAt: "18 ago, 17:06" },
  { id: "11", name: "Larissa Freitas", code: "EV-1228", profile: "Titular", status: "Confirmado", destination: "Curitiba", fee: 1840, updatedAt: "18 ago, 14:22" },
  { id: "12", name: "Marcelo Alves", code: "EV-1241", profile: "Staff", status: "Confirmado", destination: "Recife", fee: 0, updatedAt: "18 ago, 09:31" },
];

export type SortKey = keyof Pick<ParticipantRow, "name" | "code" | "profile" | "status" | "destination" | "fee" | "updatedAt">;
export type EditableKey = keyof Pick<ParticipantRow, "name" | "profile" | "status" | "destination" | "fee">;
export type SortDirection = "asc" | "desc";

export function sortRows(rows: ParticipantRow[], key: SortKey, direction: SortDirection) {
  return [...rows].sort((left, right) => {
    const leftValue = left[key];
    const rightValue = right[key];
    const result = typeof leftValue === "number" && typeof rightValue === "number"
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue), "pt-BR", { numeric: true });
    return direction === "asc" ? result : -result;
  });
}

export function statusTone(status: ParticipantStatus) {
  if (status === "Confirmado") return "success";
  if (status === "Pendente RSVP") return "warning";
  return "danger";
}
