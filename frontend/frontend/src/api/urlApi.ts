import axios from "axios";

const API = axios.create({
  baseURL: "https://shortroute.onrender.com/api",
  timeout: 8000
});

export interface UrlItem {
  _id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  clickCount: number
  createdAt: string
  lastClickedAt: string | null
}

export interface AnalyticsSummary {
  totalUrls: number
  totalClicks: number
  averageClicks: number
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary
  topUrls: UrlItem[]
  recentUrls: UrlItem[]
}

export const shortenUrl = async (
  originalUrl: string,
  customAlias?: string
) => {

  const response = await API.post("/shorten", {
    originalUrl,
    customAlias
  });

  return response.data;
};

export const getAllUrls = async (search = ""): Promise<UrlItem[]> => {
  const response = await API.get("/urls", {
    params: { search }
  })
  return response.data?.urls || []
}

export const deleteUrl = async (id: string): Promise<void> => {
  await API.delete(`/urls/${id}`)
}

export const getAnalyticsSummary = async (): Promise<AnalyticsResponse> => {
  const response = await API.get("/analytics/summary")
  return response.data
}