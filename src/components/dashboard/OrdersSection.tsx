import React, { useState } from 'react';
import { Order } from '../../types';
import { PageHeader } from '../layout/PageHeader';
import { Panel } from '../ui/Panel';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { StatusDot } from '../ui/StatusDot';
import { Button } from '../ui/Button';
import { formatINR } from '../../lib/format';

export interface OrdersSectionProps {
  orders: Order[];
  onConfirmCod: (orderId: string) => Promise<void>;
  onCancelCod: (orderId: string) => Promise<void>;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  onConfirmCod,
  onCancelCod,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'prevented'>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => {
    if (filter === 'pending') return o.codStatus === 'pending_confirmation';
    if (filter === 'verified') return o.codStatus === 'verified_by_shopper' || o.codStatus === 'shipped' || o.codStatus === 'delivered';
    if (filter === 'prevented') return o.codStatus === 'cancelled_prevented_rto';
    return true;
  });

  const getStatusProps = (status: Order['codStatus']) => {
    switch (status) {
      case 'verified_by_shopper':
      case 'shipped':
      case 'delivered':
        return { status: 'ok' as const, label: status.replace(/_/g, ' ') };
      case 'pending_confirmation':
        return { status: 'warn' as const, label: 'Pending confirmation' };
      case 'cancelled_prevented_rto':
        return { status: 'risk' as const, label: 'RTO prevented' };
      default:
        return { status: 'neutral' as const, label: status };
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        primaryTitle="Orders & COD."
        secondaryTitle={`${orders.length} total orders across simulated channels.`}
        description="Verify COD buyers via WhatsApp before courier handover to slash Return-to-Origin (RTO)."
      />

      {/* Segmented Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'pending', label: `Needs Confirmation (${orders.filter(o => o.codStatus === 'pending_confirmation').length})` },
          { id: 'verified', label: `Verified Safe (${orders.filter(o => o.codStatus === 'verified_by_shopper' || o.codStatus === 'shipped').length})` },
          { id: 'prevented', label: `RTO Prevented (${orders.filter(o => o.codStatus === 'cancelled_prevented_rto').length})` },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`h-8 px-3.5 rounded-pill text-small font-medium transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-white text-black font-semibold'
                : 'bg-bg-raised text-text-2 hover:text-text border border-line'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Panel className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Item & Size</TableHead>
              <TableHead>Payment & Risk</TableHead>
              <TableHead>COD Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-text-3">
                  No orders match this filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map(ord => {
                const statusProps = getStatusProps(ord.codStatus);

                return (
                  <TableRow key={ord.id}>
                    <TableCell>
                      <span className="font-mono text-small font-bold text-text block">{ord.orderNumber}</span>
                      <span className="text-[11px] text-text-3 font-mono">{ord.createdAt}</span>
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-small text-text block">{ord.customerName}</span>
                      <span className="text-[11px] text-text-3 truncate block">{ord.deliveryCity}</span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={ord.shoeImage}
                          alt={ord.shoeName}
                          className="w-7 h-7 rounded-md object-cover bg-bg-sunken border border-line flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-small text-text block truncate">{ord.shoeName}</span>
                          <span className="text-[11px] font-mono text-text-3">UK {ord.sizeUK} • {formatINR(ord.amountINR)}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-small text-text block">
                        {ord.paymentMethod === 'COD' ? 'Cash on Delivery' : ord.paymentMethod}
                      </span>
                      <span className="text-[11px] font-mono uppercase text-text-3">
                        Risk: {ord.rtoRiskScore}
                      </span>
                    </TableCell>

                    <TableCell>
                      <StatusDot status={statusProps.status} label={statusProps.label} />
                    </TableCell>

                    <TableCell className="text-right">
                      {ord.codStatus === 'pending_confirmation' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" size="sm" onClick={() => onConfirmCod(ord.id)}>
                            Confirm
                          </Button>

                          {cancellingId === ord.id ? (
                            <div className="flex items-center gap-1.5 text-small">
                              <button
                                onClick={() => {
                                  onCancelCod(ord.id);
                                  setCancellingId(null);
                                }}
                                className="text-risk font-semibold underline hover:text-red-400 cursor-pointer"
                              >
                                Stop RTO?
                              </button>
                              <button
                                onClick={() => setCancellingId(null)}
                                className="text-text-3 hover:text-text cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancellingId(ord.id)}
                              className="text-small text-text-3 hover:text-risk transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-text-3 uppercase">
                          {ord.codStatus === 'cancelled_prevented_rto' ? 'Courier saved' : 'Dispatched'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Panel>
    </div>
  );
};
