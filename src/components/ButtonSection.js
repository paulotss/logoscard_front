import { Link } from 'react-router-dom';

const ButtonSection = (props) => {
  const { title, image, path } = props;
  return (
    <Link to={path} className='w-32 h-24 m-2'>
      <div className='bg-[#1C232E] p-2 w-32 h-24 flex flex-col justify-between rounded-md'>
        <div className='text-white w-10 h-10'>{ image }</div>
        <div className='text-white font-bold'>{ title }</div>
      </div>
    </Link>
  )
}

export default ButtonSection;
