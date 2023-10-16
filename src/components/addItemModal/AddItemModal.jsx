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

  const addQuantity = () => {
    setSelectedItem({ ...selectedItem, quantity: selectedItem.quantity + 1 });
  };

  const removeQuantity = () => {
    setSelectedItem({ ...selectedItem, quantity: selectedItem.quantity - 1 });
  };

  const handleConfirm = () => {
    onAddItem(selectedItem);
    onRequestClose();
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
        <div className='title'>בחירת פריט</div>
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
            <div className='item-box'>
              <div className='name'>{selectedItem.name}</div>
              <div className='options-container'>
                <div className='quantity'>
                  <PlusCircle onClick={addQuantity} className='icon' />
                  {selectedItem.quantity}
                  <MinusCircle onClick={removeQuantity} className='icon' />
                </div>
              </div>
            </div>
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
