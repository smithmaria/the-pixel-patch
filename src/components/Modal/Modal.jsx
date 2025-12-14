import './modal.css'

const Modal = ({ children, isVisible }) => {
  if(!isVisible) return null;

  return (
    <div className="overlay">
      <div onClick={(e) => e.stopPropagation()} className="modal">
        {children}
      </div>
    </div>
  )
}

export default Modal;
