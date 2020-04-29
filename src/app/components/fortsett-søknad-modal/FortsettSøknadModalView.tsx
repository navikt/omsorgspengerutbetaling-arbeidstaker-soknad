import * as React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import Modal from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/modal/Modal';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import './fortsettSøknadModalView.less';

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
    onFortsettPåSøknad: () => void;
    onStartNySøknad: () => void;
}

const FortsettSøknadModalView: React.FC<Props> = (props: Props) => {
    const { isOpen, onRequestClose, onFortsettPåSøknad, onStartNySøknad } = props;
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Fortsette på påbegynt søknad?">
            <div className={'fortsett-soknad-modal-view-wrapper'}>
                <Box padBottom={'xl'}>
                    <CounsellorPanel type={'plakat'} kompakt={true} fargetema={'info'}>
                        <div>
                            Du har en påbegynt søknad lagret hos oss. Velg en av alternativene under for om du øsker å
                            fortsette på den lagrede søknaden, eller om du øsnker å starte på en ny søknad.
                        </div>
                    </CounsellorPanel>
                </Box>
                <div className={'knappe-wrapper'}>
                    <div className={'knapp-wrapper'}>
                        <Box padBottom={'m'}>
                            <Knapp type={'hoved'} onClick={onFortsettPåSøknad}>
                                Fortsett på søknaden
                            </Knapp>
                        </Box>
                    </div>
                    <div className={'knapp-wrapper'}>
                        <Box padBottom={'m'}>
                            <Knapp type={'hoved'} onClick={onStartNySøknad}>
                                Start ny søknad
                            </Knapp>
                        </Box>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FortsettSøknadModalView;
