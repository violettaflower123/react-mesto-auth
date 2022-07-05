import React, { Children } from "react";

const Header = ({children}) => {
    return (
        <header className="header">
        <a className="header__logo" alt="Логотип" href='#'/>
        <p className="header__redirect">{children}</p>
      </header>
    )
}

export default Header;