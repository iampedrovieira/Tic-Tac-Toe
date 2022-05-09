import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
 
interface propsInput {
  'open':boolean,
  'setOpen':(isOpen:boolean) =>void,
  'name':string,
  'setName':(name:string) =>void,
  'onHandleName':() =>void,

}
export default class CheckReadyModal extends 
  React.Component<propsInput> {

  constructor(props: propsInput | Readonly<propsInput>){
    super(props);
  }
  render(){
    const handelClose = (event:any, reason:any) => {
      if (reason && reason == "backdropClick")return;
      this.props.setOpen(false)
    }
    return (
      <Modal
        open={this.props.open}
        onClose={handelClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <p> Insert your name </p>
        <input type="text" value={this.props.name} 
            onChange={(event)=>this.props.setName(event.target.value)} />
        <button onClick={()=>this.props.onHandleName()}> DONE </button>
        </Box>
      </Modal>
  );
  }
  
}
