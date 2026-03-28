const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Types ---

export interface CreateCheckoutRequest {
  archetype: string;
  edition: string;
  customer_email: string;
  customer_name?: string;
  wizard_answers: Record<string, unknown>;
  is_gift?: boolean;
  gift_message?: string;
  delivery_name?: string;
  delivery_address?: Record<string, string>;
}

export interface CreateCheckoutResponse {
  checkout_url: string;
  order_id: string;
}

export interface OrderStatusResponse {
  order_id: string;
  status: string;
  archetype: string;
  edition: string;
  created_at: string;
  game_name?: string;
}

export interface TextTeaserRequest {
  archetype: string;
  wizard_answers: Record<string, unknown>;
}

export interface TextTeaserResponse {
  game_name: string;
  tagline: string;
  property_names: string[];
  colour_palette: string[];
}

export interface PhotoUploadResponse {
  upload_url: string;
  r2_key: string;
}

// --- API calls ---

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `API error: ${res.status}`);
  }
  return res.json();
}

export function createCheckout(data: CreateCheckoutRequest) {
  return apiFetch<CreateCheckoutResponse>("/api/orders/create-checkout", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getOrderStatus(orderId: string) {
  return apiFetch<OrderStatusResponse>(`/api/orders/${orderId}/status`);
}

export function getTextTeaser(data: TextTeaserRequest) {
  return apiFetch<TextTeaserResponse>("/api/wizard/preview", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function requestPhotoUploadUrl(
  characterId: string,
  filename: string,
  contentType: string = "image/jpeg",
) {
  return apiFetch<PhotoUploadResponse>("/api/uploads/photo", {
    method: "POST",
    body: JSON.stringify({
      character_id: characterId,
      filename,
      content_type: contentType,
    }),
  });
}

export async function uploadPhotoToR2(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
}
