/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import Modal from 'react-modal';
import { useState } from 'react';
import './add-item-modal.css';

const AddItemModal = ({
  selectedItems,
  onAddItem,
  onEditItem,
  availableItems,
  isModalOpen,
  onRequestClose,
  itemToEdit,
}) => {
  const [selectedItem, setSelectedItem] = useState(
    itemToEdit ? itemToEdit : null
  );
  const handleOnChange = (itemName) => {
    const item = availableItems.find((i) => i.name === itemName);
    setSelectedItem({ ...item, quantity: 1 });
  };

  const handleConfirm = () => {
    itemToEdit ? onEditItem(selectedItem) : onAddItem(selectedItem);
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
          <div className='fields'>
            <select
              required={selectedItems.length === 0}
              className='select-field'
              value={selectedItem?.name ? selectedItem.name : ''}
              onChange={(e) => handleOnChange(e.target.value)}
            >
              <option disabled={true} value=''>
                בחר פריט
              </option>
              {itemToEdit ? (
                <option value={itemToEdit.name}>{itemToEdit.name}</option>
              ) : null}
              {availableItems.map((item) => (
                <option key={item.product_number} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            {selectedItem ? (
              <input
                type='number'
                min={1}
                max={99}
                value={selectedItem.quantity || 1}
                onChange={(e) => updateQuantity(e.target.value)}
                className='quantity-input'
              />
            ) : null}
          </div>
          <button
            onClick={handleConfirm}
            disabled={!selectedItem}
            className='submit-button'
          >
            {itemToEdit ? 'עדכן' : 'הוסף'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default AddItemModal;
