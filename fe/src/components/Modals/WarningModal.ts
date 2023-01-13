import { setStyle } from "../../utils/DomUtils";
import { Button } from "../Button";
import { Div } from "../Div";

type WarningModalProps = {
    title: string;
    content: string;
    acceptButtonLabel?: string;
    buttonRef: HTMLElement; //button that opens the modal
    onAccept: () => void;
}

const WarningModal = (props: WarningModalProps) => {
    const overlay = Div();
    setStyle(overlay, {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1',
    });

    const modal = Div();
    setStyle(modal, {
        width: window.innerWidth <= 480 ? '70vw' : '20vw',
        padding: '20px',
        zIndex: '1',
        backgroundColor: 'white',
        borderTop: 'solid 10px #c9081b',
        textAlign: 'center',
    });

    //Closes when clicked outside
    document.addEventListener('click', (e) => {
        if (!modal.contains(e.target as Node) && !props.buttonRef.contains(e.target as Node)) {
          overlay.style.display = "none";
        }
    });

    const Header = Div();
    setStyle(Header, {
      fontSize: '30px',
      paddingBottom: '20px',
    });

    const title = Div();
    title.innerText = props.title
    Header.append(title);

    modal.appendChild(Header);

    const content = Div()
    setStyle(content, {
        fontSize: '15px',
        paddingBottom: '10px',
    })
    content.innerText = props.content;

    modal.appendChild(content);

    const acceptBtn = Button({text: props.acceptButtonLabel ? props.acceptButtonLabel : 'OK'});
    setStyle(acceptBtn, {
        marginRight: '5px',
    })
    acceptBtn.addEventListener('click', (e) => {
        props.onAccept();
    })

    const cancelBtn = Button({text: 'Cancel'});
    setStyle(cancelBtn, {
        marginRight: '5px',
    })
    cancelBtn.addEventListener('click', (e) => {
        console.log('cancel clicked');
        overlay.style.display = 'none';
    })

    modal.append(acceptBtn, cancelBtn);

    overlay.appendChild(modal);

    return overlay;
}

export default WarningModal;