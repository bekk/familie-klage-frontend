import React, { FC } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import { Behandling } from '../../App/typer/fagsak';
import navFarger from 'nav-frontend-core';
import { Sticky } from '../Visningskomponenter/Sticky';
import { Hamburgermeny } from './Hamburgermeny';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import { AlleStatuser, StatuserLitenSkjerm, StatusMeny } from './Status/StatusElementer';

const Visningsnavn = styled(Element)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

export const VisittkortWrapper = styled(Sticky)`
    display: flex;

    border-bottom: 1px solid ${navFarger.navGra80};
    z-index: 22;
    top: 47px;

    .visittkort {
        padding: 0 1.5rem;
        border-bottom: none;
    }
`;

const StyledHamburgermeny = styled(Hamburgermeny)`
    margin-left: auto;
    display: block;
    position: sticky;

    z-index: 9999;
`;

const VisittkortComponent: FC<{
    personopplysninger: IPersonopplysninger;
    behandling: Behandling;
}> = ({ personopplysninger, behandling }) => {
    const { personIdent, kjønn, navn } = personopplysninger;
    return (
        <VisittkortWrapper>
            <Visittkort
                alder={20}
                ident={personIdent}
                kjønn={kjønn}
                navn={<Visningsnavn>{navn}</Visningsnavn>}
            ></Visittkort>

            {behandling && (
                <>
                    <AlleStatuser behandling={behandling} />
                    <StatuserLitenSkjerm>
                        <StatusMeny behandling={behandling} />
                    </StatuserLitenSkjerm>
                </>
            )}
            {behandling && erBehandlingRedigerbar(behandling) && <StyledHamburgermeny />}
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
