import { Button } from '../Button';
import { Div } from '../Div';
import { setStyle } from '../../utils/DomUtils';
import { getRoom, updateRoom } from '../../apis/RoomApi';
import { Input } from '../Input';
import { getSelf, getUser } from '../../apis/UserApi';
import { Span } from '../Span';
import { Br } from '../Br';
import { Routes } from '../../routes/Routes';
import { setURL } from '../../utils/HistoryUtils';

type ManageMembersModalParams = {
  buttonRef: HTMLElement,
  parentRef: HTMLElement,
  roomID: string
}

const ManageMembersModal = (params: ManageMembersModalParams) => {

    const self = getSelf();

    const overlay = Div();
    setStyle(overlay, {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });

    const modal = Div();
    setStyle(modal, {
      width: window.innerWidth <= 480 ? '70vw' : '20vw',
      padding: '20px',
      zIndex: '1',
      backgroundColor: 'white',
    });
    overlay.append(modal);
  
    //Closes when clicked outside of modal
    document.addEventListener('click', (e) => {
      if (params.parentRef.contains(overlay) && !modal.contains(e.target as Node) && !params.buttonRef.contains(e.target as Node)) {
        params.parentRef.removeChild(overlay);
      }
    });

    const Header = Div();
    setStyle(Header, {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '30px',
      paddingBottom: '20px',
    });

    const close = Button({text: 'X'})
    close.addEventListener('click', (e) => {
      params.parentRef.removeChild(overlay);
    })
    Header.append(Div().innerText = 'Manage Members');
    Header.append(close);

    modal.appendChild(Header);

    const memberChecklist = Div();

    const room = getRoom(params.roomID);
    room.users.forEach((member) => {
      const memberData = getUser(member);
      const entry = Div();
      const checkbox = Input();
      checkbox.type = 'checkbox';
      checkbox.id = memberData._id;
      checkbox.name = memberData.name;
      checkbox.checked = true;

      const label = Span();
      label.textContent = memberData.name;

      entry.append(checkbox, label, Br())
      memberChecklist.append(entry);
    });

    modal.append(memberChecklist);

    const submitButton = Button({text: 'submit'});
    setStyle(submitButton, {
      marginTop: '20px'
    });
    submitButton.addEventListener('click', async (e) => {
      const checklist = memberChecklist.children;
      let members: string[] = [] //_id's
      for(let i=0; i<checklist.length; i++) {
        const item = checklist.item(i)?.firstChild as HTMLInputElement
        if(item.checked) {
          members.push(item.id);
        }
      }

      await updateRoom({roomID: params.roomID, users: members});

      if(self) {
        !members.includes(self._id) ? setURL(Routes.home) : window.location.reload();
      }
      else {
        window.location.reload();
      }
    });
    modal.append(submitButton);

    return overlay;

}

export default ManageMembersModal;