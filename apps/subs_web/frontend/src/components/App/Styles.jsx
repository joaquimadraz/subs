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
`
