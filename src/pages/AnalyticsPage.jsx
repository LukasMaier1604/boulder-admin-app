import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRoutes, getRouteStats, getUsers, initializeData } from '../services/storage';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useToast } from '../hooks/useToast';
import styles from './AnalyticsPage.module.css';

const AnalyticsPage = () => {
  const [routePerformance, setRoutePerformance] = useState([]);
  const [difficultyDistribution, setDifficultyDistribution] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    initializeData();
    const routes = getRoutes();
    const activities = getRouteStats();
    const users = getUsers();

    // Route Performance
    const performanceData = routes
      .filter(r => r.status !== 'archived')
      .map(route => {
        const routeActivities = activities.filter(a => a.routeId === route.id);
        const topped = routeActivities.filter(a => a.topped).length;
        const topRate = routeActivities.length > 0 ? (topped / routeActivities.length * 100).toFixed(1) : 0;
        const attempts = routeActivities.reduce((sum, a) => sum + a.attempts, 0);
        return {
          name: route.name,
          topRate: parseFloat(topRate),
          attempts,
          grade: route.grade,
        };
      });
    setRoutePerformance(performanceData);

    // Difficulty Distribution
    const GRADE_VALUES = { V0: 0, V1: 1, V2: 2, V3: 3, V4: 4, V5: 5, V6: 6, V7: 7, V8: 8, V9: 9, V10: 10, 'V10+': 11 };
    const beginner = routes.filter(r => (GRADE_VALUES[r.grade] || 0) <= 2).length;
    const intermediate = routes.filter(r => {
      const v = GRADE_VALUES[r.grade] || 0;
      return v >= 3 && v <= 5;
    }).length;
    const advanced = routes.filter(r => (GRADE_VALUES[r.grade] || 0) >= 6).length;
    setDifficultyDistribution([
      { name: 'Anfänger (V0-V2)', value: beginner },
      { name: 'Mittel (V3-V5)', value: intermediate },
      { name: 'Fortgeschritten (V6+)', value: advanced },
    ]);

    // User Activity
    const userActivityData = users.map(user => {
      const userStats = activities.filter(a => a.userId === user.id);
      const tops = userStats.filter(a => a.topped).length;
      const totalAttempts = userStats.reduce((sum, a) => sum + a.attempts, 0);
      const score = tops * 10 + totalAttempts;
      return {
        id: user.id,
        name: user.name,
        level: user.level,
        sessions: user.sessionsCount,
        tops,
        attempts: totalAttempts,
        score,
      };
    });
    setUserActivity(userActivityData);
  }, []);

  const handleExportJSON = () => {
    const data = { routes: getRoutes(), hallInfo: getHallInfo() };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'boulder-routes.json';
    a.click();
    showToast('JSON exportiert', 'success');
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Grad', 'Top-Rate (%)', 'Attempts'];
    const rows = routePerformance.map(r => [r.name, r.grade, r.topRate, r.attempts]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'routes-performance.csv';
    a.click();
    showToast('CSV exportiert', 'success');
  };

  const userColumns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Level', accessor: 'level', sortable: true },
    { header: 'Sessions', accessor: 'sessions', sortable: true },
    { header: 'Tops', accessor: 'tops', sortable: true },
    { header: 'Attempts', accessor: 'attempts', sortable: true },
    { header: 'Score', accessor: 'score', sortable: true },
    {
      header: 'Details',
      accessor: null,
      render: (row) => (
        <button
          className={styles.btnDetail}
          onClick={() => {
            setSelectedUser(row);
            setShowUserDetail(true);
          }}
        >
          Info
        </button>
      ),
    },
  ];

  const COLORS = ['#F58B1F', '#41C48B', '#9333EA'];

  return (
    <MainLayout>
      <PageHeader title="Auswertung" />

      <div className={styles.exportBar}>
        <button className={styles.btnExport} onClick={handleExportJSON}>📥 JSON exportieren</button>
        <button className={styles.btnExport} onClick={handleExportCSV}>📥 CSV exportieren</button>
      </div>

      <div className={styles.chartsGrid}>
        <section className={styles.chartContainer}>
          <h3>Routen-Performance (Top-Rate)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routePerformance.sort((a, b) => b.topRate - a.topRate)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3640" />
              <XAxis dataKey="name" stroke="#99A4AF" />
              <YAxis stroke="#99A4AF" />
              <Tooltip contentStyle={{ background: '#1D2228', border: '1px solid #2D3640', color: '#F4F7FA' }} />
              <Bar dataKey="topRate" fill="#F58B1F" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className={styles.chartContainer}>
          <h3>Attempts pro Route</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routePerformance.sort((a, b) => b.attempts - a.attempts)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3640" />
              <XAxis dataKey="name" stroke="#99A4AF" />
              <YAxis stroke="#99A4AF" />
              <Tooltip contentStyle={{ background: '#1D2228', border: '1px solid #2D3640', color: '#F4F7FA' }} />
              <Bar dataKey="attempts" fill="#41C48B" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className={styles.chartContainer}>
          <h3>Schwierigkeitsverteilung</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1D2228', border: '1px solid #2D3640', color: '#F4F7FA' }} />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className={styles.usersSection}>
        <h3>User-Aktivität (Leaderboard)</h3>
        <DataTable
          columns={userColumns}
          data={userActivity.sort((a, b) => b.score - a.score)}
        />
      </section>

      <Modal isOpen={showUserDetail} onClose={() => setShowUserDetail(false)} title={selectedUser?.name}>
        {selectedUser && (
          <div className={styles.userDetail}>
            <p><strong>Level:</strong> {selectedUser.level}</p>
            <p><strong>Sessions:</strong> {selectedUser.sessions}</p>
            <p><strong>Tops:</strong> {selectedUser.tops}</p>
            <p><strong>Total Attempts:</strong> {selectedUser.attempts}</p>
            <p><strong>Score:</strong> {selectedUser.score}</p>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default AnalyticsPage;
