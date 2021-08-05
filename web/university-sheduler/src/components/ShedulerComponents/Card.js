import "./styles.css";
import { useState } from "react";
import { format } from "date-fns";
import AddLink from "../AddLink";
import { useSelector } from "react-redux";

const Card = ({
  startTime,
  endTime,
  fio,
  name,
  groups,
  link,
  id,
  isRecorded,
}) => {
  const [open, setOpen] = useState(false);
  const isDate = new Date() > new Date(endTime);
  const type = useSelector(({ commonReducer }) => commonReducer.type);
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
        {isDate ? (
          isRecorded ? (
            <a href={link}>Посмотреть материал</a>
          ) : (
            "Добавить материал"
          )
        ) : (
          "Подключиться"
        )}
      </button>
      {isDate && isRecorded && type === "curator" && (
        <button
          onClick={() => {
            if (isDate) {
              setOpen(true);
            } else {
              alert(link);
            }
          }}
        >
          Изменить материал
        </button>
      )}
      {open && <AddLink open={open} setOpen={setOpen} id={id} />}
    </div>
  );
};

export default Card;
