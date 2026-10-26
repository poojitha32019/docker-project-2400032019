import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Shirt, Plus, RefreshCw, Search, Trash2, Pencil, X, CheckCircle2, AlertCircle, Truck, Clock3, IndianRupee, WashingMachine } from 'lucide-react';

const API = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/laundry-services').replace(/\/$/, '');
const emptyForm = { serviceName: '', pickupAvailable: 'true', pricePerKg: '', deliveryDays: '2' };

export default function App() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const notify = (type, message) => { setNotice({ type, message }); window.setTimeout(() => setNotice(null), 4500); };
  const request = async (path = '', options = {}) => {
    const response = await fetch(`${API}${path}`, { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) } });
    const raw = await response.text();
    let data; try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
    if (!response.ok) {
      const validation = data?.validationErrors ? Object.values(data.validationErrors).join('. ') : '';
      throw new Error(validation || data?.message || (typeof data === 'string' ? data : `Request failed (${response.status})`));
    }
    return data;
  };
  const loadServices = useCallback(async () => {
    setLoading(true);
    try { const data = await request('/displayall'); setServices(Array.isArray(data) ? data : []); }
    catch (e) { notify('error', `Could not load services. ${e.message}. Check that backend and PostgreSQL are running.`); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadServices(); }, [loadServices]);

  const filtered = useMemo(() => services.filter(s => `${s.serviceName} ${s.id}`.toLowerCase().includes(search.toLowerCase())), [services, search]);
  const totalPickup = services.filter(s => s.pickupAvailable).length;
  const validate = () => {
    const errors = {};
    if (!form.serviceName.trim()) errors.serviceName = 'Enter a service name.';
    else if (form.serviceName.trim().length > 100) errors.serviceName = 'Use 100 characters or fewer.';
    if (form.pricePerKg === '' || !Number.isFinite(Number(form.pricePerKg)) || Number(form.pricePerKg) <= 0) errors.pricePerKg = 'Enter a price greater than ₹0.';
    if (!Number.isInteger(Number(form.deliveryDays)) || Number(form.deliveryDays) < 1 || Number(form.deliveryDays) > 30) errors.deliveryDays = 'Enter a number from 1 to 30.';
    setFormErrors(errors); return Object.keys(errors).length === 0;
  };
  const submit = async (e) => {
    e.preventDefault(); if (!validate()) return;
    setSaving(true);
    const payload = { serviceName: form.serviceName.trim(), pickupAvailable: form.pickupAvailable === 'true', pricePerKg: Number(form.pricePerKg), deliveryDays: Number(form.deliveryDays) };
    try {
      if (editingId !== null) { await request(`/update/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) }); notify('success', 'Laundry service updated successfully.'); }
      else { await request('/add', { method: 'POST', body: JSON.stringify(payload) }); notify('success', 'Laundry service added successfully.'); }
      setForm(emptyForm); setEditingId(null); setFormErrors({}); await loadServices();
    } catch (err) { notify('error', err.message || 'Unable to save the service.'); }
    finally { setSaving(false); }
  };
  const edit = (s) => { setEditingId(s.id); setForm({ serviceName: s.serviceName, pickupAvailable: String(s.pickupAvailable), pricePerKg: String(s.pricePerKg), deliveryDays: String(s.deliveryDays) }); setFormErrors({}); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelEdit = () => { setEditingId(null); setForm(emptyForm); setFormErrors({}); };
  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.serviceName}" (ID ${s.id})? This cannot be undone.`)) return;
    try { await request(`/delete/${s.id}`, { method: 'DELETE' }); notify('success', 'Laundry service deleted.'); await loadServices(); }
    catch (e) { notify('error', e.message || 'Unable to delete service.'); }
  };

  return <div className="app-shell">
    <nav className="navbar navbar-expand-lg topbar"><div className="container-fluid px-3 px-lg-5">
      <a className="navbar-brand brand" href="#top"><span className="brand-icon"><WashingMachine size={22}/></span><span>FreshFold <small>LAUNDRY MANAGEMENT</small></span></a>
      <div className="d-flex align-items-center gap-3"><span className="api-status"><span className="status-dot"/> CRUD workspace</span><a className="btn btn-outline-primary btn-sm" href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer">API Docs ↗</a></div>
    </div></nav>
    <main className="container-fluid px-3 px-lg-5 py-4 py-lg-5" id="top">
      <section className="hero mb-4"><div><div className="eyebrow">SERVICE OPERATIONS <span>•</span> CONTROL PANEL</div><h1>Manage your laundry<br className="d-none d-md-block"/> services with ease.</h1><p>Create, view, update and remove laundry service plans from one simple workspace.</p></div><div className="hero-art"><div className="hero-circle"><Shirt size={68} strokeWidth={1.4}/></div><span className="spark spark-one">✦</span><span className="spark spark-two">✧</span></div></section>
      {notice && <div className={`alert notice alert-${notice.type === 'success' ? 'success' : 'danger'} d-flex align-items-center gap-2`} role="alert">{notice.type === 'success' ? <CheckCircle2 size={19}/> : <AlertCircle size={19}/>}<span>{notice.message}</span><button className="notice-close" onClick={() => setNotice(null)} aria-label="Close notification"><X size={17}/></button></div>}
      <section className="stats-grid mb-4"><div className="stat-card"><span className="stat-icon blue"><WashingMachine size={20}/></span><div><div className="stat-label">TOTAL SERVICES</div><div className="stat-value">{services.length}</div></div></div><div className="stat-card"><span className="stat-icon green"><Truck size={20}/></span><div><div className="stat-label">PICKUP AVAILABLE</div><div className="stat-value">{totalPickup}</div></div></div><div className="stat-card"><span className="stat-icon orange"><Clock3 size={20}/></span><div><div className="stat-label">FASTEST DELIVERY</div><div className="stat-value">{services.length ? `${Math.min(...services.map(s => s.deliveryDays))} days` : '—'}</div></div></div></section>
      <div className="row g-4 align-items-start">
        <div className="col-12 col-xl-4"><section className="panel form-panel"><div className="panel-heading"><div><div className="eyebrow">{editingId !== null ? 'EDIT DETAILS' : 'ADD NEW'}</div><h2>{editingId !== null ? 'Update service' : 'Create a service'}</h2></div><span className="heading-icon"><Plus size={20}/></span></div>
          <form onSubmit={submit} noValidate>
            <div className="mb-3"><label className="form-label" htmlFor="serviceName">Service name <span className="required">*</span></label><input id="serviceName" className={`form-control ${formErrors.serviceName ? 'is-invalid' : ''}`} placeholder="e.g. Wash & Fold" maxLength="100" value={form.serviceName} onChange={e => setForm({...form, serviceName:e.target.value})}/>{formErrors.serviceName && <div className="invalid-feedback">{formErrors.serviceName}</div>}</div>
            <div className="mb-3"><label className="form-label" htmlFor="pricePerKg">Price per kg (₹) <span className="required">*</span></label><div className="input-group"><span className="input-group-text"><IndianRupee size={16}/></span><input id="pricePerKg" type="number" min="0.01" step="0.01" className={`form-control ${formErrors.pricePerKg ? 'is-invalid' : ''}`} placeholder="e.g. 45" value={form.pricePerKg} onChange={e => setForm({...form, pricePerKg:e.target.value})}/>{formErrors.pricePerKg && <div className="invalid-feedback">{formErrors.pricePerKg}</div>}</div>{formErrors.pricePerKg && <div className="field-error">{formErrors.pricePerKg}</div>}</div>
            <div className="mb-3"><label className="form-label" htmlFor="deliveryDays">Delivery time (days) <span className="required">*</span></label><input id="deliveryDays" type="number" min="1" max="30" step="1" className={`form-control ${formErrors.deliveryDays ? 'is-invalid' : ''}`} value={form.deliveryDays} onChange={e => setForm({...form, deliveryDays:e.target.value})}/>{formErrors.deliveryDays && <div className="invalid-feedback">{formErrors.deliveryDays}</div>}</div>
            <div className="mb-4"><label className="form-label" htmlFor="pickupAvailable">Pickup service <span className="required">*</span></label><select id="pickupAvailable" className="form-select" value={form.pickupAvailable} onChange={e => setForm({...form, pickupAvailable:e.target.value})}><option value="true">Available</option><option value="false">Not available</option></select></div>
            <div className="form-note"><CheckCircle2 size={16}/><span>Service ID is generated automatically. You don't need to enter it.</span></div>
            <div className="d-flex gap-2 mt-4"><button className="btn btn-primary flex-grow-1 submit-btn" type="submit" disabled={saving}>{saving ? <><span className="spinner-border spinner-border-sm me-2"/>Saving...</> : <><Plus size={17} className="me-1"/>{editingId !== null ? 'Save changes' : 'Add service'}</>}</button>{editingId !== null && <button type="button" className="btn btn-light cancel-btn" onClick={cancelEdit}>Cancel</button>}</div>
          </form>
        </section></div>
        <div className="col-12 col-xl-8"><section className="panel list-panel"><div className="panel-heading list-heading"><div><div className="eyebrow">YOUR CATALOGUE</div><h2>Laundry services <span className="count-pill">{services.length}</span></h2><p className="panel-subtitle">View and manage all available service plans.</p></div><button className="btn btn-light refresh-btn" onClick={loadServices} disabled={loading} title="Refresh list"><RefreshCw size={17} className={loading ? 'spin' : ''}/></button></div>
          <div className="search-wrap"><Search size={18}/><input aria-label="Search services" placeholder="Search by service name or ID..." value={search} onChange={e => setSearch(e.target.value)}/>{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={16}/></button>}</div>
          {loading ? <div className="empty-state"><span className="spinner-border text-primary"/><p>Loading services...</p></div> : filtered.length === 0 ? <div className="empty-state"><div className="empty-icon"><Shirt size={30}/></div><h3>{search ? 'No matching services' : 'No services yet'}</h3><p>{search ? 'Try another search term.' : 'Add your first laundry service using the form.'}</p></div> : <div className="service-list">{filtered.map(s => <article className="service-row" key={s.id}><div className="service-symbol"><Shirt size={23}/></div><div className="service-main"><div className="service-title-line"><h3>{s.serviceName}</h3><span className="id-chip">ID #{s.id}</span></div><div className="service-meta"><span className={s.pickupAvailable ? 'pickup yes' : 'pickup no'}><Truck size={14}/>{s.pickupAvailable ? 'Pickup available' : 'No pickup'}</span><span><Clock3 size={14}/>{s.deliveryDays} day{s.deliveryDays === 1 ? '' : 's'}</span></div></div><div className="service-price"><strong>₹{Number(s.pricePerKg).toFixed(2)}</strong><small>per kg</small></div><div className="service-actions"><button className="icon-action edit" onClick={() => edit(s)} aria-label={`Edit ${s.serviceName}`} title="Edit"><Pencil size={16}/></button><button className="icon-action delete" onClick={() => remove(s)} aria-label={`Delete ${s.serviceName}`} title="Delete"><Trash2 size={16}/></button></div></article>)}</div>}
          <div className="list-footer"><span>Showing <b>{filtered.length}</b> of <b>{services.length}</b> services</span><span className="api-label"><span className="status-dot"/> Connected API</span></div>
        </section></div>
      </div>
      <footer className="page-footer"><span>FreshFold <span>•</span> Laundry Service Manager</span><span>CRUD Service · PostgreSQL · Spring Boot</span></footer>
    </main>
  </div>;
}
