import styled from 'react-emotion'

export default styled('button') `
  padding: 11px;
  min-width: 75px;
  box-shadow:inset 0 0 0 .15rem rgba(0,0,0,0.2),0 .15rem 0 0 #e7e6e4;
  outline: 0;

  &:disabled {
    opacity: 0.5;
  }

  &:focus, &:hover {
    box-shadow:inset 0 0 0 .15rem rgba(0,0,0,0.2),0 .15rem 0 0 #e7e6e4;
  }

  &:active {
    box-shadow:inset 0 0 0 .15rem rgba(0,0,0,0.2);
    -webkit-transform:translateY(.15rem);
    transform:translateY(.15rem)
  }
`
