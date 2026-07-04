import { APP_CONFIG } from "@/config/app";

export function delay<T>(value: T, ms: number = APP_CONFIG.mockNetworkDelayMs): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 400, code = "BAD_REQUEST") {
    super(message);
    this.status = status;
    this.code = code;
  }
}
