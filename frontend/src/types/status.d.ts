export interface CreateStatus {
  name: string;
  color: string;
  position: number;
}

export interface UpdateStatus {
  name?: string;
  color?: string;
  position?: number;
}

export interface Status {
  id: number;
  name: string;
  color: string;
  position: number;
}
