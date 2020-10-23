import React, { useEffect } from 'react'

function FlashMessage({ state }) {
  function handleRemove(e) {
    e.currentTarget.style.display = 'none'
  }

  return (
    <div className="flash-message-container">
      {state.flashMessages.length > 0 &&
        state.flashMessages.map((flashMessage, index) => {
          return (
            <div key={index} className={'alert ' + flashMessage.color} onAnimationEnd={e => handleRemove(e)}>
              <div className="flashMessage">{flashMessage.message}</div>
            </div>
          )
        })}
    </div>
  )
}

export default FlashMessage
