import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { getRoutes, getUsers, getRouteStats } from '../services/storage';
import { initializeData } from '../services/storage';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    initializeData();
    const routes = getRoutes();
    const users = getUsers();
    const activities = getRouteStats();

    if (!routes.length || !users.length) return;

    // Calculate stats
    const totalRoutes = routes.length;
    const activeRoutes = routes.filter(r => r.status !== 'archived').length;
    const totalAttempts = activities.reduce((sum, a) => sum + a.attempts, 0);
    const avgAttemptsPerRoute = totalRoutes > 0 ? (totalAttempts / totalRoutes).toFixed(1) : 0;
    
    const toppedCount = activities.filter(a => a.topped).length;
    const topRatePercent = activities.length > 0 ? ((toppedCount / activities.length) * 100).toFixed(1) : 0;
    
    const routeAttempts = {};
    activities.forEach(a => {
      routeAttempts[a.routeId] = (routeAttempts[a.routeId] || 0) + a.attempts;
    });
    const mostPopularRoute = Object.keys(routeAttempts).length > 0
      ? routes.find(r => r.id === Object.entries(routeAttempts).sort((a, b) => b[1] - a[1])[0]?.[0])?.name || 'N/A'
      : 'N/A';
    
    const hardestTopped = activities
      .filter(a => a.topped)
      .map(a => routes.find(r => r.id === a.routeId))
      .filter(Boolean)
      .sort((a, b) => (b.gradeValue || 0) - (a.gradeValue || 0))[0]?.name || 'N/A';

    setStats({
      activeRoutes,
      avgAttemptsPerRoute,
      topRatePercent,
      mostPopularRoute,
      hardestTopped,
      totalUsers: users.length,
      recentActivities: activities.slice(-5).reverse(),
      lowRateRoutes: routes.filter(r => r.status !== 'archived').sort((a, b) => {
        const aRate = activities.filter(act => act.routeId === a.id && act.topped).length / (activities.filter(act => act.routeId === a.id).length || 1);
        const bRate = activities.filter(act => act.routeId === b.id && act.topped).length / (activities.filter(act => act.routeId === b.id).length || 1);
        return aRate - bRate;
      }).slice(0, 3),
    });
  }, []);

  if (!stats) return <MainLayout><PageHeader title="Dashboard" /></MainLayout>;

  return (
    <MainLayout>
      <PageHeader title="Dashboard" />
      <div className={styles.statsGrid}>
        <StatCard label="Aktive Routen" value={stats.activeRoutes} />
        <StatCard label="Ø Attempts/Route" value={stats.avgAttemptsPerRoute} />
        <StatCard label="Top-Rate (gesamt)" value={`${stats.topRatePercent}%`} />
        <StatCard label="Beliebteste Route" value={stats.mostPopularRoute} />
        <StatCard label="Schwerste getoppte Route" value={stats.hardestTopped} />
        <StatCard label="Registrierte Nutzer" value={stats.totalUsers} />
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Letzte 5 Aktivitäten</h3>
          {stats.recentActivities.length > 0 ? (
            <div className={styles.activityList}>
              {stats.recentActivities.map((act, i) => (
                <div key={i} className={styles.activityItem}>
                  <div className={styles.activityMain}>
                    <strong>User hat {act.topped ? '✓ getoppt' : 'versucht'}</strong>
                    <span className={styles.date}>{new Date(act.date).toLocaleDateString('de-DE')}</span>
                  </div>
                  <div className={styles.activityDetail}>Attempts: {act.attempts}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Noch keine Aktivitäten</p>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Routen mit niedrigster Top-Rate</h3>
          {stats.lowRateRoutes.length > 0 ? (
            <div className={styles.routeList}>
              {stats.lowRateRoutes.map(r => (
                <div key={r.id} className={styles.routeItem}>
                  <strong>{r.name}</strong>
                  <span className={styles.grade}>{r.grade}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Alle Routen haben gute Top-Rates</p>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
