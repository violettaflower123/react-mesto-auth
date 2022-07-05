import { useContext, useEffect, useState } from "react";
//import { CardsContext } from "../context/CardsContext";
import { UserContext } from "../context/UserContext";
import "../index.css";
import Card from "./Card";

const Main = (props) => {
  const profileContext = useContext(UserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__box">
          <div className="profile__photo-overlay js-new-avatar-form">
            <img
              className="profile__photo"
              src={profileContext.avatar}
              alt="Жак-Ив Кусто"
              onClick={props.onEditAvatar}
            />
            <button className="profile__avatar"></button>
          </div>

          <div className="profile__text">
            <div className="profile__info">
              <h1 className="profile__title">{profileContext.name}</h1>
              <button
                className="profile__edit-button"
                onClick={props.onEditProfile}
              ></button>
            </div>
            <p className="profile__subtitle">{profileContext.about}</p>
          </div>
        </div>
        <button
          className="profile__add-button"
          onClick={props.onAddPlace}
        ></button>
      </section>

      <section
        className="elements"
        aria-label="Коллекция фото с подписями и кнопкой Лайк"
      >
        <ul className="elements__box">
          {props.cards.map((card, _id) => (
            <Card
              card={card}
              onCardClick={props.onCardClick}
              key={card._id}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
};
export default Main;
