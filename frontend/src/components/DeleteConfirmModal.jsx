import { useState } from 'react';
import Modal from './Modal';
import { useToast } from '../hooks/useToast';

const DeleteConfirmModal = ({ task, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(task.id);
      showToast('Task deleted', 'success');
      onClose();
    } catch (err) {
      showToast('Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal title="Delete Task" onClose={onClose}>
      <p>
        Are you sure you want to delete <strong>{task.title}</strong>? This action cannot be
        undone.
      </p>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={handleConfirm} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
