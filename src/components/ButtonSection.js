import { Link } from 'react-router-dom';

const ButtonSection = (props) => {
  const { title, image, path } = props;
  return (
    <Link to={path} className='w-24 h-24'>
      <div className='bg-gray-900 p-2 w-24 h-24 flex flex-col justify-between rounded-lg'>
        <div className='text-white w-10 h-10'>{ image }</div>
        <div className='text-white font-bold'>{ title }</div>
      </div>
    </Link>
  )
}

export default ButtonSection;
