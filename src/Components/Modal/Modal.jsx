import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import style from "./Modal.module.css";
import PropTypes from "prop-types";

const modalRoot = document.querySelector("#modal-root");

export const Modal = ({ onToggleModal, largeImageURL }) => {
  const onCloseModal = useCallback(
    ({ code }) => {
      if (code === "Escape") {
        onToggleModal();
      }
    },
    [onToggleModal]
  );
  useEffect(() => {
    window.addEventListener("keydown", onCloseModal);

    return () => {
      window.removeEventListener("keydown", onCloseModal);
    };
  }, [onCloseModal]);

  const onBackdropClick = (event) => {
    if (event.target === event.currentTarget) onToggleModal();
  };

  return createPortal(
    <div className={style.overlay} onClick={onBackdropClick}>
      <div className={style.modal}>
        <img src={largeImageURL} alt="" />
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  onToggleModal: PropTypes.func.isRequired,
  largeImageURL: PropTypes.string.isRequired,
};
