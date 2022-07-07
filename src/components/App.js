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

  //проверка токена при каждой загрузке страницы
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
    navigate("/signin");
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
    let jwt = localStorage.getItem("token");
    if (jwt) {
      auth.checkToken(jwt).then((data) => {
        if (data.data.email) {
          setUserData({
            userData: data.data._id,
            email: data.data.email,
          });
          setLoggedIn(true);
          navigate("/");
        }
      });
    }
  };

  //регистрация
  const handleRegister = (email, password) => {
    auth
      .register(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setUserData({
            userName: data.data._id,
            email: data.email,
          })

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
        if (data.token) {
          localStorage.setItem("token", data.token);
          setUserData({
            userName: data._id,
            email: data.email
          })
        }
      })
      .then(() => {
        setLoggedIn(true);
        navigate("/");
        tockenCheck();
      });
  };

  //выход из системы
  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUserData({
      userName: "",
      email: "",
    });
    setLoggedIn(false);
    navigate("/signin");
  };

  return (
    <UserContext.Provider value={currentUser}>
      <div className="app">
        <div className="page__content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header>
                    <div>
                      <span className="header__user-email">{userData.email}</span>
                      <button
                        className="header__exit-btn"
                        onClick={handleLogOut}
                      >
                        Выйти
                      </button>
                    </div>
                  </Header>

                  <ProtectedRoute 
                  path='/' 
                  component={Main}
                  isLogged={loggedIn}
                      onEditAvatar={handleEditAvatarClick}
                      onEditProfile={handleEditProfileClick}
                      onAddPlace={handleAddPlaceClick}
                      onCardClick={handleCardClick}
                      cards={cards}
                      onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}>
                  </ProtectedRoute>
                  <Footer />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <div className="app">
                  <div className="page__content">
                    <Header>
                      <Link to={"/signin"} className="header__redirect-link">
                        Вход
                      </Link>
                    </Header>
                    <Register
                      title="Регистрация"
                      buttonText="Зарегистрироваться"
                      handleRegister={handleRegister}
                    >
                      <Link
                        to={"/signin"}
                        className="popup__btm-redirect-link"
                      >
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
              path="/signin"
              element={
                <div className="app">
                  <div className="page__content">
                    <Header>
                      <Link to={"/signup"} className="header__redirect-link">
                        Регистрация
                      </Link>
                    </Header>
                    <Login
                      title="Вход"
                      buttonText="Войти"
                      handleLogin={handleLogin}
                      //tockenCheck={tockenCheck}
                    />
                  </div>
                </div>
              }
            />
            <Route
              path="/"
              element={
                loggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />

            <Route path="*" element={<div>404</div>} />
          </Routes>

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
    </UserContext.Provider>
  );
}

export default App;
