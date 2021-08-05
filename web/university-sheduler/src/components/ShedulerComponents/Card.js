import "./styles.css";
import { useState } from "react";
import { format } from "date-fns";
import AddLink from "../AddLink";
const Card = ({ startTime, endTime, fio, name, groups, link, id }) => {
  const [open, setOpen] = useState(false);
  const isDate = new Date() > new Date(endTime);
  return (
    <div className='card'>
      <p>{name}</p>
      <p>{fio}</p>
      <p>
        {format(new Date(startTime), "HH:mm ")}-
        {format(new Date(endTime), " HH:mm")}
      </p>
      <p>
        группы:{" "}
        {groups?.map(({ number }) => (
          <span key={number}>{`${number}, `}</span>
        ))}
      </p>
      <button
        onClick={() => {
          if (isDate) {
            setOpen(true);
          } else {
            alert(link);
          }
        }}
        style={{ cursor: "pointer" }}
      >
        {isDate ? "Добавить материал" : "Подключиться"}
      </button>
      {open && <AddLink open={open} setOpen={setOpen} id={id} />}
    </div>
  );
};

export default Card;
