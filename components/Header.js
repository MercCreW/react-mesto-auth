import headLogo from "../images/header-logo.svg";
import React from 'react';

function Header() {
    return (
        <header className ="header">
            <img className = "header__logo" src={headLogo} alt="Логотип два слова. Место.Россия. В белом исполнении." />
        </header>
    );
}

export default Header;