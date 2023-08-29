const ButtonPlan = (props) => {
  const { title, image } = props
  return (
    <article className="bg-[#1C232E] text-white w-48 h-64 m-2 rounded-md">
      <div className="w-48 h-48 bg-gray-500 rounded-t-md">
        <img className="object-fill rounded-t-md" src={image} alt="" />
      </div>
      <p className="p-2">{ title }</p>
    </article>
  )
}

export default ButtonPlan;
