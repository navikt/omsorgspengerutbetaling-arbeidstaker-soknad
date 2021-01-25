import * as React from 'react';
import Modal, { ModalProps } from 'common/components/modal/Modal';
import bemUtils from 'common/utils/bemUtils';
import DinePlikterContent from '../dine-plikter-content/DinePlikterContent';
import './dinePlikterModal.less';

type Props = Omit<ModalProps, 'children'>;

const bem = bemUtils('dinePlikterModal');

const DinePlikterModal: React.FunctionComponent<Props> = (props) => (
    <Modal className={bem.block} {...props}>
        <DinePlikterContent />
    </Modal>
);

export default DinePlikterModal;
