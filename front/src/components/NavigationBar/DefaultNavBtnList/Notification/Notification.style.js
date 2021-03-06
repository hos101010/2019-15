import styled, { keyframes } from 'styled-components';

const slideRight = keyframes`
    0% {
      opacity: 0;
      transform: translateX(-1.6rem);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
`;

export const NoticeStyle = styled.div`
  animation: ${slideRight} 0.3s ease 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  opacity: 0.95;
  width: 20rem;
  height: 3rem;
  border-radius: 1rem;
  margin: 1rem;
  padding: 1rem;
  vertical-align: middle;
`;

export const NotificationStyle = styled.div`
  left: 1rem;
  top: 1rem;
  position: fixed;
`;
