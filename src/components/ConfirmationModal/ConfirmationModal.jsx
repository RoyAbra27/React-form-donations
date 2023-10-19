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
        <div className='text'>האם אתם בטוחים שברצונכם לבטל את הבקשה?</div>
        <div className='buttons'>
          <button className='cancel-button' onClick={onRequestClose}>
            חזור
          </button>
          <button className='submit-button' onClick={onCancelForm}>
            בטל
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmationModal;
