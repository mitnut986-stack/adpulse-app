import React, { useState, useEffect } from 'react';
import { UserProfile, FirestoreProduct } from '../types';
import { Logo } from './Logo';
import {
  getFirestoreProducts,
  createFirestoreProduct,
  deleteFirestoreProduct,
  FIREBASE_PROJECT_ID,
  FIREBASE_CONSOLE_URL,
} from '../services/firebaseService';
import {
  TrendingUp,
  DollarSign,
  Eye,
  MousePointerClick,
  Layers,
  CheckCircle2,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Database,
  Plus,
  Trash2,
  Loader2,
  Package,
  X,
  AlertCircle,
} from 'lucide-react';

interface PublisherDashboardViewProps {
  user: UserProfile;
  onSignOut: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const PublisherDashboardView: React.FC<PublisherDashboardViewProps> = ({
  user,
  onSignOut,
  showToast,
}) => {
  // Firestore Products State
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await getFirestoreProducts();
      setProducts(data);
    } catch (err) {
      showToast('Could not load products from Firestore', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      showToast('Please enter a product name', 'error');
      return;
    }
    const priceNum = parseFloat(newProductPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    setIsSavingProduct(true);
    try {
      const created = await createFirestoreProduct(newProductName, priceNum);
      setProducts((prev) => [created, ...prev]);
      setNewProductName('');
      setNewProductPrice('');
      setIsAddModalOpen(false);
      showToast(`Product "${created.name}" created in Firestore!`, 'success');
    } catch (err) {
      showToast('Failed to create product in Firestore', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      await deleteFirestoreProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`Deleted "${name}" from Firestore`, 'info');
    } catch (err) {
      showToast('Failed to delete product', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const totalProductValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-[#dadce0] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4 sm:gap-6">
          <Logo size="sm" />
          <div className="h-5 w-px bg-[#dadce0] hidden sm:block" />
          <span className="text-xs font-mono text-[#5f6368] hidden sm:inline-block">
            {user.publisherId}
          </span>
        </div>

        {/* User profile & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-[#202124]">{user.name}</p>
            <p className="text-[11px] text-[#5f6368]">{user.email}</p>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-xs font-medium uppercase shadow-2xs">
            {user.name.charAt(0)}
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3c4043] hover:text-[#d93025] hover:bg-neutral-100 rounded-lg transition-colors border border-[#dadce0] ml-1"
            title="Sign out of AdPulse"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Verification banner */}
        <div className="bg-white border border-[#dadce0] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#0f9d58] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold text-[#202124]">
                  Active Publisher Account
                </h2>
                <span className="text-[11px] text-[#0f9d58] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Site: <span className="font-mono text-[#1a73e8]">{user.website || 'techpulse-daily.com'}</span> · Crawler status: Verified · ads.txt: Authorized
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => showToast('Publisher earnings sync completed', 'success')}
              className="px-3 py-1.5 text-xs font-medium text-[#1a73e8] hover:bg-blue-50 border border-[#dadce0] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* FIREBASE FIRESTORE LIVE PRODUCTS SECTION */}
        <section className="bg-white border border-[#dadce0] rounded-2xl p-5 sm:p-6 shadow-xs">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#dadce0] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[#202124]">
                    Firebase Firestore Database
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Connected
                  </span>
                </div>
                <p className="text-xs text-[#5f6368] mt-0.5 flex items-center gap-1 flex-wrap">
                  <span>Project:</span>
                  <span className="font-mono text-[#202124] bg-neutral-100 px-1.5 py-0.5 rounded">{FIREBASE_PROJECT_ID}</span>
                  <span>· Collection:</span>
                  <span className="font-mono text-[#1a73e8] bg-blue-50 px-1.5 py-0.5 rounded">products</span>
                </p>
              </div>
            </div>

            {/* Actions: Firebase Console link, Refresh, Add */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={FIREBASE_CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5f6368] hover:text-[#202124] hover:bg-neutral-100 border border-[#dadce0] rounded-lg transition-colors"
                title="Open document in Firebase Console"
              >
                <span>Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={loadProducts}
                disabled={isLoadingProducts}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1a73e8] hover:bg-blue-50 border border-[#dadce0] rounded-lg transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] rounded-lg transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Products Summary Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
            <div className="bg-[#f8fafd] border border-[#e8eaed] rounded-xl p-3">
              <span className="text-[11px] text-[#5f6368]">Total Products</span>
              <p className="text-lg font-bold text-[#202124] mt-0.5">
                {isLoadingProducts ? '...' : products.length}
              </p>
            </div>
            <div className="bg-[#f8fafd] border border-[#e8eaed] rounded-xl p-3">
              <span className="text-[11px] text-[#5f6368]">Catalog Value</span>
              <p className="text-lg font-bold text-[#0f9d58] mt-0.5">
                {isLoadingProducts ? '...' : `$${totalProductValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
            </div>
            <div className="bg-[#f8fafd] border border-[#e8eaed] rounded-xl p-3 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-[#5f6368]">Live Sync Status</span>
              <p className="text-xs font-medium text-[#1a73e8] mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                REST API Active
              </p>
            </div>
          </div>

          {/* Products List */}
          {isLoadingProducts ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#5f6368] gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#1a73e8]" />
              <p className="text-xs">Fetching documents from Firestore...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-[#dadce0] rounded-xl p-6">
              <Package className="w-8 h-8 text-[#5f6368] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-[#202124]">No products found in Firestore</p>
              <p className="text-xs text-[#5f6368] mt-1">Click "Add Product" above to create your first document in Firestore.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#dadce0] text-[#5f6368] uppercase text-[10px] tracking-wider bg-neutral-50/60">
                    <th className="py-2.5 px-3 font-semibold">Product Name</th>
                    <th className="py-2.5 px-3 font-semibold">Price</th>
                    <th className="py-2.5 px-3 font-semibold hidden md:table-cell">Document ID</th>
                    <th className="py-2.5 px-3 font-semibold hidden sm:table-cell">Created</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8eaed]">
                  {products.map((p) => {
                    const isTargetDoc = p.id === '3GgEyjaaNWjb3Xh9TSgJ';
                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-blue-50/30 transition-colors ${
                          isTargetDoc ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-medium text-[#202124]">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{p.name}</span>
                            {isTargetDoc && (
                              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded">
                                Firebase URL Target
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-[#0f9d58] text-sm">
                          ${Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#5f6368] hidden md:table-cell">
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded">{p.id}</span>
                        </td>
                        <td className="py-3 px-3 text-[#5f6368] text-[11px] hidden sm:table-cell">
                          {p.createTime ? new Date(p.createTime).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-[#5f6368] hover:text-[#d93025] hover:bg-red-50 rounded transition-colors"
                            title={`Delete ${p.name}`}
                          >
                            {deletingId === p.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#d93025]" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Estimated Earnings Grid (Google AdSense signature layout) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#202124] uppercase tracking-wider text-[11px]">
              Estimated Earnings
            </h3>
            <span className="text-xs text-[#5f6368]">Currency: USD ($)</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Today */}
            <div className="bg-white border border-[#dadce0] rounded-xl p-4 hover:border-[#1a73e8] transition-colors">
              <span className="text-xs text-[#5f6368] font-medium">Today so far</span>
              <p className="text-xl sm:text-2xl font-bold text-[#202124] mt-1 tabular-nums">
                $148.20
              </p>
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" /> +12.4% vs yesterday
              </span>
            </div>

            {/* Yesterday */}
            <div className="bg-white border border-[#dadce0] rounded-xl p-4">
              <span className="text-xs text-[#5f6368] font-medium">Yesterday</span>
              <p className="text-xl sm:text-2xl font-bold text-[#202124] mt-1 tabular-nums">
                $132.85
              </p>
              <span className="text-[11px] text-[#5f6368] mt-1 block">
                Finalized at 00:00 PST
              </span>
            </div>

            {/* Last 7 Days */}
            <div className="bg-white border border-[#dadce0] rounded-xl p-4">
              <span className="text-xs text-[#5f6368] font-medium">Last 7 days</span>
              <p className="text-xl sm:text-2xl font-bold text-[#202124] mt-1 tabular-nums">
                $984.10
              </p>
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" /> +8.1% vs prev 7 days
              </span>
            </div>

            {/* This Month */}
            <div className="bg-white border border-[#dadce0] rounded-xl p-4 bg-gradient-to-br from-white to-blue-50/30">
              <span className="text-xs text-[#1a73e8] font-medium">This month (Nov)</span>
              <p className="text-xl sm:text-2xl font-bold text-[#1a73e8] mt-1 tabular-nums">
                $4,289.40
              </p>
              <span className="text-[11px] text-[#5f6368] mt-1 block">
                Estimated payout: Dec 21
              </span>
            </div>
          </div>
        </section>

        {/* Ad Performance Telemetry */}
        <section className="bg-white border border-[#dadce0] rounded-xl p-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#dadce0] mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">
                Ad Units & Engagement
              </h3>
              <p className="text-xs text-[#5f6368]">
                Real-time delivery performance across 12 active ad placements
              </p>
            </div>
            <span className="text-xs font-medium text-[#1a73e8] flex items-center gap-1 hover:underline cursor-pointer">
              View Detailed Report <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x-0 sm:divide-x divide-[#dadce0]">
            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#5f6368] mb-1">
                <Eye className="w-3.5 h-3.5 text-[#1a73e8]" />
                <span>Impressions</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[#202124] font-mono tabular-nums">
                3,184,090
              </p>
            </div>

            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#5f6368] mb-1">
                <MousePointerClick className="w-3.5 h-3.5 text-[#0f9d58]" />
                <span>Clicks</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[#202124] font-mono tabular-nums">
                68,140
              </p>
            </div>

            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#5f6368] mb-1">
                <DollarSign className="w-3.5 h-3.5 text-[#f4b400]" />
                <span>Page RPM</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[#202124] font-mono tabular-nums">
                $3.02
              </p>
            </div>

            <div className="px-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#5f6368] mb-1">
                <Layers className="w-3.5 h-3.5 text-[#9334ea]" />
                <span>Click-Through Rate</span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[#202124] font-mono tabular-nums">
                2.14%
              </p>
            </div>
          </div>
        </section>

        {/* Payout & Payment Card */}
        <section className="bg-white border border-[#dadce0] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1a73e8] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#5f6368]">Current Unpaid Balance</p>
              <p className="text-lg font-bold text-[#202124] tabular-nums">$1,240.00</p>
              <p className="text-[11px] text-[#5f6368]">
                Last payment: <strong className="text-[#202124]">$3,812.50</strong> on Oct 21 via Wire Transfer (••• 4019)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Payment settings dialog is open', 'info')}
              className="px-4 py-2 text-xs font-medium text-[#1a73e8] hover:bg-blue-50 rounded-lg border border-[#dadce0] transition-colors"
            >
              Manage Payment Methods
            </button>
            <button
              onClick={onSignOut}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Back to Login Flow</span>
            </button>
          </div>
        </section>
      </main>

      {/* Add Product Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dadce0] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#dadce0]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#1a73e8]" />
                <h3 className="font-semibold text-base text-[#202124]">
                  Add Product to Firestore
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="py-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#5f6368] block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Premium Ad Slot, Nut, Banner"
                  required
                  autoFocus
                  disabled={isSavingProduct}
                  className="w-full h-10 px-3 border border-[#dadce0] rounded-lg text-sm text-[#202124] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5f6368] block mb-1">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  placeholder="e.g. 2222"
                  required
                  disabled={isSavingProduct}
                  className="w-full h-10 px-3 border border-[#dadce0] rounded-lg text-sm text-[#202124] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none"
                />
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 text-[11px] text-[#174ea6] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#1a73e8]" />
                <span>This document will be written directly to collection <code className="font-semibold">products</code> on project <code className="font-semibold">{FIREBASE_PROJECT_ID}</code>.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSavingProduct}
                  className="px-4 py-2 text-xs font-medium text-[#5f6368] hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  {isSavingProduct ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save to Firestore</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
