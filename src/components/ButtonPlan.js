const ButtonPlan = (props) => {
  const { title, image } = props
  return (
    <article className="bg-[#1C232E] text-white w-48 h-64 m-2 rounded-lg">
      <div className="w-48 h-48 bg-gray-500 mb-1 rounded-t-lg">
        <img className="object-fill rounded-t-lg" src={image} alt="" />
      </div>
      <p className="p-2">{ title }</p>
    </article>
  )
}

export default ButtonPlan;
