export interface ProfileViewModel {
  userId: string;
  shortUserId: string;
  name: string;
  displayName: string;
  initials: string;
  email: string;
  statusLabel: string;
  sessionLabel: string;
  details: ProfileDetailItemModel[];
  securitySignals: ProfileSecuritySignalModel[];
  actions: ProfileActionModel[];
}

export interface ProfileDetailItemModel {
  id: string;
  label: string;
  value: string;
  helper: string;
}

export interface ProfileSecuritySignalModel {
  id: string;
  label: string;
  description: string;
  tone: "success" | "info" | "warning";
}

export interface ProfileActionModel {
  id: string;
  label: string;
  href: string;
  description: string;
}
