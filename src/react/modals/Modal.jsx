import React, { useContext } from 'react';
import ImagePreviewModal from './ImagePreview';
import UploadModal from './Upload';
import { GlobalContext } from '../context';

const Modal = () => {
    const { modal } = useContext(GlobalContext);
    switch (modal.type) {
    case 'preview':
        return (
            <ImagePreviewModal />
        );
    case 'upload':
        return (
            <UploadModal />
        );
    default:
        return (<div />);
    }
};

export default Modal;
