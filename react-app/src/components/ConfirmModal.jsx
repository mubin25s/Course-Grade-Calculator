export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Proceed', cancelText = 'Cancel' }) {
  if (!isOpen) return null;
  return (
    <div id="confirmModal" className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content small">
        <div className="modal-header">
          <h3 id="confirm-title">{title}</h3>
        </div>
        <p id="confirm-msg" className="modal-body-text">{message}</p>
        <div className="modal-actions-centered">
          <button className="dashboard-btn secondary" onClick={onCancel}>{cancelText}</button>
          <button className="dashboard-btn" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
