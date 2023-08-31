const PlanDependentLink = ({ assignmentId, assignmentTitle }) => {
  return (
    <div
      key={assignmentId}
      className="font-bold bg-gray-400 p-2 rounded-md mb-2 w-full flex justify-between"
    >
      <div>
        {assignmentTitle.toUpperCase()}
      </div>
    </div>
  )
}

export default PlanDependentLink;
