import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';

const DashboardPage = () => {
  return (
    <MainLayout>
      <PageHeader title="Dashboard" />
      <div style={{ marginTop: '24px' }}>
        <p style={{ color: '#99A4AF', fontSize: '16px' }}>
          Content coming soon
        </p>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
