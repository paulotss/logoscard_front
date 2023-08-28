import { Link } from 'react-router-dom';

const PlanLink = (props) => {
  const { assignmentId, assignmentTitle, userId, expiration } = props;

  const formatDate = (value) => {
    const date = new Date(value);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const isExpired = (date) => {
    const today = new Date();
    const dateObj = new Date(date);
    return dateObj < today;
  }

  return (
    <div
      className={`${isExpired(expiration) ? "bg-red-400" : "bg-green-500"} p-2 rounded-md mb-2`}
    >
      <Link
        key={assignmentId}
        to={`/client/benefit/${userId}`}
      >
        <p className="w-full font-bold">
          {assignmentTitle.toUpperCase()}
        </p>
        <p className="text-sm">Vencimento: {formatDate(expiration)}</p>
      </Link>
    </div>
  )
}

export default PlanLink;
