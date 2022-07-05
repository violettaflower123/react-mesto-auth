import { useContext } from "react";
import { UserContext } from "../context/UserContext";
//import api from "../utils/Api";

const Card = ({ card, onCardClick, onCardLike, onCardDelete }) => {
  
  let count = card.likes.length;
  const currentUser = useContext(UserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `element__trash ${
    isOwn ? "element__trash" : "element__trash_hidden"
  }`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__like ${
    isLiked ? "element__like_active" : "element__like"
  }`;

  //функция для увеличения картинки по клику
  function handleCardClick() {
    onCardClick(card);
  }

  function handleLike() {
    onCardLike(card);
  }
  
  function handleDelete() {
    onCardDelete(card);
  }

  return (
    <li className="element">
      <button className={cardDeleteButtonClassName} onClick={handleDelete}></button>
      <img
        className="element__image"
        alt="Изображение"
        src={card.link}
        onClick={handleCardClick}
        //onCardLike={onCardLike}
      />

      <div className="element__info">
        <h2 className="element__text">{card.name}</h2>
        <button
          className={cardLikeButtonClassName}
          onClick={handleLike}
        ></button>
      </div>
    </li>
  );
};

export default Card;
