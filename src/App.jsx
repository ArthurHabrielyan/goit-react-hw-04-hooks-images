import { useState, useEffect, useRef } from "react";
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

  const forSearch = useRef(true);

  const handlerForSubmit = (searchQuerry) => {
    setCurrentPage(1);
    setImageSearcher(searchQuerry);
    forSearch.current = true;
  };

  const handlerForPerPage = (event) => {
    event.preventDefault();
    setCurrentPage(currentPage + 1);
  };

  const onLoadImage = () => {
    setIsLoading(true);

    getData(imageSearcher, currentPage)
      .then(({ hits }) => {
        setArrOfResult([
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

  const onLoadMoreImage = () => {
    setIsLoading(true);

    getData(imageSearcher, currentPage)
      .then(({ hits }) => {
        setArrOfResult(
          hits.map(({ id, webformatURL, largeImageURL }) => ({
            id,
            webformatURL,
            largeImageURL,
          }))
        );
      })
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (imageSearcher && forSearch.current) {
      setArrOfResult([]);
      onLoadMoreImage();
      forSearch.current = false;
    }

    if (currentPage === 1) {
      return;
    } else {
      onLoadImage();
    }
  }, [currentPage, imageSearcher]);

  // useEffect(() => {}, [currentPage]);

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
