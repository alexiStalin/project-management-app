import './Modal.css';

type MyProps = {
  isOpened: boolean;
  onModalClose: (active: boolean) => void;
  reset?: () => void;
  children?: JSX.Element | JSX.Element[];
  title?: string;
  style?: object;
};

const Modal = (props: MyProps) => {
  const { reset } = props;
  return (
    <div
      className={`modal__wrapper ${props.isOpened ? 'open' : 'close'}`}
      style={{ ...props.style }}
      onClick={() => {
        reset;
        props.onModalClose(false);
      }}
    >
      <div className="modal__body" onClick={(e) => e.stopPropagation()}>
        <div className="modal__close" onClick={() => props.onModalClose(false)}>
          ✕
        </div>
        <h2>{props.title}</h2>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
