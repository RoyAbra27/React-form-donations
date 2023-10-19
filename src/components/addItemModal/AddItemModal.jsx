/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import './add-item-modal.css';

const AddItemModal = ({
  selectedItems,
  onAddItem,
  onEditItem,
  availableItems,
  isModalOpen,
  onRequestClose,
  itemToEdit,
  setItemToEdit,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputQuantity, setInputQuantity] = useState(1);

  useEffect(() => {
    if (itemToEdit) {
      setSelectedItem(itemToEdit);
      setInputQuantity(itemToEdit.quantity);
    }
  }, [itemToEdit]);

  const closeModal = () => {
    setInputQuantity(1);
    setSelectedItem(null);
    setItemToEdit(null);
    onRequestClose();
  };

  const handleOnChange = (itemName) => {
    setInputQuantity(1);
    const item = availableItems.find((i) => i.name === itemName) || itemToEdit;
    setSelectedItem({ ...item, quantity: 1 });
  };

  const handleConfirm = () => {
    const finalItem = {
      ...selectedItem,
      quantity: inputQuantity <= 0 ? 1 : inputQuantity,
    };
    itemToEdit ? onEditItem(finalItem) : onAddItem(finalItem);
    setInputQuantity(1);
    setSelectedItem(null);
    onRequestClose();
  };

  const updateQuantity = (quanity) => {
    setInputQuantity(quanity);
  };
  return (
    <Modal
      isOpen={isModalOpen}
      ariaHideApp={false}
      onRequestClose={closeModal}
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
