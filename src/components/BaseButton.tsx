import Button, { buttonClasses } from '@mui/base/Button';
import { styled } from '@mui/system';

export const BaseButton = styled(Button)(
    () => `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    background-color: #007FFF;
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: none;
    box-shadow: 0px 4px 30px #eaeef2;
  
    &:hover {
      background-color: '#0072E5';
    }
  
    &.${buttonClasses.active} {
      background-color: #0059B2;
    }
  
    &.${buttonClasses.focusVisible} {
      box-shadow: 0 3px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
      outline: none;
    }
  
    &.${buttonClasses.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }
    `,
);