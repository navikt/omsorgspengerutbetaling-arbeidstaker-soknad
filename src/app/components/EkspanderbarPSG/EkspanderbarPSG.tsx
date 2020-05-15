import * as React from 'react';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import ExpandableInfo from '../expandable-content/ExpandableInfo';
import PictureScanningGuide from '../picture-scanning-guide/PictureScanningGuide';
import FormBlock from 'common/components/form-block/FormBlock';

const EkspanderbarPSG: React.FC = () => {
    return (
        <FormBlock>
            <ExpandableInfo title={'Slik tar du et godt bilde av dokumentet'}>
                <HelperTextPanel>
                    <PictureScanningGuide />
                </HelperTextPanel>
            </ExpandableInfo>
        </FormBlock>
    );
};

export default EkspanderbarPSG;
