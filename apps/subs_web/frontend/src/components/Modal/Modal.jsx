import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    border: 'none',
    background: 'none',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: 0,
  },
}

class Modal extends Component {
  constructor() {
    super()

    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    ReactModal.setAppElement('#app')
  }

  closeModal() {
    this.props.onClose()
  }

  render() {
    const { children } = this.props

    return (
      <ReactModal style={styles} isOpen onRequestClose={this.closeModal}>
        <button onClick={this.closeModal}>close</button>

        <div className="w-40-l w-60-m w-100-s center">
          {children}
        </div>
      </ReactModal>
    )
  }
}

Modal.defaultProps = {
  onClose: () => {},
}

export default Modal
