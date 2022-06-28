import * as React from 'react';
import { useEffect, useState } from 'react';
import Valgvisning from './Valgvisning';
import Historikk from './Historikk';
import Dokumenter from './Dokumenter';
import styled from 'styled-components';
import { Back, Next } from '@navikt/ds-icons';
import navFarger from 'nav-frontend-core';
import { useBehandling } from '../../../App/context/BehandlingContext';
//import { RessursStatus } from '../../../App/typer/ressurs';
import { erBehandlingUnderArbeid } from '../../../App/typer/behandlingstatus';
import { behandlingMock } from '../BehandlingContainer';

interface IHøyremenyProps {
    behandlingId: string;
    åpenHøyremeny: boolean;
}

const StyledBack = styled(Back)`
    border-radius: 0;
    margin-top: 3px;
    margin-right: 2px;
    color: white;
`;

const StyledNext = styled(Next)`
    border-radius: 0;
    margin-top: 3px;

    color: white;
`;

const StyledButton = styled.button`
    position: absolute;

    background-color: ${navFarger.navBlaLighten20};

    margin-left: -12px;

    top: 200px;

    width: 24px;
    height: 24px;

    border-radius: 50%;

    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const StyledHøyremeny = styled.div`
    width: 100%;
`;

export enum Høyremenyvalg {
    Historikk = 'Historikk',
    Dokumenter = 'Dokumenter',
}

const Høyremeny: React.FC<IHøyremenyProps> = ({ åpenHøyremeny }) => {
    const [aktivtValg, settAktivtvalg] = useState<Høyremenyvalg>(Høyremenyvalg.Historikk);
    const { settÅpenHøyremeny, behandling } = useBehandling();

    useEffect(() => {
        if (
            //behandling.status === RessursStatus.SUKSESS &&
            erBehandlingUnderArbeid(behandlingMock)
        ) {
            settAktivtvalg(Høyremenyvalg.Historikk);
        }
    }, [behandling]);

    return (
        <>
            {åpenHøyremeny ? (
                <>
                    <StyledHøyremeny>
                        <StyledButton
                            onClick={() => {
                                settÅpenHøyremeny(!åpenHøyremeny);
                            }}
                        >
                            <StyledNext />
                        </StyledButton>
                        <Valgvisning aktiv={aktivtValg} settAktiv={settAktivtvalg} />
                        <Dokumenter hidden={aktivtValg !== Høyremenyvalg.Dokumenter} />
                        <Historikk
                            hidden={aktivtValg !== Høyremenyvalg.Historikk}
                            //behandlingId={behandlingId}
                        />
                    </StyledHøyremeny>
                </>
            ) : (
                <div>
                    <StyledButton
                        onClick={() => {
                            settÅpenHøyremeny(!åpenHøyremeny);
                        }}
                    >
                        <StyledBack />
                    </StyledButton>
                </div>
            )}
        </>
    );
};

export default Høyremeny;
