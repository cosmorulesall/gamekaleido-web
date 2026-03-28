"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrderStatus, type OrderStatusResponse } from "@/lib/api";

const STATUS_LABELS: Record<string, { label: string; description: string }> = {
  draft: { label: "Pending", description: "Waiting for payment..." },
  paid: { label: "Payment Received", description: "Your order is confirmed. Generation starting soon." },
  queued: { label: "In Queue", description: "Your game is queued for creation." },
  generating: { label: "Creating Your Game", description: "Our AI artists are at work..." },
  generated: { label: "Assets Created", description: "Your game assets have been generated." },
  preview_ready: { label: "Preview Ready", description: "Your preview is ready to review!" },
  customer_approved: { label: "Approved", description: "You approved your game. Finalising now." },
  admin_review: { label: "Quality Check", description: "Our team is reviewing your game." },
  rendering_final: { label: "Rendering", description: "Creating print-ready files..." },
  ready_for_dispatch: { label: "Ready to Ship", description: "Your game is ready for dispatch." },
  shipped: { label: "Shipped", description: "Your game is on its way!" },
  delivered: { label: "Delivered", description: "Enjoy your game!" },
};

const TERMINAL_STATUSES = ["preview_ready", "customer_approved", "shipped", "delivered", "pipeline_failed"];

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function poll() {
      try {
        const data = await getOrderStatus(orderId);
        setOrder(data);
        if (TERMINAL_STATUSES.includes(data.status)) {
          clearInterval(interval);
        }
      } catch {
        setError("Unable to load order status. Please check your order ID.");
      }
    }

    poll();
    interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="text-2xl font-bold text-warm-white">Order Not Found</h1>
          <p className="text-warm-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-muted">Loading...</p>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[order.status] || {
    label: order.status,
    description: "Processing...",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-6">
        <h1 className="text-2xl font-bold text-warm-white text-center">
          Order Status
        </h1>

        <div className="glass-panel p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-warm-muted text-sm">Order</p>
              <p className="text-warm-white font-mono">{order.order_id}</p>
            </div>
            <div className="text-right">
              <p className="text-warm-muted text-sm">Edition</p>
              <p className="text-warm-white capitalize">{order.edition}</p>
            </div>
          </div>

          {order.game_name && (
            <div>
              <p className="text-warm-muted text-sm">Game</p>
              <p className="text-warm-white text-lg font-semibold">
                {order.game_name}
              </p>
            </div>
          )}

          <div className="border-t border-warm-border pt-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber animate-pulse" />
              <div>
                <p className="text-warm-white font-semibold">
                  {statusInfo.label}
                </p>
                <p className="text-warm-muted text-sm">
                  {statusInfo.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-warm-muted text-xs">
          This page updates automatically.
        </p>
      </div>
    </div>
  );
}
