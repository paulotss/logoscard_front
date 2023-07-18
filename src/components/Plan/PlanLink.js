import { Link } from 'react-router-dom';

const PlanLink = ({ assignmentId, assignmentTitle, userId }) => {
  return (
    <div
      key={assignmentId}
      className="font-bold bg-gray-400 p-1 rounded-md mb-2 w-80 flex justify-between"
    >
      <Link to={`/client/benefit/${userId}`}>
        {assignmentTitle.toUpperCase()}
      </Link>
    </div>
  )
}

export default PlanLink;
