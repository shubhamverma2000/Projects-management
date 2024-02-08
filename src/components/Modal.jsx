import React from 'react'

const Modal = ({item, onClose}) => {
  return (
    <div className="modal-overlay">
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>Close</span>
                {Object.entries(item).map(([key, value]) => (
                    <div key={key}>
                        <h3>{`${key}`}</h3>
                        <p>{`${value}`}</p>
                    </div>
                ))}
            </div>
        </div>
  </div>
  )
}

export default Modal