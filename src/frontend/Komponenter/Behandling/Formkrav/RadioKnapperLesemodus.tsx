/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import SlettSøppelkasse from '../../../Felles/Ikoner/SlettSøppelkasse';
import RedigerBlyant from '../../../Felles/Ikoner/RedigerBlyant';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';
import navFarger from 'nav-frontend-core';
import BrukerMedBlyant from '../../../Felles/Ikoner/BrukerMedBlyant';
import {
    VilkårStatus,
    vilkårStatusTilTekst,
    IForm,
    IRadioKnapperLeseModus,
    IRadioKnapper,
    IVilkårNullstill,
} from './utils';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useApp } from '../../../App/context/AppContext';
import { Heading } from '@navikt/ds-react';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';

export const RadSentrertVertikalt = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const FormKravStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 0 3rem 0 0;
    margin-top: 2%;
`;

const VilkårHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
    border-left: 0.4rem solid ${navFarger.navLillaLighten20};
    padding-left: 2rem;
`;

const SvarElement = styled.ul`
    padding: 0;
    font-size: 1rem;
    list-style-type: none;
`;

const Spørsmål = styled.li`
    padding: 0rem 0;
    width: 40%;
    font-weight: bold;
`;

const Svar = styled.li`
    padding: 0.5rem 0;
    width: 40%;
`;

const VilkårIkon = styled.div`
    margin: 0 1.5rem 0 -0.7rem;
`;

const BrukerMedBlyantStyled = styled(BrukerMedBlyant)`
    overflow: visible;
`;

export const RadioknapperLesemodus: React.FC<IRadioKnapperLeseModus> = ({
    radioKnapper,
    redigerHandling,
    saksbehandlerBegrunnelse,
    endretTid,
}) => {
    const { settFormkravLåst, settVilkårTom } = useBehandling();
    const { axiosRequest } = useApp();
    const slettHandling = () => {
        const f: IVilkårNullstill = {
            behandlingId: hentBehandlingIdFraUrl(),
            klagePart: VilkårStatus.IKKE_SATT,
            klageKonkret: VilkårStatus.IKKE_SATT,
            klagefristOverholdt: VilkårStatus.IKKE_SATT,
            klageSignert: VilkårStatus.IKKE_SATT,
            saksbehandlerBegrunnelse: '',
        };

        axiosRequest<IForm, IVilkårNullstill>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: f,
        });
        settVilkårTom(true);
        settFormkravLåst(false);
    };
    return (
        <FormKravStyling>
            <VilkårHeader>
                <RadSentrertVertikalt>
                    <VilkårIkon>
                        <BrukerMedBlyantStyled heigth={23} width={23} />
                    </VilkårIkon>
                    <Heading spacing size={'medium'}>
                        Vilkår oppfylt
                    </Heading>
                </RadSentrertVertikalt>
                <div>
                    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                    <LenkeKnapp onClick={() => redigerHandling(false)}>
                        <RedigerBlyant withDefaultStroke={false} width={19} heigth={19} />
                        <span>Rediger</span>
                    </LenkeKnapp>
                    {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                    <LenkeKnapp onClick={() => slettHandling()}>
                        <SlettSøppelkasse withDefaultStroke={false} width={19} heigth={19} />
                        <span>Slett</span>
                    </LenkeKnapp>
                </div>
            </VilkårHeader>
            <FormKravStylingBody>
                Sist endret - {formaterIsoDatoTid(endretTid)}
                {radioKnapper.map((item: IRadioKnapper, index) => (
                    <SvarElement key={index}>
                        <Spørsmål>{item.spørsmål}</Spørsmål>
                        <Svar>{vilkårStatusTilTekst[item.svar]}</Svar>
                    </SvarElement>
                ))}
                <SvarElement>
                    <Spørsmål>Begrunnelse</Spørsmål>
                    <Svar>{saksbehandlerBegrunnelse}</Svar>
                </SvarElement>
            </FormKravStylingBody>
        </FormKravStyling>
    );
};
