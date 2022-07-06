const InfoTooltip = (props) => {
    return (
        //<section><section className={`popup popup_type_${props.name} popup_opened`}>
        <section className={`popup popup_type_${props.name} ${props.isOpen && "popup_opened"}`}>
        
      <form
        className={`popup__form popup__form_confirm`}
        name={`form-${props.name}`}
        noValidate
      >
        <button
          className="popup__close popup__close_name"
          type="button"
          onClick={props.onClose}
        ></button>
        <div className="popup__main-container">

          {props.children}

        </div>
      </form>
    </section>
    )
}

export default InfoTooltip;