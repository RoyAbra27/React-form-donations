/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import Modal from 'react-modal';
import { useState } from 'react';
import './add-item-modal.css';

const AddItemModal = ({
  selectedItems,
  onAddItem,
  availableItems,
  isModalOpen,
  onRequestClose,
}) => {
  const [selectedItem, setSelectedItem] = useState({});
  const handleOnChange = (itemName) => {
    const item = availableItems.find((i) => i.name === itemName);
    console.log(item);
    setSelectedItem(item);
    // onAddItem(item);
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
        <select
          required={selectedItems.length === 0}
          className='select-field'
          value={selectedItem.name ? selectedItem.name : ''}
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

        <div className='item-box'>
          <div className='name'>{selectedItem.name}</div>
          <div className='options-container'>
            <div className='quantity'>- 1 +</div>
          </div>
        </div>
        <button className='submit-button'>הוסף</button>
      </div>
    </Modal>
  );
};
export default AddItemModal;
