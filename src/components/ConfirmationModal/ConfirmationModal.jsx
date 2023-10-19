/* eslint-disable react/prop-types */
import Modal from 'react-modal';
import './confirmation-modal.css';

const ConfirmationModal = ({ isModalOpen, onRequestClose, onCancelForm }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      ariaHideApp={false}
      onRequestClose={onRequestClose}
      overlayClassName='modal-overlay'
      className='confirmation-modal-container'
    >
      <div className='modal-content'>
        <div className='title'>אישור ביטול בקשה</div>
        <div className='buttons'>
          <button className='submit-button' onClick={onCancelForm}>
            בטל
          </button>
          <button className='cancel-button' onClick={onRequestClose}>
            חזור
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmationModal;
