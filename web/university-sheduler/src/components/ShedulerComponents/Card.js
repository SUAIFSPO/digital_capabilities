import "./styles.css";
import { format } from "date-fns";
const Card = ({ startTime, endTime, fio, name, groups, link }) => {
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
      <button onClick={() => alert(link)}>Подключиться</button>
    </div>
  );
};

export default Card;
