import { useEffect } from 'react';
import { Oval } from 'react-loader-spinner';
import './Loader.css';

const Loader = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div className='loading-container'>
      <Oval
        height={80}
        width={80}
        color='#00b7c3'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor='#00b6c3a1'
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};
export default Loader;
