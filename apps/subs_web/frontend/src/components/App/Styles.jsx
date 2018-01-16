import styled, { injectGlobal } from 'react-emotion'

injectGlobal`
  body {
    background: #FAFBFC;
  }
`

// TODO: Reuse colors inside emotion css
export default styled('div') `
  .App--sidebar {
    background-color: #1C2237;
  }

  .App--content {
    margin-left: 20%;
  }

  .App-top-bar {
    border-bottom-width: 2px;
    border-bottom-color: #EBEDF8;
  }

  .Header {
    background: #FDFDFD;
  }

  .Header--top-menu {
    margin-bottom: -4px;
  }

  .Header--menu-trigger, .Header--menu-button {
    min-width: 125px;
    padding: 15px;
  }

  .Header--logout-button {
    border-bottom-width: 4px;
    border-bottom-color: #EAEAEA;
  }

  .Header--logout-button:hover {
    color: #FF4444;
    border-bottom-color: #FF4444;
  }

  .Header--new-payment {
    background: #EF4370;
    color: white;
    border-bottom-color: #BC274E;
  }

  .Header--new-payment:hover {
    background: #EF4370;
    color: white;
    border-bottom-color: #BC274E;
  }

  .Header--new-payment:active {
    color: white;
    margin-top: 2px;
    border-bottom-width: 2px;
    border-bottom-color: #BC274E;
  }

  .Header--new-payment.active {
    color: white;
    margin-top: 0;
    border-bottom-width: 4px;
    border-bottom-color: #BC274E;
  }
`
