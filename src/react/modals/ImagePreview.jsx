import React, { useContext } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { GlobalContext } from '../context';


const ImagePreviewModal = () => {
    const { modal, setModal } = useContext(GlobalContext);

    const close = () => setModal({ type: 'node' });
    const data = modal.data || {};
    const link = data.link || '#';
    return (
        <Modal
            isOpen
            toggle={close}
        >
            <ModalHeader toggle={close}>
                Download Preview
            </ModalHeader>
            <ModalBody>
                <div className="well">
                    <Button
                        color="success"
                        size="lg"
                        download="lyra-plot.png"
                        block
                        href={link}
                    >
                        Download .png
                    </Button>
                </div>
                <img
                    src={link}
                    alt="plot preview"
                    style={{ maxWidth: '100%' }}
                />
            </ModalBody>
            <ModalFooter>
                <Button onClick={close} > Close </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ImagePreviewModal;
