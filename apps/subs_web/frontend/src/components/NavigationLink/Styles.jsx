import styled from 'react-emotion'

export default styled('span') `
  a {
    color: #7685B6;
    padding: 0.8rem;

    & svg {
      opacity: 0.7;
      color: #0077FF;
    }
  }

  a.active {
    color: white;
    background: #0077FF;

    & svg {
      color: white;
    }

    & :hover {
      color: white;

      & svg {
        opacity: 0.7;
      }
    }
  }

  a:hover {
    color: #0077FF;

    & svg {
      opacity: 1;
    }
  }
`
