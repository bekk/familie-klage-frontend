import * as React from 'react';
import { useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import FritekstBrev from './FritekstBrev';
import PdfVisning from './PdfVisning';
import { IFritekstBrev } from './BrevTyper';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import styled from 'styled-components';
import { useHentBrev } from '../../../App/hooks/useHentBrev';
import { useApp } from '../../../App/context/AppContext';
import { Button } from '@navikt/ds-react';
import BrevModal from './BrevModal';

const redigeringsmodus = {
    backgroundColor: '#f2f2f2',
    padding: '2rem 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '5rem',
    justifyContent: 'center',
};
const lesemodus = {
    backgroundColor: '#f2f2f2',
    padding: '2rem 2rem',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center' as const,
};

const BrevKnapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 0rem;
`;

interface IBrev {
    behandlingId: string;
}

export const Brev: React.FC<IBrev> = ({ behandlingId }) => {
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

    const {
        personopplysningerResponse,
        behandling,
        hentBehandling,
        visAdvarselSendBrev,
        settVisAdvarselSendBrev,
        behandlingErRedigerbar,
    } = useBehandling();

    const { mellomlagretBrev } = useHentBrev(behandlingId);

    const { axiosRequest } = useApp();

    const oppdaterBrevRessurs = (respons: Ressurs<string>) => {
        settBrevRessurs(respons);
    };

    const [senderInn, settSenderInn] = useState<boolean>(false);

    const [didMount, setDidMount] = useState(false);

    useEffect(() => {
        setDidMount(true);
        return () => setDidMount(false);
    }, []);

    if (!didMount) {
        return null;
    }

    const ferdigstillBrev = () => {
        if (senderInn) {
            return;
        }

        settSenderInn(true);
        axiosRequest<null, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling/ferdigstill/${behandlingId}`,
        }).then(() => {
            settSenderInn(false);
            hentBehandling.rerun();
            settVisAdvarselSendBrev(false);
        });
    };

    return (
        <div>
            <div style={behandlingErRedigerbar ? redigeringsmodus : lesemodus}>
                <div>
                    <DataViewer response={{ personopplysningerResponse, behandling }}>
                        <FritekstBrev
                            behandlingId={behandlingId}
                            mellomlagretFritekstbrev={mellomlagretBrev as IFritekstBrev}
                            oppdaterBrevressurs={oppdaterBrevRessurs}
                        />
                    </DataViewer>
                    {behandlingErRedigerbar ? (
                        <BrevKnapper>
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => {
                                    settVisAdvarselSendBrev(true);
                                }}
                            >
                                Ferdigstill
                            </Button>

                            {visAdvarselSendBrev && (
                                <BrevModal
                                    ferdigstillBrev={ferdigstillBrev}
                                    senderInn={senderInn}
                                />
                            )}
                        </BrevKnapper>
                    ) : (
                        ''
                    )}
                </div>
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </div>
        </div>
    );
};
