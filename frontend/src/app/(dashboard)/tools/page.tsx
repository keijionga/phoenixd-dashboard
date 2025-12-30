'use client';

import { useState } from 'react';
import { Search, FileCode, Calculator, Loader2, Zap, Gift, Check, Info } from 'lucide-react';
import { decodeInvoice, decodeOffer, estimateLiquidityFees } from '@/lib/api';
import { formatSats, cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { PageTabs, type TabItem } from '@/components/ui/page-tabs';

interface DecodedInvoice {
  prefix: string;
  timestamp: number;
  nodeId: string;
  serialized: string;
  description: string;
  paymentHash: string;
  expiry: number;
  minFinalCltvExpiry: number;
  amountMsat?: number;
  [key: string]: unknown;
}

interface DecodedOffer {
  offerId: string;
  description?: string;
  nodeId: string;
  serialized: string;
  amount?: { amountMsat?: number };
  [key: string]: unknown;
}

interface LiquidityFees {
  miningFeeSat: number;
  serviceFeeSat: number;
}

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<'invoice' | 'offer' | 'fees'>('invoice');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Decode Invoice
  const [invoiceToDecode, setInvoiceToDecode] = useState('');
  const [decodedInvoice, setDecodedInvoice] = useState<DecodedInvoice | null>(null);

  // Decode Offer
  const [offerToDecode, setOfferToDecode] = useState('');
  const [decodedOffer, setDecodedOffer] = useState<DecodedOffer | null>(null);

  // Estimate Fees
  const [feeAmount, setFeeAmount] = useState('');
  const [estimatedFees, setEstimatedFees] = useState<LiquidityFees | null>(null);

  const handleDecodeInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceToDecode.trim()) return;

    setLoading(true);
    setDecodedInvoice(null);
    try {
      const result = await decodeInvoice({ invoice: invoiceToDecode.trim() });
      setDecodedInvoice(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to decode invoice';
      toast({
        variant: 'destructive',
        title: 'Invalid Invoice',
        description: message.includes('400')
          ? "The invoice format is invalid. Make sure it starts with 'lnbc' or 'lntb'."
          : message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecodeOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerToDecode.trim()) return;

    setLoading(true);
    setDecodedOffer(null);
    try {
      const result = await decodeOffer({ offer: offerToDecode.trim() });
      setDecodedOffer(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to decode offer';
      toast({
        variant: 'destructive',
        title: 'Invalid Offer',
        description: message.includes('400')
          ? "The offer format is invalid. Make sure it starts with 'lno1'."
          : message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEstimateFees = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(feeAmount);
    if (!amount || amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0.',
      });
      return;
    }

    setLoading(true);
    setEstimatedFees(null);
    try {
      const result = await estimateLiquidityFees({ amountSat: amount });
      setEstimatedFees(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to estimate fees';
      toast({ variant: 'destructive', title: 'Estimation Failed', description: message });
    } finally {
      setLoading(false);
    }
  };

  const tabs: TabItem[] = [
    { id: 'invoice', label: 'Invoice', icon: Zap },
    { id: 'offer', label: 'Offer', icon: Gift },
    { id: 'fees', label: 'Fees', icon: Calculator },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tools</h1>
        <p className="mt-1 text-muted-foreground">Decode invoices, offers, and estimate fees</p>
      </div>

      {/* Tab Switcher */}
      <PageTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'invoice' | 'offer' | 'fees')}
      />

      {/* Decode Invoice */}
      {activeTab === 'invoice' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lightning/10">
                <FileCode className="h-6 w-6 text-lightning" />
              </div>
              <div>
                <h3 className="font-semibold">Decode Invoice</h3>
                <p className="text-sm text-muted-foreground">Bolt11 invoice</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-2xl bg-lightning/5 border border-lightning/20 p-4 mb-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-lightning font-medium flex items-center gap-1 mb-1">
                  <Info className="h-3.5 w-3.5" /> What is a Bolt11 invoice?
                </span>
                A payment request that specifies an amount, expiration time, and destination. Paste
                any Lightning invoice starting with{' '}
                <code className="text-foreground bg-white/10 px-1 rounded">lnbc</code> (mainnet) or{' '}
                <code className="text-foreground bg-white/10 px-1 rounded">lntb</code> (testnet) to
                decode it.
              </p>
            </div>

            <form onSubmit={handleDecodeInvoice} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Invoice
                </label>
                <textarea
                  placeholder="lnbc1..."
                  value={invoiceToDecode}
                  onChange={(e) => setInvoiceToDecode(e.target.value)}
                  className="glass-input w-full px-4 py-3 font-mono text-sm h-32 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !invoiceToDecode.trim()}
                className="btn-gradient w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5" /> Decode
                  </>
                )}
              </button>
            </form>
          </div>

          <div className={cn('glass-card rounded-3xl p-6', !decodedInvoice && 'opacity-60')}>
            <h3 className="font-semibold mb-6">Invoice Details</h3>

            {decodedInvoice ? (
              <div className="space-y-4">
                {decodedInvoice.amountMsat && (
                  <div className="rounded-2xl bg-white/5 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-4xl font-bold value-highlight mt-1">
                      {formatSats(Math.floor(decodedInvoice.amountMsat / 1000))}
                    </p>
                    <p className="text-sm text-muted-foreground">sats</p>
                  </div>
                )}

                <div className="space-y-3">
                  {decodedInvoice.description && (
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{decodedInvoice.description}</p>
                    </div>
                  )}

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Payment Hash</p>
                    <p className="font-mono text-xs break-all">{decodedInvoice.paymentHash}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-muted-foreground mb-1">Expiry</p>
                      <p className="font-medium">{decodedInvoice.expiry}s</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-muted-foreground mb-1">Created</p>
                      <p className="text-sm font-medium">
                        {new Date(decodedInvoice.timestamp * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Node ID */}
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Destination Node</p>
                    <p className="font-mono text-xs break-all">{decodedInvoice.nodeId}</p>
                  </div>

                  {/* Raw data for debugging */}
                  <details className="rounded-xl bg-white/5 p-4">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      View raw data
                    </summary>
                    <pre className="mt-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all text-muted-foreground">
                      {JSON.stringify(decodedInvoice, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <FileCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Decode an invoice to see details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decode Offer */}
      {activeTab === 'offer' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                <Gift className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Decode Offer</h3>
                <p className="text-sm text-muted-foreground">Bolt12 offer</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-2xl bg-accent/5 border border-accent/20 p-4 mb-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-accent font-medium flex items-center gap-1 mb-1">
                  <Info className="h-3.5 w-3.5" /> What is a Bolt12 offer?
                </span>
                A reusable payment request that can be paid multiple times. Unlike Bolt11 invoices,
                offers don&apos;t expire and can be used for recurring payments. Paste any offer
                starting with <code className="text-foreground bg-white/10 px-1 rounded">lno1</code>{' '}
                to decode it.
              </p>
            </div>

            <form onSubmit={handleDecodeOffer} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Offer
                </label>
                <textarea
                  placeholder="lno1..."
                  value={offerToDecode}
                  onChange={(e) => setOfferToDecode(e.target.value)}
                  className="glass-input w-full px-4 py-3 font-mono text-sm h-32 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !offerToDecode.trim()}
                className="btn-gradient w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Search className="h-5 w-5" /> Decode
                  </>
                )}
              </button>
            </form>
          </div>

          <div className={cn('glass-card rounded-3xl p-6', !decodedOffer && 'opacity-60')}>
            <h3 className="font-semibold mb-6">Offer Details</h3>

            {decodedOffer ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-success/10 border border-success/30 p-3 flex items-center justify-center gap-2 text-success font-medium">
                  <Check className="h-4 w-4" />
                  Valid Bolt12 Offer
                </div>

                {decodedOffer.amount?.amountMsat && (
                  <div className="rounded-2xl bg-white/5 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-4xl font-bold value-highlight mt-1">
                      {formatSats(Math.floor(decodedOffer.amount.amountMsat / 1000))}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {decodedOffer.description && (
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{decodedOffer.description}</p>
                    </div>
                  )}

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Offer ID</p>
                    <p className="font-mono text-xs break-all">{decodedOffer.offerId}</p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Node ID</p>
                    <p className="font-mono text-xs break-all">{decodedOffer.nodeId}</p>
                  </div>

                  {/* Raw data for debugging */}
                  <details className="rounded-xl bg-white/5 p-4">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      View raw data
                    </summary>
                    <pre className="mt-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all text-muted-foreground">
                      {JSON.stringify(decodedOffer, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <Gift className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Decode an offer to see details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estimate Fees */}
      {activeTab === 'fees' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bitcoin/10">
                <Calculator className="h-6 w-6 text-bitcoin" />
              </div>
              <div>
                <h3 className="font-semibold">Estimate Liquidity Fees</h3>
                <p className="text-sm text-muted-foreground">Inbound liquidity costs</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-2xl bg-bitcoin/5 border border-bitcoin/20 p-4 mb-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-bitcoin font-medium">What is this?</span> When you receive a
                payment larger than your current inbound capacity, Phoenix automatically opens a
                channel or performs a splice. This tool estimates the{' '}
                <span className="text-foreground">on-chain mining fee</span> and{' '}
                <span className="text-foreground">service fee</span> you&apos;ll pay for that extra
                liquidity.
              </p>
            </div>

            <form onSubmit={handleEstimateFees} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Amount (sats)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="glass-input w-full px-4 py-3.5 text-lg font-mono"
                  min="1"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gradient w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Calculator className="h-5 w-5" /> Estimate
                  </>
                )}
              </button>
            </form>
          </div>

          <div className={cn('glass-card rounded-3xl p-6', !estimatedFees && 'opacity-60')}>
            <h3 className="font-semibold mb-6">Fee Estimate</h3>

            {estimatedFees ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/5 p-6 text-center">
                  <p className="text-sm text-muted-foreground">Total Estimated Fee</p>
                  <p className="text-4xl font-bold text-bitcoin mt-2">
                    {formatSats(estimatedFees.miningFeeSat + estimatedFees.serviceFeeSat)}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Mining Fee</p>
                    <p className="font-mono font-medium">
                      {formatSats(estimatedFees.miningFeeSat)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs text-muted-foreground mb-1">Service Fee</p>
                    <p className="font-mono font-medium">
                      {formatSats(estimatedFees.serviceFeeSat)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                  <Calculator className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Enter an amount to estimate fees
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
