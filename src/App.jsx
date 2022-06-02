import { useState, useEffect } from "react";
import { Button } from "./Components/Button";
import { ImageGallery } from "./Components/ImageGallery";
import { Searchbar } from "./Components/Searchbar ";
import { getData } from "./api-service";
import { Modal } from "./Components/Modal";

export const App = () => {
  const [imageSearcher, setImageSearcher] = useState("");
  const [arrOfResult, setArrOfResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState("");
  const [error, setError] = useState(null);

  const handlerForSubmit = (searchQuerry) => {
    setImageSearcher(searchQuerry);
  };

  const handlerForPerPage = () => setCurrentPage(currentPage + 1);

  const onLoadImage = (anotherImages) => {
    setIsLoading(true);

    getData(imageSearcher, currentPage)
      .then(({ hits }) => {
        anotherImages
          ? setArrOfResult(
              hits.map(({ id, webformatURL, largeImageURL }) => ({
                id,
                webformatURL,
                largeImageURL,
              }))
            )
          : setArrOfResult([
              ...arrOfResult,
              ...hits.map(({ id, webformatURL, largeImageURL }) => ({
                id,
                webformatURL,
                largeImageURL,
              })),
            ]);
      })
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setCurrentPage(1);
    onLoadImage(true);
  }, [imageSearcher]);

  useEffect(() => {
    onLoadImage(false);
  }, [currentPage]);

  const onToggleModal = () => {
    setShowModal((showModal) => !showModal);
  };

  const onClickImg = (event) => {
    setLargeImageURL(
      arrOfResult.find((img) => event.target.src === img.webformatURL)
        .largeImageURL
    );
  };

  const show = arrOfResult.length > 0;

  return (
    <>
      <Searchbar isLoading={isLoading} onSubmit={handlerForSubmit} />
      {show && (
        <ImageGallery
          arrOfImages={arrOfResult}
          onToggleModal={onToggleModal}
          onClickImg={onClickImg}
        />
      )}

      {show && <Button onClick={handlerForPerPage} />}
      {showModal && (
        <Modal largeImageURL={largeImageURL} onToggleModal={onToggleModal} />
      )}
    </>
  );
};

export default App;
