import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';
import { getHallInfo, setHallInfo, initializeData } from '../services/storage';
import { useToast } from '../hooks/useToast';
import styles from './HallInfoPage.module.css';

const HallInfoPage = () => {
  const [hallInfo, setHallInfoState] = useState({
    name: '',
    address: { street: '', zip: '', city: '' },
    contact: { phone: '', email: '', website: '' },
    description: '',
    hours: [],
    prices: [],
    news: [],
  });
  const { showToast } = useToast();

  useEffect(() => {
    initializeData();
    const info = getHallInfo();
    if (info) setHallInfoState(info);
  }, []);

  const handleFieldChange = (field, value) => {
    setHallInfoState(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setHallInfoState(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleContactChange = (field, value) => {
    setHallInfoState(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleAddHour = () => {
    setHallInfoState(prev => ({
      ...prev,
      hours: [...prev.hours, { day: 'Montag', from: '09:00', to: '22:00' }],
    }));
  };

  const handleUpdateHour = (index, field, value) => {
    const newHours = [...hallInfo.hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHallInfoState(prev => ({ ...prev, hours: newHours }));
  };

  const handleRemoveHour = (index) => {
    setHallInfoState(prev => ({
      ...prev,
      hours: prev.hours.filter((_, i) => i !== index),
    }));
  };

  const handleAddPrice = () => {
    setHallInfoState(prev => ({
      ...prev,
      prices: [...prev.prices, { category: '', price: '' }],
    }));
  };

  const handleUpdatePrice = (index, field, value) => {
    const newPrices = [...hallInfo.prices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    setHallInfoState(prev => ({ ...prev, prices: newPrices }));
  };

  const handleRemovePrice = (index) => {
    setHallInfoState(prev => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index),
    }));
  };

  const handleAddNews = () => {
    if (hallInfo.news.length < 5) {
      setHallInfoState(prev => ({
        ...prev,
        news: [...prev.news, { text: '', date: new Date().toISOString().split('T')[0] }],
      }));
    }
  };

  const handleUpdateNews = (index, field, value) => {
    const newNews = [...hallInfo.news];
    newNews[index] = { ...newNews[index], [field]: value };
    setHallInfoState(prev => ({ ...prev, news: newNews }));
  };

  const handleRemoveNews = (index) => {
    setHallInfoState(prev => ({
      ...prev,
      news: prev.news.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    setHallInfo(hallInfo);
    showToast('Hallen-Informationen gespeichert!', 'success');
  };

  return (
    <MainLayout>
      <PageHeader title="Hallen-Informationen" action={{ label: '💾 Speichern', onClick: handleSave }} />

      <div className={styles.container}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Stammdaten</h3>
          <FormField
            label="Hallenname"
            name="name"
            value={hallInfo.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Adresse</h3>
          <FormField
            label="Straße"
            name="street"
            value={hallInfo.address?.street || ''}
            onChange={(e) => handleAddressChange('street', e.target.value)}
          />
          <div className={styles.row}>
            <FormField
              label="PLZ"
              name="zip"
              value={hallInfo.address?.zip || ''}
              onChange={(e) => handleAddressChange('zip', e.target.value)}
              style={{ flex: 1 }}
            />
            <FormField
              label="Ort"
              name="city"
              value={hallInfo.address?.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Kontakt</h3>
          <FormField
            label="Telefon"
            name="phone"
            value={hallInfo.contact?.phone || ''}
            onChange={(e) => handleContactChange('phone', e.target.value)}
          />
          <FormField
            label="E-Mail"
            name="email"
            value={hallInfo.contact?.email || ''}
            onChange={(e) => handleContactChange('email', e.target.value)}
          />
          <FormField
            label="Website"
            name="website"
            value={hallInfo.contact?.website || ''}
            onChange={(e) => handleContactChange('website', e.target.value)}
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Beschreibung</h3>
          <FormField
            label="Über die Halle"
            name="description"
            type="textarea"
            value={hallInfo.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Öffnungszeiten</h3>
          {hallInfo.hours?.map((hour, i) => (
            <div key={i} className={styles.row}>
              <select value={hour.day} onChange={(e) => handleUpdateHour(i, 'day', e.target.value)} className={styles.select}>
                {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <input type="time" value={hour.from} onChange={(e) => handleUpdateHour(i, 'from', e.target.value)} className={styles.input} />
              <input type="time" value={hour.to} onChange={(e) => handleUpdateHour(i, 'to', e.target.value)} className={styles.input} />
              <button className={styles.btnRemove} onClick={() => handleRemoveHour(i)}>✕</button>
            </div>
          ))}
          <button className={styles.btnAdd} onClick={handleAddHour}>+ Zeile hinzufügen</button>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Eintrittspreise</h3>
          {hallInfo.prices?.map((price, i) => (
            <div key={i} className={styles.row}>
              <input
                type="text"
                placeholder="Kategorie (z.B. Erwachsene)"
                value={price.category}
                onChange={(e) => handleUpdatePrice(i, 'category', e.target.value)}
                className={styles.input}
              />
              <input
                type="number"
                placeholder="Preis €"
                value={price.price}
                onChange={(e) => handleUpdatePrice(i, 'price', e.target.value)}
                className={styles.input}
              />
              <button className={styles.btnRemove} onClick={() => handleRemovePrice(i)}>✕</button>
            </div>
          ))}
          <button className={styles.btnAdd} onClick={handleAddPrice}>+ Preis hinzufügen</button>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Aktuelle Hinweise / News (max. 5)</h3>
          {hallInfo.news?.map((item, i) => (
            <div key={i} className={styles.newsItem}>
              <input
                type="date"
                value={item.date}
                onChange={(e) => handleUpdateNews(i, 'date', e.target.value)}
                className={styles.input}
              />
              <textarea
                placeholder="News-Text..."
                value={item.text}
                onChange={(e) => handleUpdateNews(i, 'text', e.target.value)}
                className={styles.textarea}
                rows="2"
              />
              <button className={styles.btnRemove} onClick={() => handleRemoveNews(i)}>✕</button>
            </div>
          ))}
          {hallInfo.news?.length < 5 && (
            <button className={styles.btnAdd} onClick={handleAddNews}>+ News hinzufügen</button>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default HallInfoPage;
