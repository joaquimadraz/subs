import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faTimesCircle from '@fortawesome/fontawesome-free-solid/faTimesCircle'

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 2,
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    bottom: 'auto',
    right: 'auto',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'none',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
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
      <ReactModal
        isOpen
        style={styles}
        onRequestClose={this.closeModal}
        className={{
          base: 'ReactModal w-40-l w-70-m w-100 center f6',
          afterOpen: 'ReactModal_after-open',
          beforeClose: 'ReactModal_before-close',
        }}
      >
        <button
          className="absolute right-1 bn bg-transparent pa0 ma0 f3 pointer"
          onClick={this.closeModal}
          style={{ top: '1.4rem' }}
        >
          <FontAwesomeIcon icon={faTimesCircle} className="black-20 dim" />
        </button>
        {children}
      </ReactModal>
    )
  }
}

Modal.propTypes = {
  children: PropTypes.object,
  onClose: PropTypes.func,
}

Modal.defaultProps = {
  children: [],
  onClose: () => {},
}

export default Modal
