// Now I'm no expert on client components, but they tell me this one runs in the browser.
// The more I learn about server-side rendering, the more I don't care for it.
'use client';

// You know what's great? Importing things. Really gets the blood pumping.
import CourierEarnings from '@/components/CourierEarnings';
import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion'; // This library makes things wiggle. Real cutting-edge stuff.
import { CheckCircle, Clock, DollarSign, MapPin, Package, TrendingUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

// So this is what they call a "TypeScript interface". Fancy word for "here's what a delivery looks like, dummy."
// Back in my day, we just passed around objects and hoped for the best. And you know what? We were HAPPY.
interface PackageYouGottaDeliver {
  _id: string; // MongoDB's idea of an ID. Real creative, those database folks.
  trackingId: string; // Like a social security number, but for boxes nobody wants
  senderName: string; // The schmuck who wants something moved
  senderAddress: string; // Where the schmuck lives
  receiverName: string; // The OTHER schmuck
  receiverAddress: string; // Where the other schmuck lives
  packageType: string; // Could be drugs. Probably not. But could be.
  packageSize?: string; // Optional, because apparently size doesn't always matter
  urgency: string; // How fast the schmucks want their junk moved
  status: string; // The bureaucratic state of the box
  price: number; // The almighty dollar. Or Euro. Or whatever these people use.
  courierEarnings?: number; // What YOU get. Emphasis on the question mark there.
  platformFee?: number; // What WE get. Notice no question mark.
  distance?: number; // How far you gotta schlep this thing
  distanceText?: string; // Same thing but with words, because numbers are hard
  duration?: number; // How long it'll take. Spoiler: longer than you think.
  durationText?: string; // Again, for people who can't read numbers
  distanceEstimated?: boolean; // Translation: "We're guessing and hope we're not wrong"
  createdAt: string; // When some genius decided this delivery needed to exist
  serviceCity?: string; // What city gets the privilege of this delivery
  serviceCountry?: string; // What country. In case you forgot where you live.
}

// This is the main dashboard. It's like the cockpit of an airplane, except instead of flying,
// you're just looking at a screen wondering why you chose this line of work.
export default function TheMotherOfAllCourierDashboards() {
  // Translation hooks. Because God forbid we just use English like civilized people.
  const t = useTranslations('courier.dashboard');
  const pricingT = useTranslations('pricing'); // Money talk. My favorite language.
  const mapsT = useTranslations('maps'); // For when you're lost. Both literally and metaphorically.
  const locale = useLocale(); // What language you speak. Or think you speak.
  const router = useRouter(); // This thing navigates. Like a GPS, but for React components.
  const theme = getLanguageByCode(locale)?.culturalTheme; // Colors and whatnot. Real artsy.

  // State management. Or as I call it, "keeping track of stuff that changes."
  const [deliveries, setDeliveries] = useState<PackageYouGottaDeliver[]>([]); // All the junk people want moved
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available'); // Which tab you clicked. Riveting.
  const [loading, setLoading] = useState(true); // Are we loading? Spoiler: always.
  
  // Statistics. Because numbers make people feel important.
  const [stats, setStats] = useState({
    totalEarnings: 0, // How much you've made. Probably not enough.
    todayEarnings: 0, // What you made today. Even less.
    weekEarnings: 0, // This week's damage
    monthEarnings: 0, // Monthly disappointment
    completedDeliveries: 0, // Boxes successfully moved
    todayDeliveries: 0, // Today's quota
    averageEarningsPerDelivery: 0, // Math nobody asked for
    platformFeesTotal: 0, // What we took from you. Whoops.
    rating: 4.8, // Fake internet points
    activeDeliveries: 0, // How many boxes you're currently schlepping
  });

  // This thing formats money. You know, adds the little dollar sign and the decimals.
  // Real sophisticated stuff. The kind of thing that makes you feel like a banker.
  const currencyFormatter = useMemo(() => (
    new Intl.NumberFormat(locale || 'en', {
      style: 'currency',
      currency: 'USD', // Good ol' American dollars. Or as I call them, "disappointment tickets."
      minimumFractionDigits: 2, // Because $5 isn't as impressive as $5.00
    })
  ), [locale]);

  // Takes a number and makes it look like money. Magic, really.
  const formatCurrency = (value?: number) => currencyFormatter.format(value ?? 0);

    // This bad boy fetches all your dashboard data. And by "fetches," I mean it asks the server real nice.
    // It's like going to the store, except instead of milk, you're getting JSON. Delicious JSON.
    const fetchDashboardData = useCallback(async () => {
        setLoading(true); // We're loading now, folks. Everybody stay calm.
        try {
            // First, we check if you've got a token. It's like a hall pass, but for APIs.
            const token = localStorage.getItem('cc_token');
            if (!token) {
                // No token? Get outta here. Go login like an honest person.
                router.push(`/${locale}/courier/login`);
                return;
            }

            // Now we ask the server for the goods. Politely, of course.
            const response = await fetch(`/api/courier/deliveries?status=${activeTab}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // "Bearer" sounds fancy. Like a medieval knight.
                },
            });

            if (response.ok) {
                // Success! The server likes us today.
                const data = await response.json();
                setDeliveries(data.deliveries || []); // Here's your deliveries. Merry Christmas.
                if (data.stats) setStats(data.stats); // And here's some numbers to stare at.
            } else if (response.status === 401) {
                // 401 means "who are you again?" Time to login, pal.
                router.push(`/${locale}/courier/login`);
            }
        } catch (error) {
            // Something went wrong. But we're not gonna talk about it. Too embarrassing.
            // Just gonna pretend this never happened and move on with our lives.
        } finally {
            setLoading(false); // Done loading. You can breathe now.
        }
    }, [activeTab, locale, router]);

    // Run that fetch function when the component loads. It's called "useEffect," which is a terrible name.
    // Should've called it "doThisWhenStuffHappens" but nobody asked me.
    useEffect(() => {
        fetchDashboardData(); // Go get the data, you beautiful function you.
    }, [fetchDashboardData]);

  // This function accepts a delivery. You're committed now, buddy. No backing out.
  // It's like marriage, except with a box instead of a person. Actually, come to think of it...
  const handleAccept = async (deliveryId: string) => {
    try {
      const token = localStorage.getItem('cc_token'); // Get your hall pass
      const response = await fetch(`/api/courier/accept/${deliveryId}`, {
        method: 'POST', // POST means "I want this." Very demanding.
        headers: {
          'Authorization': `Bearer ${token}`, // Here's my credentials, officer
        },
      });

      if (response.ok) {
        // Congratulations! You've accepted a delivery. Your life is now complete.
        fetchDashboardData(); // Refresh the page so you can see what you've gotten yourself into
      }
    } catch (error) {
      // Error accepting delivery. Or as I like to call it, "dodging a bullet."
      // But we're not gonna tell the user that. Just gonna act like nothing happened.
    }
  };

  // Update the status of a delivery. It's like updating your Facebook status, but with actual consequences.
  const handleUpdateStatus = async (deliveryId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('cc_token');
      const response = await fetch(`/api/courier/update-status`, {
        method: 'PUT', // PUT. Because POST wasn't confusing enough.
        headers: {
          'Content-Type': 'application/json', // We're sending JSON. Real Web 2.0 stuff.
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryId, status: newStatus }), // Turn objects into strings. Computers love it.
      });

      if (response.ok) {
        // Status updated! Somewhere, a database record just changed. Thrilling.
        fetchDashboardData();
      }
    } catch (error) {
      // Update failed. The delivery is stuck in limbo. Like purgatory, but for packages.
    }
  };

  // Logout function. Kick 'em out. Remove their credentials. Wipe the slate clean.
  // It's brutal, really. One click and you're nobody. Just another anonymous internet user.
  const handleLogout = () => {
    localStorage.removeItem('cc_token'); // Delete the token. Burn the hall pass.
    router.push(`/${locale}/courier/login`); // Back to the login page. See you never.
  };

  // And now, the visual part. The part where we actually SHOW you things.
  // HTML, CSS, all that jazz. The stuff that makes programmers feel like artists.
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - You know, the thing at the top. Real revolutionary design choice there. */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('title') || 'Courier Dashboard'}</h1>
            <p className="text-muted-foreground">{t('subtitle') || 'Manage your deliveries and earnings'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-all"
          >
            {t('logout') || 'Logout'} {/* See ya. Don't let the door hit you on the way out. */}
          </button>
        </div>

        {/* Stats Grid - Look at all these numbers! They make you feel productive, don't they? */}
        <CourierEarnings data={stats} />

        {/* Legacy Stats Grid - "Legacy" is code for "we built this twice because we forgot about the first one."
            Can be removed if desired, but let's be honest, nobody's gonna do that. */}
        <div className="grid md:grid-cols-4 gap-6 mb-8 mt-8">
          {/* Money card. The most important one. Let's not kid ourselves. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} /* Starts invisible and slightly down. Very dramatic. */
            animate={{ opacity: 1, y: 0 }}  /* Then fades in. Like a magic trick, but slower. */
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" style={{ color: theme?.primary || '#10B981' }} />
              <span className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('totalEarnings') || 'Total Earnings'}</p>
          </motion.div>

          {/* Completed deliveries. Look at you, getting things done. Your mother would be proud. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }} /* Delayed by 0.1 seconds. Because we're fancy. */
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8" style={{ color: theme?.primary || '#3B82F6' }} />
              <span className="text-2xl font-bold">{stats.completedDeliveries}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('completed') || 'Completed'}</p>
          </motion.div>

          {/* Rating card. 4.8 stars. Not bad. Not great either, but who's keeping score? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }} /* Even more delayed. We're really milking this animation. */
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" style={{ color: theme?.primary || '#F59E0B' }} />
              <span className="text-2xl font-bold">{stats.rating} ⭐</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('rating') || 'Rating'}</p>
          </motion.div>

          {/* Active deliveries. How many boxes you're juggling right now. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }} /* Last one. Thank God. */
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8" style={{ color: theme?.primary || '#8B5CF6' }} />
              <span className="text-2xl font-bold">{stats.activeDeliveries}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('active') || 'Active'}</p>
          </motion.div>
        </div>

        {/* Tabs - Like the tabs in a file cabinet, except digital. Progress, ladies and gentlemen. */}
        <div className="flex gap-2 mb-6 border-b">
          {[
            { key: 'available', label: t('available') || 'Available', count: deliveries.length }, // Boxes waiting for suckers... I mean, couriers
            { key: 'active', label: t('activeTab') || 'Active', count: stats.activeDeliveries }, // Currently being schlepped
            { key: 'completed', label: t('completedTab') || 'Completed', count: stats.completedDeliveries }, // Ancient history
          ].map((tab) => (
            // Each tab is a button. Click it and BAM - different content. Revolutionary stuff.
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)} /* "as any" - the TypeScript equivalent of "just trust me, bro" */
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === tab.key
                  ? 'border-b-2 ' // Active tab gets a fancy underline. Living the high life.
                  : 'text-muted-foreground hover:text-foreground' // Inactive tabs look sad and gray
              }`}
              style={activeTab === tab.key ? { borderColor: theme?.primary || '#3B82F6', color: theme?.primary || '#3B82F6' } : {}}
            >
              {tab.label} ({tab.count}) {/* The count is in parentheses. Very official looking. */}
            </button>
          ))}
        </div>

        {/* Deliveries List - The main event. The reason you're here. Your entire existence, really. */}
        {loading ? (
          // Still loading. Watch the spinny thing. Mesmerizing, isn't it?
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto"
              style={{ borderColor: `${theme?.primary || '#3B82F6'} transparent transparent transparent` }}
            />
            <p className="mt-4 text-muted-foreground">{t('loading') || 'Loading...'}</p>
            {/* Seriously though, why do things take so long to load? It's 2025, people. */}
          </div>
        ) : deliveries.length === 0 ? (
          // No deliveries. Empty. Void. The existential crisis of dashboard pages.
          <div className="text-center py-12 bg-white rounded-xl">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">{t('noDeliveries') || 'No deliveries'}</p>
            <p className="text-muted-foreground">{t('noDeliveriesDesc') || 'Check back soon for new opportunities!'}</p>
            {/* Translation: Go do something else. Maybe take up knitting. */}
          </div>
        ) : (
          // Here they are. The deliveries. Your bread and butter. Your raison d'être, if you're fancy.
          <div className="space-y-4">
            {deliveries.map((delivery, idx) => {
              // Math time! Let's figure out who gets what money. Spoiler: we get a cut.
              const courierShare = delivery.courierEarnings ?? Number(((delivery.price ?? 0) * 0.7).toFixed(2)); // You get 70%. Generous, really.
              const platformShareValue = delivery.platformFee ?? Math.max(Number(((delivery.price ?? 0) - courierShare).toFixed(2)), 0); // We get the rest. Cost of doing business, pal.
              const distanceLabel = delivery.distanceText || (typeof delivery.distance === 'number' ? `${delivery.distance.toFixed(1)} km` : undefined); // How far
              const durationLabel = delivery.durationText || (typeof delivery.duration === 'number' ? `${delivery.duration} min` : undefined); // How long

              return (
              // Each delivery card. A beautiful snowflake of information. Or a boring rectangle. Depends on your perspective.
              <motion.div
                key={delivery._id}
                initial={{ opacity: 0, y: 20 }} // Starts invisible. Again with the dramatic entrance.
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }} // Each card delays slightly more. Like a wave. Very poetic.
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Badges and labels. Making everything look official since forever. */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {/* Tracking ID badge. Like a name tag, but for boxes. */}
                      <span className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: `${theme?.primary || '#3B82F6'}20`, color: theme?.primary || '#3B82F6' }}
                      >
                        {delivery.trackingId}
                      </span>
                      {/* What you get paid. The number that matters. */}
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600">
                        {pricingT('courierEarnings')}: {formatCurrency(courierShare)}
                      </span>
                      {/* Total price. Before we take our cut. */}
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                        {pricingT('total')}: {formatCurrency(delivery.price)}
                      </span>
                      {/* Urgency. How fast they want it. Spoiler: always faster than possible. */}
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {delivery.urgency}
                      </span>
                    </div>

                    {/* More info. Because one row of badges wasn't enough, apparently. */}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                      <span>
                        {pricingT('platformFee')}: {formatCurrency(platformShareValue)} {/* Our cut. The cost of doing business. Don't look at me like that. */}
                      </span>
                      {delivery.packageSize && (
                        <span>{t('package') || 'Package'}: {delivery.packageSize}</span> // Size matters. Sometimes.
                      )}
                      {delivery.serviceCity && (
                        <span>{delivery.serviceCity}{delivery.serviceCountry ? `, ${delivery.serviceCountry}` : ''}</span> // Where this circus is taking place
                      )}
                    </div>

                    {/* Address grid. From Point A to Point B. Geography in action, folks. */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {/* Pickup location. Where the journey begins. */}
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4" style={{ color: theme?.primary || '#3B82F6' }} />
                          {t('pickup') || 'Pickup'}
                        </p>
                        <p className="text-sm text-muted-foreground">{delivery.senderName}</p> {/* The sender. Patient zero. */}
                        <p className="text-sm text-muted-foreground">{delivery.senderAddress}</p> {/* Their address. Hope it's real. */}
                      </div>

                      {/* Delivery location. The promised land. */}
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4" style={{ color: theme?.secondary || '#FF6B6B' }} />
                          {t('delivery') || 'Delivery'}
                        </p>
                        <p className="text-sm text-muted-foreground">{delivery.receiverName}</p> {/* The receiver. The destination. The end. */}
                        <p className="text-sm text-muted-foreground">{delivery.receiverAddress}</p> {/* Where you're headed. Godspeed. */}
                      </div>
                    </div>

                    {/* Metadata row. All the little details nobody reads but we show anyway. */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{t('package') || 'Package'}: {delivery.packageType}</span> {/* What's in the box? We'll never know. */}
                      <span>{t('created') || 'Created'}: {new Date(delivery.createdAt).toLocaleDateString(locale)}</span> {/* When this whole mess started */}
                      {distanceLabel && (
                        <span>
                          {mapsT('distance')}: {distanceLabel} {/* How far you gotta go. Could be worse. */}
                        </span>
                      )}
                      {durationLabel && (
                        <span>
                          {mapsT('duration')}: {durationLabel} {/* How long it'll take. Theoretically. */}
                        </span>
                      )}
                    </div>

                    {/* Warning banner. Because sometimes we're just guessing. */}
                    {delivery.distanceEstimated && (
                      <p className="mt-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
                        {mapsT('estimatedNotice')} {/* Translation: "We might be wrong. Don't sue us." */}
                      </p>
                    )}
                  </div>

                  {/* Action buttons. The moment of truth. The point of no return. */}
                  <div className="flex flex-col gap-2">
                    {activeTab === 'available' && (
                      // Accept button. Click this and you're in it for the long haul, pal.
                      <button
                        onClick={() => handleAccept(delivery._id)}
                        className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-all"
                        style={{ backgroundColor: theme?.primary || '#3B82F6' }}
                      >
                        {t('accept') || 'Accept'} {/* Go ahead. Commit. We dare you. */}
                      </button>
                    )}

                    {activeTab === 'active' && (
                      <>
                        {/* Status update buttons. Track your progress from "got it" to "done." */}
                        <button
                          onClick={() => handleUpdateStatus(delivery._id, 'picked_up')}
                          className="px-4 py-2 rounded-lg font-medium border hover:bg-gray-50 transition-all"
                        >
                          {t('markPickedUp') || 'Picked Up'} {/* You got the package. Good for you. */}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(delivery._id, 'delivered')}
                          className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-all"
                          style={{ backgroundColor: theme?.primary || '#10B981' }}
                        >
                          {t('markDelivered') || 'Delivered'} {/* Mission accomplished. Time to get paid. */}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
