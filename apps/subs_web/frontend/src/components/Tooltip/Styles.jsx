import styled from 'react-emotion'

export default styled('div') `
  .Tooltip--text {
    width: 100px;
    left: 50%;
    transform: translateY(-110%) translateX(-50%);
    position: absolute;
    background: #000;
    padding: .5rem;
    text-align: center;
    border-radius: .25rem;
    font-size: .75rem;
  }

  .Tooltip--arrow {
    border-style: solid;
    border-width: 5px 5px 0 5px;
    border-color: #000 transparent transparent transparent;
    position: absolute;
    left: 50%;
    bottom: -4px;
    transform: translateY(0) translateX(-50%);
  }
`
