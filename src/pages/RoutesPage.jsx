import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import Badge from '../components/Badge';
import { useApi } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';
import styles from './RoutesPage.module.css';

const RoutesPage = () => {
  const [routes, setRoutesState] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [search, setSearch] = useState('');
  const [filterWallType, setFilterWallType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { getRoutes, createRoute, updateRoute, deleteRoute, archiveRoute, executeApiCall } = useApi();

  const WALL_TYPES = ['SLAB', 'VERTICAL', 'OVERHANG', 'COMPETITION', 'CAVE'];
  const GRADES = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V10+'];
  const GRADE_VALUES = { V0: 0, V1: 1, V2: 2, V3: 3, V4: 4, V5: 5, V6: 6, V7: 7, V8: 8, V9: 9, V10: 10, 'V10+': 11 };

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const data = await executeApiCall(getRoutes);
      setRoutesState(data.routes || []);
    } catch (error) {
      addToast('Routen konnten nicht geladen werden', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSort = (routesData = routes) => {
    let filtered = routesData.filter(r => r.status !== 'archived');

    if (search) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.location?.toLowerCase().includes(search.toLowerCase()) ||
        r.grade?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterWallType) {
      filtered = filtered.filter(r => r.wallType === filterWallType);
    }

    if (filterDifficulty) {
      const [min, max] = filterDifficulty === 'beginner' ? [0, 2] : filterDifficulty === 'intermediate' ? [3, 5] : [6, 11];
      filtered = filtered.filter(r => (GRADE_VALUES[r.grade] || 0) >= min && (GRADE_VALUES[r.grade] || 0) <= max);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      return sortConfig.direction === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    setFilteredRoutes(filtered);
  };

  useEffect(() => {
    filterAndSort(routes);
  }, [search, filterWallType, filterDifficulty, sortConfig, routes]);

  const openNewRoute = () => {
    setEditingRoute(null);
    setFormData({ status: 'active', betaSteps: [''], date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const openEditRoute = (route) => {
    setEditingRoute(route);
    setFormData({ ...route });
    setShowModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBetaStepChange = (index, value) => {
    const newSteps = [...(formData.betaSteps || [])];
    newSteps[index] = value;
    handleFormChange('betaSteps', newSteps);
  };

  const addBetaStep = () => {
    handleFormChange('betaSteps', [...(formData.betaSteps || []), '']);
  };

  const removeBetaStep = (index) => {
    const newSteps = (formData.betaSteps || []).filter((_, i) => i !== index);
    handleFormChange('betaSteps', newSteps);
  };

  const handleSaveRoute = async () => {
    if (!formData.name || !formData.grade) {
      addToast('Name und Grad sind Pflichtfelder', 'error');
      return;
    }

    try {
      const gradeValue = GRADE_VALUES[formData.grade] || 0;
      const routeData = {
        name: formData.name,
        grade: formData.grade,
        gradeValue,
        wallType: formData.wallType || 'VERTICAL',
        location: formData.location || '',
        description: formData.description || '',
      };

      if (editingRoute) {
        await executeApiCall(updateRoute, editingRoute.id, routeData);
        addToast('Route aktualisiert', 'success');
      } else {
        await executeApiCall(createRoute, routeData);
        addToast('Route erstellt', 'success');
      }

      setShowModal(false);
      setFormData({});
      await loadRoutes();
    } catch (error) {
      addToast(error.message || 'Fehler beim Speichern', 'error');
    }
  };

  const handleArchiveRoute = async (route) => {
    if (window.confirm(`Route "${route.name}" archivieren?`)) {
      try {
        await executeApiCall(archiveRoute, route.id);
        addToast('Route archiviert', 'success');
        await loadRoutes();
      } catch (error) {
        addToast('Fehler beim Archivieren', 'error');
      }
    }
  };

  const handleDeleteRoute = async (route) => {
    if (window.confirm(`Route "${route.name}" wirklich löschen?`)) {
      try {
        await executeApiCall(deleteRoute, route.id);
        addToast('Route gelöscht', 'success');
        await loadRoutes();
      } catch (error) {
        addToast('Fehler beim Löschen', 'error');
      }
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Grad', accessor: 'grade', sortable: true },
    { header: 'Wandtyp', accessor: 'wallType', sortable: true },
    { header: 'Bereich', accessor: 'location', sortable: true },
    { header: 'Datum', accessor: 'date', sortable: true },
    {
      header: 'Aktionen',
      accessor: null,
      render: (row) => (
        <div className={styles.actions}>
          <button className={styles.btnSmall} onClick={() => openEditRoute(row)}>Bearbeiten</button>
          <button className={`${styles.btnSmall} ${styles.btnDanger}`} onClick={() => handleArchiveRoute(row)}>Archivieren</button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Routen"
        action={{ label: '+ Neue Route', onClick: openNewRoute }}
      />

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select value={filterWallType} onChange={(e) => setFilterWallType(e.target.value)} className={styles.select}>
          <option value="">Alle Wandtypen</option>
          {WALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className={styles.select}>
          <option value="">Alle Schwierigkeiten</option>
          <option value="beginner">Anfänger (V0-V2)</option>
          <option value="intermediate">Mittel (V3-V5)</option>
          <option value="advanced">Fortgeschritten (V6+)</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.empty}><p>Laden...</p></div>
      ) : filteredRoutes.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map(col => col.header && (
                  <th
                    key={col.accessor || 'actions'}
                    onClick={() => col.sortable && setSortConfig({
                      key: col.accessor,
                      direction: sortConfig.key === col.accessor && sortConfig.direction === 'asc' ? 'desc' : 'asc',
                    })}
                    className={col.sortable ? styles.sortable : ''}
                  >
                    {col.header} {col.sortable && sortConfig.key === col.accessor && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map(route => (
                <tr key={route.id}>
                  <td>{route.name}</td>
                  <td><Badge label={route.grade} variant="primary" /></td>
                  <td>{route.wallType}</td>
                  <td>{route.location}</td>
                  <td>{new Date(route.date).toLocaleDateString('de-DE')}</td>
                  <td className={styles.actionsCell}>
                    <button className={styles.btnSmall} onClick={() => openEditRoute(route)}>✏️</button>
                    <button className={`${styles.btnSmall} ${styles.btnDanger}`} onClick={() => handleDeleteRoute(route)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.empty}>
          <p>Noch keine Routen. <button onClick={openNewRoute} className={styles.linkBtn}>Erste Route erstellen</button></p>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingRoute ? 'Route bearbeiten' : 'Neue Route'}>
        <div className={styles.form}>
          <FormField
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={(e) => handleFormChange('name', e.target.value)}
            required
          />
          <FormField
            label="Grad"
            name="grade"
            type="select"
            value={formData.grade || ''}
            onChange={(e) => handleFormChange('grade', e.target.value)}
            options={GRADES}
            required
          />
          <FormField
            label="Wandtyp"
            name="wallType"
            type="select"
            value={formData.wallType || ''}
            onChange={(e) => handleFormChange('wallType', e.target.value)}
            options={WALL_TYPES}
          />
          <FormField
            label="Bereich / Location"
            name="location"
            value={formData.location || ''}
            onChange={(e) => handleFormChange('location', e.target.value)}
          />
          <FormField
            label="Beschreibung"
            name="description"
            type="textarea"
            value={formData.description || ''}
            onChange={(e) => handleFormChange('description', e.target.value)}
          />
          <label className={styles.label}>Beta-Schritte</label>
          <div className={styles.betaSteps}>
            {(formData.betaSteps || []).map((step, i) => (
              <div key={i} className={styles.betaStepRow}>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleBetaStepChange(i, e.target.value)}
                  placeholder={`Schritt ${i + 1}`}
                  className={styles.betaStepInput}
                />
                {(formData.betaSteps || []).length > 1 && (
                  <button type="button" onClick={() => removeBetaStep(i)} className={styles.btnRemove}>✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addBetaStep} className={styles.btnAdd}>+ Schritt hinzufügen</button>
          </div>
          <FormField
            label="Datum eingesetzt"
            name="date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => handleFormChange('date', e.target.value)}
          />
          <div className={styles.statusToggle}>
            <label>Status</label>
            <select value={formData.status || 'active'} onChange={(e) => handleFormChange('status', e.target.value)}>
              <option value="active">Aktiv</option>
              <option value="archived">Archiviert</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button onClick={handleSaveRoute} className={styles.btnSave}>Speichern</button>
            <button onClick={() => setShowModal(false)} className={styles.btnCancel}>Abbrechen</button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default RoutesPage;
