import React from 'react';
import Header from './Header';

function Login() {
    return (
        <>
        <Header />
        <div className="loginBlock">
            <h2 className="loginBlock__header">Вход</h2>
            <form className="loginBlock__input-form">
                
            </form>
            <button className="loginBlock__button-enter"></button>
        </div>
        </>
    );
}

export default Login;