'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Package, MapPin, Clock, DollarSign, CheckCircle, XCircle, TrendingUp, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLanguageByCode } from '@/lib/languages';

interface Delivery {
  _id: string;
  trackingId: string;
  senderName: string;
  receiverName: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageType: string;
  urgency: string;
  status: string;
  price: number;
  createdAt: string;
}

export default function CourierDashboardPage() {
  const t = useTranslations('courier.dashboard');
  const locale = useLocale();
  const router = useRouter();
  const theme = getLanguageByCode(locale)?.culturalTheme;

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedDeliveries: 0,
    rating: 4.8,
    activeDeliveries: 0,
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('cc_token');
    if (!token) {
      router.push(`/${locale}/courier/login`);
      return;
    }

    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('cc_token');
      const response = await fetch(`/api/courier/deliveries?status=${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDeliveries(data.deliveries || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (deliveryId: string) => {
    try {
      const token = localStorage.getItem('cc_token');
      const response = await fetch(`/api/courier/accept/${deliveryId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Accept error:', error);
    }
  };

  const handleUpdateStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('cc_token');
      const response = await fetch(`/api/courier/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryId, status: newStatus }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cc_token');
    router.push(`/${locale}/courier/login`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('title') || 'Courier Dashboard'}</h1>
            <p className="text-muted-foreground">{t('subtitle') || 'Manage your deliveries and earnings'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-all"
          >
            {t('logout') || 'Logout'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" style={{ color: theme?.primary || '#10B981' }} />
              <span className="text-2xl font-bold">${stats.totalEarnings}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('totalEarnings') || 'Total Earnings'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8" style={{ color: theme?.primary || '#3B82F6' }} />
              <span className="text-2xl font-bold">{stats.completedDeliveries}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('completed') || 'Completed'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" style={{ color: theme?.primary || '#F59E0B' }} />
              <span className="text-2xl font-bold">{stats.rating} ⭐</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('rating') || 'Rating'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8" style={{ color: theme?.primary || '#8B5CF6' }} />
              <span className="text-2xl font-bold">{stats.activeDeliveries}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('active') || 'Active'}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {[
            { key: 'available', label: t('available') || 'Available', count: deliveries.length },
            { key: 'active', label: t('activeTab') || 'Active', count: stats.activeDeliveries },
            { key: 'completed', label: t('completedTab') || 'Completed', count: stats.completedDeliveries },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === tab.key
                  ? 'border-b-2 '
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={activeTab === tab.key ? { borderColor: theme?.primary || '#3B82F6', color: theme?.primary || '#3B82F6' } : {}}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Deliveries List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto"
              style={{ borderColor: `${theme?.primary || '#3B82F6'} transparent transparent transparent` }}
            />
            <p className="mt-4 text-muted-foreground">{t('loading') || 'Loading...'}</p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">{t('noDeliveries') || 'No deliveries'}</p>
            <p className="text-muted-foreground">{t('noDeliveriesDesc') || 'Check back soon for new opportunities!'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery, idx) => (
              <motion.div
                key={delivery._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: `${theme?.primary || '#3B82F6'}20`, color: theme?.primary || '#3B82F6' }}
                      >
                        {delivery.trackingId}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600">
                        ${delivery.price}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {delivery.urgency}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4" style={{ color: theme?.primary || '#3B82F6' }} />
                          {t('pickup') || 'Pickup'}
                        </p>
                        <p className="text-sm text-muted-foreground">{delivery.senderName}</p>
                        <p className="text-sm text-muted-foreground">{delivery.pickupAddress}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4" style={{ color: theme?.secondary || '#FF6B6B' }} />
                          {t('delivery') || 'Delivery'}
                        </p>
                        <p className="text-sm text-muted-foreground">{delivery.receiverName}</p>
                        <p className="text-sm text-muted-foreground">{delivery.deliveryAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{t('package') || 'Package'}: {delivery.packageType}</span>
                      <span>{t('created') || 'Created'}: {new Date(delivery.createdAt).toLocaleDateString(locale)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {activeTab === 'available' && (
                      <button
                        onClick={() => handleAccept(delivery._id)}
                        className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-all"
                        style={{ backgroundColor: theme?.primary || '#3B82F6' }}
                      >
                        {t('accept') || 'Accept'}
                      </button>
                    )}

                    {activeTab === 'active' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(delivery._id, 'picked_up')}
                          className="px-4 py-2 rounded-lg font-medium border hover:bg-gray-50 transition-all"
                        >
                          {t('markPickedUp') || 'Picked Up'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(delivery._id, 'delivered')}
                          className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-all"
                          style={{ backgroundColor: theme?.primary || '#10B981' }}
                        >
                          {t('markDelivered') || 'Delivered'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
