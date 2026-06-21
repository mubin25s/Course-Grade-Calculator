import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import BackgroundGlobes from '../components/BackgroundGlobes';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [expandedRecord, setExpandedRecord] = useState(null);
  
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch saved records on mount or when user changes
  const fetchRecords = async () => {
    if (!user) return;
    setLoadingRecords(true);
    try {
      const recordsRef = collection(db, 'users', user.uid, 'records');
      const q = query(recordsRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      
      const fetched = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        // Format timestamp safely
        dateString: d.data().timestamp 
          ? new Date(d.data().timestamp.seconds * 1000).toLocaleDateString(undefined, { 
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            })
          : new Date().toLocaleDateString()
      }));
      setRecords(fetched);
    } catch (error) {
      console.error('Error fetching records:', error);
      showToast('Failed to load CGPA history records.', 'error');
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      showToast('Failed to log out.', 'error');
    }
  };

  const toggleExpand = (recordId) => {
    if (expandedRecord === recordId) {
      setExpandedRecord(null);
    } else {
      setExpandedRecord(recordId);
    }
  };

  const promptDelete = (id, e) => {
    e.stopPropagation();
    setRecordToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!recordToDelete || !user) return;
    try {
      const recordDocRef = doc(db, 'users', user.uid, 'records', recordToDelete);
      await deleteDoc(recordDocRef);
      setRecords(prev => prev.filter(r => r.id !== recordToDelete));
      showToast('Record deleted successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete the record.', 'error');
    } finally {
      setConfirmOpen(false);
      setRecordToDelete(null);
    }
  };

  // Calculate overall stats
  const totalRecords = records.length;
  const avgCgpa = totalRecords > 0 
    ? (records.reduce((acc, curr) => acc + (curr.cgpa || 0), 0) / totalRecords).toFixed(2)
    : '0.00';

  if (!user) return null;

  return (
    <div className="universal-calc-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem', position: 'relative' }}>
      <BackgroundGlobes />

      <div className="container" style={{ maxWidth: 800 }}>
        {/* Navigation / Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="back-link" style={{ marginBottom: 0 }}>
            <i className="fa-solid fa-arrow-left"></i> Home
          </a>
          <button 
            onClick={handleLogout} 
            className="dashboard-btn secondary sm"
            style={{ padding: '0.5rem 1rem', height: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>

        {/* User Info & Stats */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="header-icon" style={{ width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <i className="fa-solid fa-circle-user" style={{ color: '#fff', fontSize: '2.2rem' }}></i>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>My Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Signed in as: <strong style={{ color: '#fff' }}>{user.email}</strong></p>
        </header>

        {/* Stat Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.25rem', 
          marginBottom: '2.5rem' 
        }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: '#070707' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <i className="fa-solid fa-folder-open"></i> Saved Semesters
            </span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', display: 'block', marginTop: '0.5rem' }}>
              {totalRecords}
            </span>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: '#070707' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <i className="fa-solid fa-graduation-cap"></i> Average CGPA
            </span>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginTop: '0.5rem' }}>
              {avgCgpa}
            </span>
          </div>
        </div>

        {/* Saved Records Section */}
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2><i className="fa-solid fa-clock-rotate-left"></i> Calculation History</h2>
        </div>

        {loadingRecords ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
            <p>Loading your history...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#070707', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <i className="fa-solid fa-receipt" style={{ fontSize: '3rem', color: 'var(--text-muted)' }}></i>
            <h3 style={{ fontWeight: 600 }}>No saved records yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto', fontSize: '0.9rem' }}>
              Calculate your grades on the dashboard, and save your results to see them logged here.
            </p>
            <button className="dashboard-btn" onClick={() => navigate('/')} style={{ marginTop: '0.5rem' }}>
              <i className="fa-solid fa-calculator"></i> Calculate Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {records.map((record) => {
              const isExpanded = expandedRecord === record.id;
              return (
                <div 
                  key={record.id} 
                  className="card" 
                  onClick={() => toggleExpand(record.id)}
                  style={{ 
                    padding: '1.25rem', 
                    background: '#070707', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderLeft: isExpanded ? '3px solid var(--primary)' : '1px solid var(--glass-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          background: record.calculatorType === 'universal' ? 'rgba(109, 0, 26, 0.15)' : 'rgba(16, 185, 129, 0.1)', 
                          color: record.calculatorType === 'universal' ? 'var(--text-muted)' : '#10B981',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {record.calculatorType === 'universal' ? 'Universal Setup' : 'Manual Input'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{record.dateString}</span>
                      </div>
                      <div style={{ marginTop: '0.4rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                        <strong>{record.courses?.length || 0}</strong> subject{(record.courses?.length !== 1) ? 's' : ''} &bull; <strong>{record.totalCredits || 0}</strong> Credits
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>CGPA</span>
                        <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                          {(record.cgpa || 0).toFixed(2)}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => promptDelete(record.id, e)} 
                        style={{ 
                          background: 'rgba(239, 68, 68, 0.08)', 
                          border: '1px solid rgba(239, 68, 68, 0.2)', 
                          color: 'var(--danger)', 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        title="Delete Record"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Accordion Details */}
                  {isExpanded && (
                    <div 
                      onClick={(e) => e.stopPropagation()} // Prevent collapse on container click
                      style={{ 
                        marginTop: '1.25rem', 
                        paddingTop: '1.25rem', 
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        animation: 'fadeIn 0.3s ease'
                      }}
                    >
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Subject Details
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {record.courses && record.courses.length > 0 ? (
                          record.courses.map((course, idx) => (
                            <div 
                              key={idx} 
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                background: 'rgba(255,255,255,0.02)', 
                                border: '1px solid rgba(255,255,255,0.04)',
                                padding: '0.6rem 0.8rem', 
                                borderRadius: '10px',
                                fontSize: '0.85rem' 
                              }}
                            >
                              <span style={{ fontWeight: 600, color: '#fff' }}>{course.name}</span>
                              <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                                {course.credits || course.credit} CR &bull; <strong style={{ color: 'var(--primary)' }}>{course.grade || `GP: ${(course.gp || course.gradePoint || 0).toFixed(2)}`}</strong>
                              </span>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No subject details saved for this record.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Record?"
        message="Are you sure you want to delete this CGPA record from your account history? This action is permanent."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <Toast 
        message={toast.message} 
        type={toast.type} 
        onDone={() => setToast({ message: '', type: 'success' })} 
      />
    </div>
  );
}
