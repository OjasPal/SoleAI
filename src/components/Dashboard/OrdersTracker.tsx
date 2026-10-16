import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Phone, 
  ArrowUpRight,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { Order } from '../../types';

interface OrdersTrackerProps {
  orders: Order[];
  onConfirmCod: (orderId: string) => Promise<void>;
  onCancelCod: (orderId: string) => Promise<void>;
}

export const OrdersTracker: React.FC<OrdersTrackerProps> = ({
  orders,
  onConfirmCod,
  onCancelCod,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending_confirmation' | 'verified_by_shopper' | 'cancelled_prevented_rto'>('all');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    return o.codStatus === filter;
  });

  const handleSimulateConfirmation = async (orderId: string, customerName: string) => {
    await onConfirmCod(orderId);
    setNotificationMsg(`✅ Confirmed! ${customerName} tapped WhatsApp verification link. Marked safe for dispatch.`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleCancelRiskyOrder = async (orderId: string, orderNumber: string) => {
    await onCancelCod(orderId);
    setNotificationMsg(`🛡️ RTO Prevented! ${orderNumber} cancelled before courier dispatch. Saved ₹400 in two-way shipping.`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleResendWhatsApp = (customerPhone: string, orderNumber: string) => {
    setNotificationMsg(`📲 WhatsApp 1-tap confirmation message resent to ${customerPhone} for ${orderNumber}!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* RTO Reduction Educational & Stats Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-stone-900 to-emerald-950/30 border border-cyan-800/40 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white font-heading">SoleAI COD Protection & RTO Eliminator</h2>
            </div>
            <p className="text-xs text-stone-300 max-w-2xl">
              Indian footwear brands lose ₹350–₹450 on every unconfirmed COD return. SoleAI sends automated one-tap WhatsApp confirmation right after checkout, filtering out fake addresses and impulsive buyers before dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-stone-950/80 rounded-xl border border-stone-800">
              <span className="text-[10px] uppercase font-mono text-stone-400">Total COD Orders</span>
              <div className="text-lg font-bold text-white font-heading">
                {orders.filter(o => o.paymentMethod === 'COD').length}
              </div>
            </div>
            <div className="text-center px-4 py-2 bg-emerald-950/80 rounded-xl border border-emerald-800/60">
              <span className="text-[10px] uppercase font-mono text-emerald-300">RTO Prevented</span>
              <div className="text-lg font-bold text-emerald-400 font-heading">
                {orders.filter(o => o.codStatus === 'cancelled_prevented_rto').length} Orders
              </div>
            </div>
          </div>
        </div>

        {notificationMsg && (
          <div className="mt-3 p-2.5 bg-cyan-900/40 border border-cyan-700/60 rounded-xl text-xs text-cyan-200 animate-fadeIn flex items-center justify-between">
            <span>{notificationMsg}</span>
            <button onClick={() => setNotificationMsg(null)} className="text-cyan-400 hover:text-white text-xs">✕</button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'all' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending_confirmation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              filter === 'pending_confirmation' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>Pending COD ({orders.filter(o => o.codStatus === 'pending_confirmation').length})</span>
          </button>
          <button
            onClick={() => setFilter('verified_by_shopper')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'verified_by_shopper' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Verified Safe ({orders.filter(o => o.codStatus === 'verified_by_shopper').length})
          </button>
          <button
            onClick={() => setFilter('cancelled_prevented_rto')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'cancelled_prevented_rto' ? 'bg-red-700 text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            RTO Saved ({orders.filter(o => o.codStatus === 'cancelled_prevented_rto').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Item & Size</th>
                <th className="py-3 px-4">Channel & Payment</th>
                <th className="py-3 px-4">COD / RTO Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    No orders match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-800/30 transition-colors">
                    {/* Order ID & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-100 font-mono">{order.orderNumber}</div>
                      <div className="text-[11px] text-stone-500">{order.createdAt}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-200">{order.customerName}</div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-emerald-400" /> {order.customerPhone}
                      </div>
                      <div className="text-[11px] text-stone-500">{order.deliveryCity}</div>
                    </td>

                    {/* Shoe & Size */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={order.shoeImage}
                          alt={order.shoeName}
                          className="w-9 h-9 rounded-lg object-cover border border-stone-800 flex-shrink-0"
                        />
                        <div>
                          <div className="font-medium text-stone-200 line-clamp-1">{order.shoeName}</div>
                          <div className="text-[11px] text-amber-400 font-mono font-bold">
                            UK Size {order.sizeUK} • ₹{order.amountINR}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Channel & Payment */}
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-950 text-stone-400 border border-stone-800">
                        {order.channel}
                      </span>
                      <div className="mt-1 font-semibold text-stone-300">
                        {order.paymentMethod === 'COD' ? (
                          <span className="text-amber-400">Cash on Delivery</span>
                        ) : (
                          <span className="text-emerald-400">Prepaid ({order.paymentMethod})</span>
                        )}
                      </div>
                    </td>

                    {/* COD / RTO Status */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          order.codStatus === 'verified_by_shopper'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                            : order.codStatus === 'pending_confirmation'
                            ? 'bg-amber-950/80 text-amber-400 border-amber-800/80 animate-pulse'
                            : order.codStatus === 'cancelled_prevented_rto'
                            ? 'bg-red-950/80 text-red-400 border-red-800/80'
                            : 'bg-stone-800 text-stone-300 border-stone-700'
                        }`}>
                          {order.codStatus.replace(/_/g, ' ')}
                        </span>

                        {order.paymentMethod === 'COD' && (
                          <div className="text-[10px] text-stone-500">
                            Risk:{' '}
                            <span className={order.rtoRiskScore === 'high' ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                              {order.rtoRiskScore.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      {order.codStatus === 'pending_confirmation' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSimulateConfirmation(order.id, order.customerName)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition-all shadow-sm"
                            title="Simulate customer tapping WhatsApp link"
                          >
                            Simulate Confirm
                          </button>
                          <button
                            onClick={() => handleResendWhatsApp(order.customerPhone, order.orderNumber)}
                            className="p-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-[11px] border border-stone-700"
                            title="Resend WhatsApp Confirmation Link"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCancelRiskyOrder(order.id, order.orderNumber)}
                            className="px-2.5 py-1 bg-red-950 hover:bg-red-900 border border-red-800/60 text-red-300 rounded-lg text-[11px] font-medium transition-all"
                            title="Cancel order before courier pickup to avoid RTO"
                          >
                            Stop RTO
                          </button>
                        </div>
                      ) : order.codStatus === 'verified_by_shopper' ? (
                        <div className="text-emerald-400 text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched via BlueDart
                        </div>
                      ) : order.codStatus === 'cancelled_prevented_rto' ? (
                        <div className="text-red-400 text-[11px] flex items-center justify-end gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Saved ₹400 courier
                        </div>
                      ) : (
                        <span className="text-stone-500 text-[11px]">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
