import { useState } from 'react';
import s from './AddListButton.module.css';
const AddListButton = () => {
  const [view, setView] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className={!view ? s.container : s.containerActive}>
      <button
        onClick={() => setView(true)}
        className={s.addListBtn}
        style={{ display: view ? 'none' : 'block' }}
      >
        <span></span>
        <span className={s.iconAdd}>+ Add a list</span>
      </button>
      <div style={{ display: view ? 'block' : 'none' }}>
        <form onSubmit={handleSubmit}>
          <input className={s.inputTitle} type="text" placeholder="Enter list title..."></input>
          <button className={s.addListBtnCreate} type="submit">
            Add list
          </button>
        </form>
        <button className={s.close} onClick={() => setView(false)}>
          x
        </button>
      </div>
    </div>
  );
};

export { AddListButton };
