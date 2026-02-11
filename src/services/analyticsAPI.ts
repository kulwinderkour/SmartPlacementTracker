const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface AnalyticsSummary {
  totals: {
    opportunities: number;
    applications: number;
    interviews: number;
    offers: number;
    rejections: number;
  };
  statusBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  topCompanies: Array<{
    _id: string;
    count: number;
  }>;
}

export interface ChartData {
  timeline: Array<{
    date: string;
    count: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
  }>;
  companyDistribution: Array<{
    company: string;
    count: number;
  }>;
  priorityDistribution: Array<{
    name: string;
    value: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    value: number;
  }>;
}

export interface TrendsData {
  successRate: number;
  avgDaysToOffer: number;
  interviewConversionRate: number;
  mostActiveMonth: string;
}

export const analyticsAPI = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/summary`);
    if (!response.ok) {
      throw new Error('Failed to fetch analytics summary');
    }
    return response.json();
  },

  getCharts: async (filters?: {
    startDate?: string;
    endDate?: string;
    company?: string;
  }): Promise<ChartData> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.company) params.append('company', filters.company);

    const url = `${API_BASE_URL}/api/analytics/charts${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch chart data');
    }
    return response.json();
  },

  getCompanies: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/companies`);
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    return response.json();
  },

  getTrends: async (): Promise<TrendsData> => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/trends`);
    if (!response.ok) {
      throw new Error('Failed to fetch trends');
    }
    return response.json();
  },
};
