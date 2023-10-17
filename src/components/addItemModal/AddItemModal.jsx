/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import Modal from 'react-modal';
import { useState } from 'react';
import './add-item-modal.css';
import { PlusCircle, MinusCircle } from 'react-feather';

const AddItemModal = ({
  selectedItems,
  onAddItem,
  availableItems,
  isModalOpen,
  onRequestClose,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const handleOnChange = (itemName) => {
    const item = availableItems.find((i) => i.name === itemName);
    setSelectedItem(item);
  };

  const handleConfirm = () => {
    onAddItem(selectedItem);
    onRequestClose();
  };

  const updateQuantity = (quanity) => {
    setSelectedItem({ ...selectedItem, quantity: quanity });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      ariaHideApp={false}
      onRequestClose={onRequestClose}
      overlayClassName='modal-overlay'
      className='modal-container'
    >
      <div className='modal-content'>
        <div className='title'>הוספת/עדכון פריט</div>
        <div className='modal-form'>
          <select
            required={selectedItems.length === 0}
            className='select-field'
            value={selectedItem?.name ? selectedItem.name : ''}
            onChange={(e) => handleOnChange(e.target.value)}
          >
            <option disabled={true} value=''>
              בחר פריט
            </option>
            {availableItems.map((item) => (
              <option key={item.product_number} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          {selectedItem ? (
            <input 
              type='number' 
              value={selectedItem.quantity} 
              onChange={(e) => updateQuantity(e.target.value)} 
              className='quantity-input' />
          ) : null}
          <button
            onClick={handleConfirm}
            disabled={!selectedItem}
            className='submit-button'
          >
            הוסף
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default AddItemModal;
