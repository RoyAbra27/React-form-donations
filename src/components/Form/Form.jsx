/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Plus, X } from 'react-feather';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import AddItemModal from '../AddItemModal/AddItemModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loader from '../Loader/Loader';
import './form.css';

const defaultValues = {
  name: '',
  phone: '',
  unit: '',
  job: '',
  email: '',
  location: '',
  tenant: '',
  subitems: [],
};
const Form = ({ updateForm }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [modalToOpen, setModalToOpen] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);

  const [isLoading, setIsLoading] = useState(updateForm); // set to true if updateForm is true, else false
  const [errorType, setErrorType] = useState('');

  const navigate = useNavigate();

  const { id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues,
  });

  useEffect(() => {
    setIsLoading(true);
    fetch(
      'https://njdfolzzmvnaay5oxqife4tuwy.apigateway.il-jerusalem-1.oci.customer-oci.com/v1/get-products'
    )
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        if ('error' in data) {
          setErrorType('error');
          return;
        }
        setAvailableItems([...data]);
      })
      .catch((error) => {
        setIsLoading(false);

        console.error('There was an error fetching the data:', error);
        setErrorType('error');
        return;
      });

    if (updateForm) {
      fetch(
        'https://njdfolzzmvnaay5oxqife4tuwy.apigateway.il-jerusalem-1.oci.customer-oci.com/v1/get-order?id=' +
          id
      )
        .then((res) => res.json())
        .then((data) => {
          if ('error' in data) {
            setErrorType('error');
            return;
          }
          if (data.is_cancel) {
            setErrorType('cancel');
            return;
          }
          setSelectedItems([...data.subitems]);

          setAvailableItems((currentAvailableItems) => {
            return currentAvailableItems.filter(
              (item) =>
                !data.subitems.some(
                  (subitem) => subitem.product_number === item.product_number
                )
            );
          });

          reset(data);

          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setErrorType('error');
          console.error('There was an error fetching the data:', error);
          return;
        });
    }
  }, []);

  const getErrorPage = () => {
    let title, content;
    switch (errorType) {
      case 'error':
        title = 'שגיאה';
        content = 'אנא נסו שנית במועד מאוחר יותר.';
        break;
      case 'cancel':
        title = 'הזמנה זו בוטלה.';
        content = 'אנא שלחו טופס חדש בהתאם לצורך.';
        break;
      default:
        return;
    }
    return <ErrorPage title={title} content={content} />;
  };

  const onCancelForm = () => {
    setIsLoading(true);
    setModalToOpen(null);
    fetch(
      'https://njdfolzzmvnaay5oxqife4tuwy.apigateway.il-jerusalem-1.oci.customer-oci.com/v1/create-update-order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, is_cancel: true }),
      }
    )
      .then((res) =>
        res.json().then((data) => {
          setIsLoading(false);

          if ('error' in data) {
            console.log(data.error);
            toast.error('תקלה בעת שליחת הטופס, אנא נסו שוב במועד מאוחר יותר');
            return;
          }
          toast.success('הבקשה שלך בוטלה בהצלה!');

          window.location.reload(false);
        })
      )
      .catch((error) => {
        setIsLoading(false);

        toast.error('תקלה בעת ביטל הטופס, אנא נסו שוב במועד מאוחר יותר');
      });
  };

  const onSubmit = (formData) => {
    formData.subitems = selectedItems;

    if (updateForm) {
      formData.id = id;
    } else {
      let params = new URLSearchParams(window.location.search);
      let tenant = params.get('tenant');
      formData.tenant = tenant;
    }
    setIsLoading(true);

    fetch(
      'https://njdfolzzmvnaay5oxqife4tuwy.apigateway.il-jerusalem-1.oci.customer-oci.com/v1/create-update-order',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    )
      .then((res) =>
        res.json().then((data) => {
          setIsLoading(false);

          if ('error' in data) {
            toast.error('תקלה בעת שליחת הטופס, אנא נסו שוב במועד מאוחר יותר');
            return;
          }

          toast.success('הבקשה נשלחה בהצלחה');

          if (!updateForm) {
            return navigate(`/${data.id}`, { replace: true });
          }
        })
      )
      .catch((error) => {
        setIsLoading(false);

        toast.error('תקלה בעת שליחת הטופס, אנא נסו שוב במועד מאוחר יותר');
      });
  };

  const toggleModal = (editItem) => {
    if (editItem) {
      setItemToEdit(editItem);
    } else {
      setItemToEdit(null);
    }
    return setModalToOpen('items');
  };

  const onAddItem = (newItem) => {
    setAvailableItems(
      availableItems.filter((i) => i.product_number !== newItem.product_number)
    );
    setSelectedItems((currnet) => [...currnet, newItem]);
    setItemToEdit(null);
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
      {isLoading && <Loader />}
      {getErrorPage()}
      <div className='form-container'>
        <div className='header'>
          <img src='/content/Logo.png' alt='LOGO' className='logo' />
          <div className='title'>
            {updateForm ? 'עדכון טופס' : 'בקשה לתרומה לציוד לחימה '}
          </div>
          <div className='description' hidden={updateForm}>
            טופס זה מיועד למשרתים פעילים בצה״ל סדיר ,מילואים וקבע. אם הינך אדם
            פרטי וברצונך לסייע לכח לוחם בהשלמת ציוד , אנא הפנה טופס זה לקצין
            האמל״ח או לגורם רלוונטי ביחידה. נא לרכז את כל הפריטים בטופס אחד
          </div>
        </div>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid-container'>
            <div className='field-container'>
              <div className='field-title'>
                <label>שם מלא</label>
                <span className='required'>*</span>
                <div className='error-message'>{errors.name?.message}</div>
              </div>
              <input
                disabled={updateForm}
                className='text-field'
                type='text'
                placeholder='שם מלא'
                {...register('name', { required: 'חובה' })}
              />
            </div>
            <div className='field-container'>
              <div className='field-title'>
                <label>מספר טלפון</label>
                <span className='required'>*</span>
                <div className='error-message'>{errors.phone?.message}</div>
              </div>
              <input
                disabled={updateForm}
                className='text-field'
                type='tel'
                placeholder='מספר טלפון'
                {...register('phone', {
                  pattern: {
                    message: 'מספר טלפון זה אינו תקין',
                    value:
                      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  },
                  required: 'חובה',
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
                <span className='required'>*</span>
                <div className='error-message'>{errors.email?.message}</div>
              </div>
              <input
                disabled={updateForm}
                className='text-field'
                type='email'
                placeholder='כתובת מייל'
                {...register('email', {
                  required: 'חובה',
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
                <span className='required'>*</span>
                <div className='error-message'>{errors.unit?.message}</div>
              </div>
              <input
                disabled={updateForm}
                className='text-field'
                type='text'
                placeholder='יחידה'
                {...register('unit', { required: 'חובה' })}
              />
            </div>
            <div className='field-container'>
              <div className='field-title'>
                <label>תפקיד</label>
                <span className='required'>*</span>
                <div className='error-message'>{errors.job?.message}</div>
              </div>
              <input
                disabled={updateForm}
                className='text-field'
                type='text'
                placeholder='תפקיד'
                {...register('job', { required: 'חובה' })}
              />
            </div>
            <div className='field-container'>
              <div className='field-title'>
                <label>מיקום</label>
                <span className='required'>*</span>
                <div className='error-message'>{errors.location?.message}</div>
              </div>
              <select
                className='select-field'
                defaultValue={watch('location')}
                {...register('location', { required: 'חובה' })}
              >
                <option disabled={true} value=''>
                  מיקום
                </option>

                <option value='צפון'>צפון</option>
                <option value='דרום'>דרום</option>
                <option value='אחר'>אחר</option>
              </select>
            </div>
          </div>

          <label>בחירת פריטים:</label>
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
              <button type='button' onClick={() => setModalToOpen('items')}>
                <Plus />
              </button>
            </div>
          </div>
          <div className='field-container'>
            <div className='field-title'>
              <label>הערות</label>
            </div>
            <textarea
              className='text-field'
              placeholder='הערות'
              cols='30'
              rows='5'
              {...register('note', {})}
            />
          </div>

          <div className='form-btns'>
            <button className='submit-button' type='submit'>
              {updateForm ? 'עדכון בקשה' : 'שליחת בקשה'}
            </button>
            {updateForm && (
              <button
                type='button'
                className='cancel-button'
                onClick={() => setModalToOpen('confirmation')}
              >
                ביטול בקשה
              </button>
            )}
          </div>
        </form>
      </div>
      <ConfirmationModal
        isModalOpen={modalToOpen === 'confirmation'}
        onRequestClose={() => setModalToOpen(null)}
        onCancelForm={onCancelForm}
      />

      <AddItemModal
        isModalOpen={modalToOpen === 'items'}
        onRequestClose={() => setModalToOpen(null)}
        selectedItems={selectedItems}
        onAddItem={onAddItem}
        onEditItem={onEditItem}
        availableItems={availableItems}
        itemToEdit={itemToEdit}
        setItemToEdit={setItemToEdit}
      />
    </div>
  );
};

export default Form;
