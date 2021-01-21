import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ImagePopup from './ImagePopup';
import Footer from './Footer';
import '../index.css';
import api from '../utils/Api';



function App() {

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cards, setCards] = React.useState([]);

    const [currentUser, setCurrentUser] = React.useState({name:'', about:'', avatar:''});
    



    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(true);
    };
    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
    };
    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
    }

    React.useEffect(()=>{
        Promise.all([api.getInitialCards(), api.getUserInfo()])  
        .then(([cards, res]) => {
            setCards(cards);
            setCurrentUser(res);
        })
        .catch((err) => console.log(err));
    },[]);

    function handleUpdateUser(data){
        api.setUserInfo(data)
        .then((res) => {
            setCurrentUser(res);
            closeAllPopups();
        })
        .catch((error) => console.log('Ошибка при редактировании данных пользователя', error));
    }

    function handleUpdateAvatar(link){
        api.patchNewAvatar(link)
        .then((link)=>{
            setCurrentUser(link);
            closeAllPopups();
        })
        .catch((error) => console.log(error));
    }

    function handleAddPlaceSubmit(data){
        api.addNewCard(data)
          .then((newCard) => {
            setCards([newCard, ...cards]);
            closeAllPopups();
          });
      }

    function handleCardLike(card){
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.addLikeDislikeCard(card._id, !isLiked)
          .then((newCard) => {
              console.log(newCard)
            const newCards = cards.map((item) => item._id === card._id ? newCard : item);
            setCards(newCards);
          })
          .catch((error) => console.log(error));
      }


    function handleDeleteCard(card){
        api.deleteCard(card._id)
        .then(()=>{
            const newCards = cards.filter((currentCard)=> currentCard._id !== card._id);
            setCards(newCards);
            closeAllPopups();
        })
        .catch((error) => console.log(error));
    }

    const closeAllPopups = () =>{
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
    
        setSelectedCard(null);
    }

return (
    <CurrentUserContext.Provider value={currentUser} >
        <Header />   
            <Main 
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}

                handleCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleteCard}
                
                cards={cards}
                setCards={setCards}
                onClose={closeAllPopups}
        />
        <Footer />

    <PopupWithForm 
        name='confirm' 
        title='Вы уверены?' 
        idButton='delete' 
        buttonText='Сохранить'
    />
    
    <EditAvatarPopup 
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups} 
        onUpdateAvatar={handleUpdateAvatar}
    /> 
    
    <EditProfilePopup 
        isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser} 
    /> 

    <AddPlacePopup
        isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
    />

    <ImagePopup 
        onClose={closeAllPopups}
        selectedCard={selectedCard}
    />   
    </CurrentUserContext.Provider>
  );
}

export default App;
