import { useForm } from 'react-hook-form';
import './App.css';

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <div className='background'>
      <div className='form-container'>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className='text-field'>
            <label>שם מלא</label>
            <input
              type='text'
              placeholder='שם מלא'
              {...register('name', { required: true })}
            />
          </div>
          <div className='text-field'>
            <label>מספר טלפון</label>
            <input
              type='tel'
              placeholder='מספר טלפון'
              {...register('phone', {
                required: true,
                minLength: 6,
                maxLength: 12,
              })}
            />
          </div>
          <div className='text-field'>
            <label>יחידה</label>

            <input
              type='text'
              placeholder='יחידה'
              {...register('unit', { required: true })}
            />
          </div>
          <div className='text-field'>
            <label>תפקיד</label>
            <input
              type='text'
              placeholder='תפקיד'
              {...register('job', { required: true })}
            />
          </div>
          <div className='text-field'>
            <input
              {...register('location', { required: true })}
              type='radio'
              value='דרום'
            />

            <input
              {...register('location', { required: true })}
              type='radio'
              value='צפון'
            />
          </div>
          <select {...register('subitems', { required: true })}>
            <option value='חליפת סערה'>חליפת סערה</option>
            <option value='נעלי הרים'>נעלי הרים</option>
          </select>
          <textarea
            placeholder='הערות'
            cols='30'
            rows='5'
            {...register('note', {})}
          />
          <input type='submit' />
        </form>
      </div>
    </div>
  );
}
