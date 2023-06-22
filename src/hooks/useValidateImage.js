import { useState } from "react";

const useValidateImage = () => {
  const [image, setImage] = useState({
    preview: null,
    photo: null,
    file: null,
  });
  const [message, setMessage] = useState(null);

  const handleChangeFile = ({ target }) => {
    const { size, type } = target.files[0];
    if (size > 1000000) {
      setMessage("Tamanho máximo: 1MB.");
      target.value = "";
      setImage({...image, preview: null});
    } else if (type.split("/")[0] !== "image") {
      setMessage("Somente imagens são permitidas!");
      target.value = "";
      setImage({...image, preview: null});
    } else {
      setImage({
        preview: URL.createObjectURL(target.files[0]),
        photo: target.files[0].name,
        file: target.files[0],
      });
    }
  }

  return {
    image,
    message,
    handleChangeFile
  }
}

export default useValidateImage;