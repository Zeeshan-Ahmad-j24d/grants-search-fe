// src/services/api.ts
import { config } from "../config";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  // Helper to get session token from Stytch
  private getSessionToken(): string | null {
    // Try to get from cookies first
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "stytch_session") {
        return value;
      }
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get session token
    const sessionToken = this.getSessionToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Add session token to Authorization header
    if (sessionToken) {
      headers["Authorization"] = `Bearer ${sessionToken}`;
    }

    console.log("Making request to:", url);
    console.log("Session token present:", !!sessionToken);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    return response.json();
  }

  async getGrants(filters?: {
    status?: string[];
    type?: string[];
    frameworkProgramme?: string[];
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();

    if (filters?.status) {
      params.append("status", filters.status.join(","));
    }
    if (filters?.type) {
      params.append("type", filters.type.join(","));
    }
    if (filters?.frameworkProgramme) {
      params.append("frameworkProgramme", filters.frameworkProgramme.join(","));
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }
    if (filters?.offset) {
      params.append("offset", filters.offset.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<any>(`/grants${query}`);
  }

  async getGrantById(id: string) {
    return this.request<any>(`/grants/${id}`);
  }

  async semanticSearch(query: string, topK?: number, filters?: any) {
    return this.request<any>("/semantic-search", {
      method: "POST",
      body: JSON.stringify({ query, topK, filters }),
    });
  }
}

export const apiService = new ApiService();
