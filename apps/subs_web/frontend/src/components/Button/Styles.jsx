import styled from 'react-emotion'

export default styled('button') `
  min-width: 90px;
  outline: 0;

  &:disabled {
    opacity: 0.5;
  }

  &:active {
    -webkit-transform:translateY(.15rem);
    transform:translateY(.15rem)
  }
`
