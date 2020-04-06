import * as React from 'react';
import SummaryBlock from './SummaryBlock';
import SummaryList from 'common/components/summary-list/SummaryList';
import { FosterbarnApi } from '../../../types/SøknadApiData';

interface Props {
    fosterbarn: FosterbarnApi[];
}

const FosterbarnSummaryView: React.FC<Props> = (props: Props) => {
    const { fosterbarn } = props;

    return (
        <div>
            {fosterbarn.length > 0 && (
                <SummaryBlock header="Fosterbarn">
                    <SummaryList
                        items={fosterbarn}
                        itemRenderer={(barn: FosterbarnApi) => (
                            <>
                                {barn.fødselsnummer}
                                {/* TODO: Inkludere navn på fosterbarn? { - {formatName(barn.fornavn, barn.etternavn)}}*/}
                            </>
                        )}
                    />
                </SummaryBlock>
            )}
        </div>
    );
};

export default FosterbarnSummaryView;
