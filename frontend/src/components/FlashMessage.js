import React, { useEffect } from 'react'

function FlashMessage({ state }) {
  function handleRemove(e) {
    e.currentTarget.style.display = 'none'
  }

  function getColor(color) {
    if (color == 'success') {
      return 'alert-success'
    } else if (color == 'error') {
      return 'alert-danger'
    }
  }

  return (
    <div className="flash-message-container">
      {state.flashMessages.length > 0 &&
        state.flashMessages.map((flashMessage, index) => {
          return (
            <div key={index} className={'alert ' + getColor(flashMessage.color)} onAnimationEnd={e => handleRemove(e)}>
              {flashMessage.message}
            </div>
          )
        })}
    </div>
  )
}

export default FlashMessage
