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
  const [inputQuantity, setInputQuantity] = useState(1);

  const handleOnChange = (itemName) => {
    const item = availableItems.find((i) => i.name === itemName);
    setSelectedItem({ ...item, quantity: 1 });
  };

  const handleConfirm = () => {
    const finalItem = {
      ...selectedItem,
      quantity: inputQuantity <= 0 ? 1 : inputQuantity,
    };
    itemToEdit ? onEditItem(finalItem) : onAddItem(finalItem);
    onRequestClose();
  };

  const updateQuantity = (quanity) => {
    setInputQuantity(quanity);
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
                <option
                  className='option'
                  key={item.product_number}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
            {selectedItem ? (
              <input
                type='number'
                min={1}
                max={99}
                value={inputQuantity}
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
