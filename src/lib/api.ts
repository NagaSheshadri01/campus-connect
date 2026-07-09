import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ServiceRequest = Tables<"service_requests"> & {
  categories?: { name: string } | null;
  student_profile?: { full_name: string | null } | null;
  technician_profile?: { full_name: string | null } | null;
};

export type Category = Tables<"categories">;

export interface DashboardStats {
  total: number;
  pending: number;
  active: number;
  resolved: number;
}

const REQUEST_SELECT = `
  *,
  categories(name),
  student_profile:profiles!service_requests_student_id_fkey(full_name),
  technician_profile:profiles!service_requests_technician_id_fkey(full_name)
`;

export async function fetchServiceRequests() {
  const { data, error } = await supabase
    .from("service_requests")
    .select(REQUEST_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ServiceRequest[];
}

export async function fetchMyRequests(profileId: string) {
  const { data, error } = await supabase
    .from("service_requests")
    .select(REQUEST_SELECT)
    .eq("student_id", profileId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ServiceRequest[];
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function createServiceRequest(req: {
  title: string;
  description: string;
  priority: string;
  student_id: string;
  category_id: string;
}) {
  const { data, error } = await supabase
    .from("service_requests")
    .insert(req)
    .select(REQUEST_SELECT)
    .single();
  if (error) throw error;
  return data as ServiceRequest;
}

export async function updateServiceStatus(id: string, status: string, technician_id?: string) {
  const update: Record<string, unknown> = { status };
  if (technician_id !== undefined) update.technician_id = technician_id || null;
  const { data, error } = await supabase
    .from("service_requests")
    .update(update)
    .eq("id", id)
    .select(REQUEST_SELECT)
    .single();
  if (error) throw error;
  return data as ServiceRequest;
}

export async function fetchTechnicians() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "Technician");
  if (error) throw error;
  return data;
}

export function getDashboardStats(requests: ServiceRequest[]): DashboardStats {
  return {
    total: requests.length,
    pending: requests.filter((r) => r.status === "Submitted").length,
    active: requests.filter((r) => r.status === "Assigned" || r.status === "In Progress").length,
    resolved: requests.filter((r) => r.status === "Resolved").length,
  };
}

export function subscribeToRequests(callback: (payload: unknown) => void) {
  return supabase
    .channel("service_requests_realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "service_requests" }, callback)
    .subscribe();
}
