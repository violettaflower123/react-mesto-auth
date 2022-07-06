import { useState, useEffect, useContext, useSyncExternalStore } from "react";
import "../App.css";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import { UserContext } from "../context/UserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import { Link } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../auth.js";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
  });

  useEffect(() => {
    tockenCheck();
  }, []);

  //получить карточки с сервера
  useEffect(() => {
    api
      .getDataInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => alert(err));
  }, []);

  const [currentUser, setCurrentUser] = useState({ name: "", about: "" });

  //получить данные о пользователе с сервера
  useEffect(() => {
    api
      .getDataUser()

      .then((profile) => {
        setCurrentUser(profile);
      })
      .catch((err) => alert(err));
  }, []);

  const [isEditAvatarPopupOpen, setOpenAvatar] = useState(false);
  const [isEditProfilePoupOpen, setOpenProfile] = useState(false);
  const [isAddPlacePopupOpen, setOpenPlace] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isConfirmTooltipOpen, setOpenConfirmTooltip] = useState(false);
  const [isErrorTooltipOpen, setOpenErrorTooltip] = useState(false);

  //открытие попапов
  function handleEditAvatarClick() {
    setOpenAvatar(true);
  }

  function handleEditProfileClick() {
    setOpenProfile(true);
  }

  function handleAddPlaceClick() {
    setOpenPlace(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  //при успешной регистрации открывается модальное окно
  function handleConfirmTooltip() {
    setOpenConfirmTooltip(true);
  }

  //при неуспешной регистрации открывается попап
  function handleErrorTooltip() {
    setOpenErrorTooltip(true);
  }

  //при успешной регистрации открывается модальное окно-успех, если нажать на крестик - переход на страницу входа
  function closeConfirmToolTip() {
    closeAllPopups();
    navigate("/sign-in");
  }

  //закрытие попапов
  function closeAllPopups() {
    setOpenAvatar(false);
    setOpenPlace(false);
    setOpenProfile(false);
    setSelectedCard(null);
    setOpenConfirmTooltip(false);
    setOpenErrorTooltip(false);
  }

  //обновление данных о пользователе
  function handleUpdateUser(data) {
    api
      .changeUser(data)
      .then((profile) => {
        setCurrentUser(profile);
        closeAllPopups();
      })
      .catch((err) => alert(err));
  }

  //обновление аватарки
  function handleUpdateAvatar(data) {
    api
      .changeAvatar(data)
      .then((profile) => {
        setCurrentUser(profile);
        closeAllPopups();
      })
      .catch((err) => alert(err));
  }

  //добавление новой карточки
  function handleAddNewCard(data) {
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => alert(err));
  }

  //ставим лайки
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => alert(err));
  }

  //удаление карточки
  function handleCardDelete(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isOwn = card.owner._id === currentUser._id;

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => (c._id === card._id ? "" : c)));
      })
      .catch((err) => alert(err));
  }

  //проверка асторизован ли пользователь при загрузке страницы
  const tockenCheck = () => {
    let jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.checkToken(jwt).then((res) => {
        console.log(res);
        if(res.jwt) {
          
          localStorage.setItem("jwt", res.jwt);
          setUserData({
            userName: res._id,
            email: res._id
          });
          setLoggedIn(true);
          navigate('/mesto-react');
        }
      });
    }
  };

  //регистрация
  const handleRegister = (email, password) => {
    auth
      .register(email, password)
      .then((data) => {
        //console.log(data);
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt);
        }
      })
      .then(() => handleConfirmTooltip())
      .catch(() => handleErrorTooltip());
  };

  //логин
  const handleLogin = (email, password) => {
    auth
      .login(email, password)
      .then((data) => {
        //console.log(data);
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt);
        }
      })
      .then(() => {
        setLoggedIn(true);
        navigate("/mesto-react");
      });
  };

  return (
    <UserContext.Provider value={currentUser}>
      <Routes>
        <Route
          exact
          path="/mesto-react"
          element={
            <div className="app">
              <div className="page__content">
                <>
                  <Header>
                    <div>
                      <span>{userData.email}</span>
                      <span>Выйти</span>
                    </div>
                  </Header>

                  <Main
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                  />

                  <Footer />
                </>

                <EditProfilePopup
                  isOpen={isEditProfilePoupOpen}
                  onClose={closeAllPopups}
                  onUpdateUser={handleUpdateUser}
                />

                <AddPlacePopup
                  isOpen={isAddPlacePopupOpen}
                  onClose={closeAllPopups}
                  onAddNewPlace={handleAddNewCard}
                />

                <ImagePopup card={selectedCard} onClose={closeAllPopups} />

                <PopupWithForm
                  name="delete"
                  title="Вы уверены?"
                  buttonText="Да"
                  extraClass="popup__form_type_delete"
                />

                <EditAvatarPopup
                  isOpen={isEditAvatarPopupOpen}
                  onClose={closeAllPopups}
                  onUpdateAvatar={handleUpdateAvatar}
                />
              </div>
            </div>
          }
        />
        <Route
          path="/sign-up"
          element={
            <div className="app">
              <div className="page__content">
                <Header>
                  <Link to={"/sign-in"} className="header__redirect-link">
                    Вход
                  </Link>
                </Header>
                <Register
                  title="Регистрация"
                  buttonText="Зарегистрироваться"
                  handleRegister={handleRegister}
                >
                  <Link to={"/sign-in"} className="popup__btm-redirect-link">
                    Уже зарегистрированы? Войти.
                  </Link>
                </Register>
                <InfoTooltip
                  name="confirm"
                  isOpen={isConfirmTooltipOpen}
                  onClose={closeConfirmToolTip}
                >
                  <div>
                    <div className="confirm__img-success"></div>
                    <p className="confirm__title">
                      Вы успешно зарегистрировались!
                    </p>
                  </div>
                </InfoTooltip>

                <InfoTooltip
                  name="error"
                  isOpen={isErrorTooltipOpen}
                  onClose={closeAllPopups}
                >
                  <div>
                    <div className="confirm__img-error"></div>
                    <p className="confirm__title">
                      Что-то пошло не так! Зарегистрируйтесь еще раз.
                    </p>
                  </div>
                </InfoTooltip>
              </div>
            </div>
          }
        />
        <Route
          path="/sign-in"
          element={
            <div className="app">
              <div className="page__content">
                <Header>
                  <Link to={"/sign-up"} className="header__redirect-link">
                    Регистрация
                  </Link>
                </Header>
                <Login
                  title="Вход"
                  buttonText="Войти"
                  handleLogin={handleLogin}
                />
              </div>
            </div>
          }
        />
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/mesto-react" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />

        <Route path="*" element={<div>404</div>} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
