"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function OrderConfirmedPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full text-center space-y-6"
      >
        <h1 className="text-3xl font-bold text-warm-white">
          Thank you for your order!
        </h1>

        <div className="glass-panel p-6 space-y-2">
          <p className="text-warm-muted text-sm">Order ID</p>
          <p className="text-warm-white font-mono text-lg">{orderId}</p>
        </div>

        <p className="text-warm-muted leading-relaxed">
          Our AI artists are now creating your personalised board game.
          You&apos;ll receive an email with a preview within a few hours.
        </p>

        <p className="text-warm-muted text-sm">
          You can check on your order status anytime:
        </p>

        <a
          href={`/order/${orderId}/status`}
          className="inline-block px-6 py-3 rounded-xl bg-amber text-warm-bg
                     font-semibold hover:opacity-90 transition-opacity"
        >
          View Order Status
        </a>
      </motion.div>
    </div>
  );
}
