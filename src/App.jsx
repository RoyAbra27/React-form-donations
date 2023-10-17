import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AddItemModal from './components/addItemModal/addItemModal';
import { Edit, Plus, X } from 'react-feather';
import './App.css';

const items = [
  {
    name: 'חליפת סערה',
    product_number: 1289515528,
    quantity: 1,
  },
  {
    name: 'קסדה מוגנת',
    product_number: 725048237,
    quantity: 1,
  },
  {
    name: 'גופיה ירוקה',
    product_number: 389612341,
    quantity: 1,
  },
  {
    name: 'אפוד קרמי',
    product_number: 974512369,
    quantity: 1,
  },
  {
    name: 'תיק גב',
    product_number: 652134789,
    quantity: 1,
  },
  {
    name: 'מימייה',
    product_number: 485237691,
    quantity: 1,
  },
];

export default function App() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([...items]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      unit: '',
      job: '',
      email: '',
      location: '',
      tenant: '',
      subitems: [],
    },
  });

  const onSubmit = (data) => {
    const params = new URLSearchParams(window.location.pathname);
    data.subitems = selectedItems;
    data.tenant = params.get('tenant');

    console.log(data);
  };

  const toggleModal = (editItem) => {
    if (editItem) {
      setItemToEdit(editItem);
    } else {
      setItemToEdit(null);
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (selectedItems.length > 0) {
      setValue('subitems', selectedItems);
    }
  }, [selectedItems]);

  if (errors.length > 0) {
    console.log(errors);
  }

  const onAddItem = (newItem) => {
    setAvailableItems(
      availableItems.filter((i) => i.product_number !== newItem.product_number)
    );
    setSelectedItems((currnet) => [...currnet, newItem]);
  };

  const onEditItem = (updatedItem) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.product_number === itemToEdit.product_number ? updatedItem : item
      )
    );

    setAvailableItems(
      availableItems.filter(
        (i) => i.product_number !== updatedItem.product_number
      )
    );
    if (itemToEdit.product_number !== updatedItem.product_number) {
      setAvailableItems((currnet) => [...currnet, itemToEdit]);
    }

    setItemToEdit(null);
  };

  const onRemoveItem = (newItem) => {
    setItemToEdit(null);
    setSelectedItems(
      selectedItems.filter((i) => i.product_number !== newItem.product_number)
    );
    setAvailableItems((currnet) => [...currnet, newItem]);
  };

  return (
    <div className='background'>
      <div className='form-container'>
        <div className='header'>
          <img src='/Logo.png' alt='LOGO' className='logo' />
          <div className='title'>בקשה לתרומה לציוד לחימה</div>
          <div className='description'>
            טופס זה מיועד למשרתים פעילים בצה״ל סדיר ,מילואים וקבע. אם הינך אדם
            פרטי וברצונך לסייע לכח לוחם בהשלמת ציוד , אנא הפנה טופס זה לקצין
            האמל״ח או לגורם רלוונטי ביחידה. נא לרכז את כל הפריטים בטופס אחד
          </div>
        </div>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='field-container'>
            <div className='field-title'>
              <label>שם מלא</label>
              <div className='required'>*</div>
              <div className='error-message'>{errors.name?.message}</div>
            </div>
            <input
              className='text-field'
              type='text'
              placeholder='שם מלא'
              {...register('name', { required: 'זהו שדה חובה' })}
            />
          </div>
          <div className='field-container'>
            <div className='field-title'>
              <label>מספר טלפון</label>
              <div className='required'>*</div>
              <div className='error-message'>{errors.phone?.message}</div>
            </div>
            <input
              className='text-field'
              type='tel'
              placeholder='מספר טלפון'
              {...register('phone', {
                pattern: {
                  message: 'מספר טלפון זה אינו תקין',
                  value:
                    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                },
                required: 'זהו שדה חובה',
                minLength: {
                  value: 6,
                  message: 'מספר טלפון זה אינו תקין',
                },
                maxLength: {
                  value: 12,
                  message: 'מספר טלפון זה אינו תקין',
                },
              })}
            />
          </div>
          <div className='field-container'>
            <div className='field-title'>
              <label>כתובת מייל</label>
              <div className='required'>*</div>
              <div className='error-message'>{errors.email?.message}</div>
            </div>
            <input
              className='text-field'
              type='email'
              placeholder='כתובת מייל'
              {...register('email', {
                required: 'זהו שדה חובה',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'כתובת מייל אינה תקינה',
                },
              })}
            />
          </div>
          <div className='field-container'>
            <div className='field-title'>
              <label>יחידה</label>
              <div className='required'>*</div>
              <div className='error-message'>{errors.unit?.message}</div>
            </div>
            <input
              className='text-field'
              type='text'
              placeholder='יחידה'
              {...register('unit', { required: 'זהו שדה חובה' })}
            />
          </div>
          <div className='field-container'>
            <div className='field-title'>
              <label>תפקיד</label>
              <div className='required'>*</div>
              <div className='error-message'>{errors.job?.message}</div>
            </div>
            <input
              className='text-field'
              type='text'
              placeholder='תפקיד'
              {...register('job', { required: 'זהו שדה חובה' })}
            />
          </div>
          <div className='field-container'>
            <div className='field-title'>
              <label>מיקום</label>
              <div className='required'>*</div>
              <div className='error-message'>{errors.location?.message}</div>
            </div>
            <select
              className='select-field'
              defaultValue={watch('location')}
              {...register('location', { required: 'זהו שדה חובה' })}
            >
              <option disabled={true} value=''>
                בחר מיקום
              </option>

              <option value='צפון'>צפון</option>
              <option value='דרום'>דרום</option>
              <option value='אחר'>אחר</option>
            </select>
          </div>

          <div>בחירת פריטים:</div>
          <div className='items-container'>
            {selectedItems.map((item) => (
              <div key={item.product_number} className='item'>
                <div>{item.name}</div>
                <div className='options-container'>
                  <div className='quantity'>{item.quantity}</div>
                  <div className='option-buttons'>
                    <Edit
                      className='edit-btn'
                      onClick={() => toggleModal(item)}
                    />

                    <X
                      className='remove-btn'
                      onClick={() => onRemoveItem(item)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className='add-button-container'>
              <button type='button' onClick={() => setIsModalOpen(true)}>
                <Plus />
              </button>
            </div>
          </div>
          <div className='field-container'>
            <textarea
              className='text-field'
              placeholder='הערות'
              cols='30'
              rows='5'
              {...register('note', {})}
            />
          </div>

          <button className='submit-button' type='submit'>
            שלח בקשה
          </button>
        </form>
      </div>

      {isModalOpen && (
        <AddItemModal
          isModalOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          selectedItems={selectedItems}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          availableItems={availableItems}
          itemToEdit={itemToEdit}
        />
      )}
    </div>
  );
}
