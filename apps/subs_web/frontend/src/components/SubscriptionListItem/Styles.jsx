import styled from 'react-emotion'

// https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md

export default styled('li') `
  background: ${props => props.background || 'none'};

  a {
    color: ${props => props.textColor || '#000'};
  }
`
