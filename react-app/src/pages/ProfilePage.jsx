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

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

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
        dateString: d.data().timestamp
          ? new Date(d.data().timestamp.seconds * 1000).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
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

  useEffect(() => { fetchRecords(); }, [user]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      showToast('Failed to log out.', 'error');
    }
  };

  const toggleExpand = (recordId) => {
    setExpandedRecord(prev => (prev === recordId ? null : recordId));
  };

  const promptDelete = (id, e) => {
    e.stopPropagation();
    setRecordToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!recordToDelete || !user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'records', recordToDelete));
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

  const totalRecords = records.length;
  const avgCgpa = totalRecords > 0
    ? (records.reduce((acc, curr) => acc + (curr.cgpa || 0), 0) / totalRecords).toFixed(2)
    : '0.00';

  if (!user) return null;

  return (
    <>
      <style>{`
        .profile-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: clamp(1.25rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1.25rem);
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }
        .profile-container {
          width: 100%;
          max-width: min(800px, 100%);
          position: relative;
          z-index: 1;
        }
        .profile-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .profile-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #23212C;
          text-decoration: none;
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          background: #FFFFFF;
          border: 1.5px solid rgba(35, 33, 44, 0.15);
          font-weight: 700;
          font-size: 0.85rem;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .profile-back-btn:hover {
          background: #C41E3A;
          color: #FFFFFF;
          border-color: #C41E3A;
        }
        .profile-signout-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #23212C;
          color: #fff;
          border: none;
          padding: 0.6rem 1.25rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          font-family: inherit;
        }
        .profile-signout-btn:hover {
          background: #C41E3A;
        }
        .profile-header {
          text-align: center;
          margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
        }
        .profile-avatar {
          width: clamp(56px, 12vw, 72px);
          height: clamp(56px, 12vw, 72px);
          background: linear-gradient(135deg, #C41E3A, #960E26);
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(196, 30, 58, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .profile-avatar i {
          color: #fff;
          font-size: clamp(1.8rem, 5vw, 2.4rem);
        }
        .profile-title {
          font-size: clamp(1.8rem, 6vw, 2.5rem);
          font-weight: 900;
          color: #C41E3A;
          margin-bottom: 0.35rem;
          text-transform: uppercase;
          letter-spacing: -0.5px;
        }
        .profile-email {
          color: rgba(35, 33, 44, 0.7);
          font-size: clamp(0.8rem, 2.5vw, 1rem);
          font-weight: 500;
          word-break: break-all;
        }
        .profile-email strong {
          color: #23212C;
          font-weight: 800;
        }
        .stat-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(200px, 45%), 1fr));
          gap: 1rem;
          margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
        }
        .stat-card {
          padding: clamp(1.25rem, 4vw, 1.75rem) clamp(1rem, 3vw, 1.5rem);
          text-align: center;
          background: #FFFFFF;
          border: 1.5px solid rgba(35, 33, 44, 0.12);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(35, 33, 44, 0.06);
        }
        .stat-label {
          font-size: clamp(0.68rem, 2vw, 0.78rem);
          color: rgba(35, 33, 44, 0.65);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }
        .stat-label i {
          color: #C41E3A;
          margin-right: 5px;
        }
        .stat-value {
          font-size: clamp(2rem, 7vw, 2.75rem);
          font-weight: 900;
          display: block;
          margin-top: 0.35rem;
        }
        .stat-value.primary { color: #23212C; }
        .stat-value.accent  { color: #C41E3A; }
        .section-heading {
          display: flex;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .section-heading h2 {
          font-size: clamp(0.9rem, 3vw, 1.15rem);
          font-weight: 900;
          color: #23212C;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .section-heading h2 i {
          color: #C41E3A;
          margin-right: 8px;
        }
        .records-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .record-card {
          background: #FFFFFF;
          border: 1.5px solid rgba(35, 33, 44, 0.12);
          border-radius: 20px;
          padding: clamp(1rem, 3vw, 1.5rem);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(35, 33, 44, 0.05);
        }
        .record-card.expanded {
          border-left: 4px solid #C41E3A;
        }
        .record-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .record-meta {
          flex: 1;
          min-width: 0;
        }
        .record-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.4rem;
        }
        .record-type-badge {
          font-size: clamp(0.65rem, 2vw, 0.72rem);
          padding: 0.2rem 0.6rem;
          border-radius: 10px;
          font-weight: 800;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .record-type-badge.universal {
          background: rgba(196, 30, 58, 0.1);
          color: #C41E3A;
        }
        .record-type-badge.manual {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
        }
        .record-date {
          font-size: clamp(0.75rem, 2vw, 0.82rem);
          color: rgba(35, 33, 44, 0.65);
          font-weight: 600;
        }
        .record-subjects {
          font-size: clamp(0.82rem, 2.5vw, 0.95rem);
          color: #23212C;
          font-weight: 600;
        }
        .record-subjects strong {
          font-weight: 900;
          color: #C41E3A;
        }
        .record-subjects strong.dark {
          color: #23212C;
        }
        .record-right {
          display: flex;
          align-items: center;
          gap: clamp(0.75rem, 2.5vw, 1.5rem);
          flex-shrink: 0;
        }
        .record-cgpa-box {
          text-align: right;
        }
        .record-cgpa-label {
          font-size: clamp(0.65rem, 2vw, 0.72rem);
          color: rgba(35, 33, 44, 0.6);
          display: block;
          text-transform: uppercase;
          font-weight: 800;
        }
        .record-cgpa-value {
          font-size: clamp(1.4rem, 4.5vw, 1.8rem);
          font-weight: 900;
          color: #C41E3A;
        }
        .record-delete-btn {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #EF4444;
          width: clamp(32px, 8vw, 36px);
          height: clamp(32px, 8vw, 36px);
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          font-size: 0.85rem;
        }
        .record-delete-btn:hover {
          background: rgba(239, 68, 68, 0.18);
        }
        .record-detail {
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(35, 33, 44, 0.1);
          animation: fadeIn 0.3s ease;
        }
        .detail-heading {
          font-size: clamp(0.7rem, 2vw, 0.78rem);
          color: rgba(35, 33, 44, 0.65);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 800;
        }
        .detail-rows {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #F3F0EB;
          border: 1px solid rgba(35, 33, 44, 0.1);
          padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.65rem, 2vw, 1rem);
          border-radius: 12px;
          font-size: clamp(0.8rem, 2.5vw, 0.88rem);
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .detail-name {
          font-weight: 700;
          color: #23212C;
          min-width: 0;
          word-break: break-word;
        }
        .detail-meta {
          color: rgba(35, 33, 44, 0.75);
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .detail-meta strong {
          color: #C41E3A;
          font-weight: 900;
        }
        .empty-card {
          text-align: center;
          padding: clamp(2.5rem, 8vw, 3.5rem) clamp(1rem, 4vw, 2rem);
          background: #FFFFFF;
          border: 1.5px solid rgba(35, 33, 44, 0.12);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 30px rgba(35, 33, 44, 0.06);
        }
        .empty-icon {
          font-size: clamp(2.2rem, 7vw, 3rem);
          color: rgba(35, 33, 44, 0.3);
        }
        .empty-title {
          font-weight: 800;
          color: #23212C;
          font-size: clamp(1.1rem, 3.5vw, 1.3rem);
        }
        .empty-desc {
          color: rgba(35, 33, 44, 0.65);
          max-width: 400px;
          font-size: clamp(0.82rem, 2.5vw, 0.92rem);
          line-height: 1.6;
        }
        .calc-now-btn {
          margin-top: 0.25rem;
          padding: 0.85rem 2rem;
          background: #C41E3A;
          color: #fff;
          border: none;
          border-radius: 50px;
          font-weight: 800;
          font-size: clamp(0.85rem, 2.5vw, 0.95rem);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .calc-now-btn:hover {
          background: #A50020;
          transform: translateY(-2px);
        }
        .loading-state {
          text-align: center;
          padding: 3rem 0;
          color: rgba(35, 33, 44, 0.65);
        }
        .loading-state p {
          font-weight: 600;
          margin-top: 0.75rem;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="profile-page">
        <BackgroundGlobes />

        <div className="profile-container">
          {/* Top Navigation Bar */}
          <div className="profile-topbar">
            <a
              href="/"
              className="profile-back-btn"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
            >
              <i className="fa-solid fa-arrow-left"></i> Home
            </a>
            <button className="profile-signout-btn" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> Sign Out
            </button>
          </div>

          {/* User Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fa-solid fa-circle-user"></i>
            </div>
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-email">
              Signed in as: <strong>{user.email}</strong>
            </p>
          </div>

          {/* Stat Cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <span className="stat-label">
                <i className="fa-solid fa-folder-open"></i> Saved Semesters
              </span>
              <span className="stat-value primary">{totalRecords}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">
                <i className="fa-solid fa-graduation-cap"></i> Average CGPA
              </span>
              <span className="stat-value accent">{avgCgpa}</span>
            </div>
          </div>

          {/* History Section */}
          <div className="section-heading">
            <h2>
              <i className="fa-solid fa-clock-rotate-left"></i> Calculation History
            </h2>
          </div>

          {loadingRecords ? (
            <div className="loading-state">
              <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: '#C41E3A' }}></i>
              <p>Loading your history...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="empty-card">
              <i className="fa-solid fa-receipt empty-icon"></i>
              <h3 className="empty-title">No saved records yet</h3>
              <p className="empty-desc">
                Calculate your grades on the dashboard, and save your results to see them logged here.
              </p>
              <button className="calc-now-btn" onClick={() => navigate('/')}>
                <i className="fa-solid fa-calculator"></i> Calculate Now
              </button>
            </div>
          ) : (
            <div className="records-list">
              {records.map((record) => {
                const isExpanded = expandedRecord === record.id;
                return (
                  <div
                    key={record.id}
                    className={`record-card${isExpanded ? ' expanded' : ''}`}
                    onClick={() => toggleExpand(record.id)}
                  >
                    <div className="record-top">
                      <div className="record-meta">
                        <div className="record-tags">
                          <span className={`record-type-badge ${record.calculatorType === 'universal' ? 'universal' : 'manual'}`}>
                            {record.calculatorType === 'universal' ? 'Universal Setup' : 'Manual Input'}
                          </span>
                          <span className="record-date">{record.dateString}</span>
                        </div>
                        <div className="record-subjects">
                          <strong>{record.courses?.length || 0}</strong> subject{record.courses?.length !== 1 ? 's' : ''}{' '}
                          &bull;{' '}
                          <strong className="dark">{record.totalCredits || 0}</strong> Credits
                        </div>
                      </div>

                      <div className="record-right">
                        <div className="record-cgpa-box">
                          <span className="record-cgpa-label">CGPA</span>
                          <span className="record-cgpa-value">{(record.cgpa || 0).toFixed(2)}</span>
                        </div>
                        <button
                          className="record-delete-btn"
                          onClick={(e) => promptDelete(record.id, e)}
                          title="Delete Record"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="record-detail" onClick={(e) => e.stopPropagation()}>
                        <p className="detail-heading">Subject Details</p>
                        <div className="detail-rows">
                          {record.courses && record.courses.length > 0 ? (
                            record.courses.map((course, idx) => (
                              <div key={idx} className="detail-row">
                                <span className="detail-name">{course.name}</span>
                                <span className="detail-meta">
                                  {course.credits || course.credit} CR &bull;{' '}
                                  <strong>
                                    {course.grade || `GP: ${(course.gp || course.gradePoint || 0).toFixed(2)}`}
                                  </strong>
                                </span>
                              </div>
                            ))
                          ) : (
                            <p style={{ fontSize: '0.82rem', color: 'rgba(35, 33, 44, 0.6)' }}>
                              No subject details saved for this record.
                            </p>
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
          message="Are you sure you want to delete this CGPA record? This action is permanent."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast({ message: '', type: 'success' })}
        />
      </div>
    </>
  );
}
