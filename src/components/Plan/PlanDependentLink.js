const PlanDependentLink = ({ assignmentId, assignmentTitle }) => {
  return (
    <div
      key={assignmentId}
      className="font-bold bg-gray-400 p-1 rounded-md mb-2 w-80 flex justify-between"
    >
      <div>
        {assignmentTitle.toUpperCase()}
      </div>
    </div>
  )
}

export default PlanDependentLink;
