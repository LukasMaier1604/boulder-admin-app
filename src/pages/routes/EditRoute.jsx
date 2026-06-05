import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditRoute() {
  const { id } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch existing route data if ID is present
  useEffect(() => {
    if (id) {
      fetch(`/api/routes/${id}`)
        .then(res => res.json())
        .then(data => setFormData(data))
        .catch(err => toast.error('Fehler beim Laden der Route'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/routes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error(res.statusText);
      
      toast.success('Route erfolgreich gespeichert');
      history.push('/routes');
    } catch (err) {
      console.error(err);
      toast.error(`Fehler beim Speichern: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Example form fields - adjust based on your actual schema */}
      <div>
        <label>Name</label>
        <input 
          value={formData.name || ''} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          placeholder="Route-Name"
        />
      </div>
      <div>
        <label>Beschreibung</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows="4"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Speichern...' : 'Speichern'}
      </button>
    </form>
  );
}