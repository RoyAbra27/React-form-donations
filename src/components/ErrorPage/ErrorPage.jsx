import './error-page.css';

const ErrorPage = ({ title, content }) => {
  return (
    <div className='overlay'>
      <div className='content-container'>
        <div className='content'>
          <div className='title'>{title}</div>
          <div className='text'>{content}</div>
        </div>
      </div>
    </div>
  );
};
export default ErrorPage;
