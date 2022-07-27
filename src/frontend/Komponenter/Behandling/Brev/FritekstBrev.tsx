import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';

import DataViewer from '../../../Felles/DataViewer/DataViewer';
import BrevInnhold from './BrevInnhold';
import { stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import styled from 'styled-components';
import {
    AvsnittMedId,
    BrevtyperTilAvsnitt,
    BrevtyperTilOverskrift,
    FritekstBrevtype,
    FrittståendeBrevtype,
    IFritekstBrev,
} from './BrevTyper';
import {
    flyttAvsnittNedover,
    flyttAvsnittOppover,
    initielleAvsnittMellomlager,
    leggAvsnittBakSisteSynligeAvsnitt,
    leggTilAvsnittFørst,
    skjulAvsnittIBrevbygger,
} from './BrevUtils';
import { useApp } from '../../../App/context/AppContext';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { AxiosRequestConfig } from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import { VedtakValg } from '../Vurdering/vurderingValg';

const StyledBrev = styled.div`
    margin-bottom: 1rem;
    width: inherit;
`;

export interface Props {
    oppdaterBrevressurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
    mellomlagretFritekstbrev?: IFritekstBrev;
}

const FritekstBrev: React.FC<Props> = ({
    behandlingId,
    mellomlagretFritekstbrev,
    oppdaterBrevressurs,
}) => {
    const { behandling, settResultatSteg } = useBehandling();
    const { axiosRequest } = useApp();

    const personopplysningerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-klage/api/personopplysninger/${behandlingId}`,
        }),
        [behandlingId]
    );

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);

    const [brevType, settBrevType] = useState<FritekstBrevtype | undefined>(
        mellomlagretFritekstbrev?.brevType
    );
    const [overskrift, settOverskrift] = useState(
        (mellomlagretFritekstbrev && mellomlagretFritekstbrev?.overskrift) || ''
    );
    const [avsnitt, settAvsnitt] = useState<AvsnittMedId[]>(
        initielleAvsnittMellomlager(mellomlagretFritekstbrev)
    );

    const endreBrevType = (nyBrevType: FrittståendeBrevtype | FritekstBrevtype) => {
        settBrevType(nyBrevType as FritekstBrevtype);
    };

    const endreOverskrift = (nyOverskrift: string) => {
        settResultatSteg(false);
        settOverskrift(nyOverskrift);
    };

    const endreAvsnitt = (nyttAvsnitt: AvsnittMedId[]) => {
        settResultatSteg(false);
        settAvsnitt(nyttAvsnitt);
    };

    const oppdaterFlyttAvsnittOppover = (avsnittId: string) => {
        settResultatSteg(false);
        settAvsnitt(flyttAvsnittOppover(avsnittId, avsnitt));
    };

    const oppdaterFlyttAvsnittNedover = (avsnittId: string) => {
        settResultatSteg(false);
        settAvsnitt(flyttAvsnittNedover(avsnittId, avsnitt));
    };

    const oppdaterLeggTilAvsnittFørst = () => {
        settResultatSteg(false);
        settAvsnitt(leggTilAvsnittFørst(avsnitt));
    };

    const oppdaterLeggAvsnittBakSisteSynligeAvsnitt = () => {
        settResultatSteg(false);
        settAvsnitt(leggAvsnittBakSisteSynligeAvsnitt(avsnitt));
    };

    const endreDeloverskriftAvsnitt = (radId: string, e: ChangeEvent<HTMLInputElement>) => {
        settResultatSteg(false);
        const oppdaterteAvsnitt = avsnitt.map((rad) => {
            return rad.avsnittId === radId ? { ...rad, deloverskrift: e.target.value } : rad;
        });
        settAvsnitt(oppdaterteAvsnitt);
        return oppdaterteAvsnitt;
    };

    const endreInnholdAvsnitt = (radId: string, e: ChangeEvent<HTMLTextAreaElement>) => {
        settResultatSteg(false);
        const oppdaterteAvsnitt = avsnitt.map((rad) => {
            return rad.avsnittId === radId ? { ...rad, innhold: e.target.value } : rad;
        });
        settAvsnitt(oppdaterteAvsnitt);
        return oppdaterteAvsnitt;
    };

    const fjernRad = (radId: string) => {
        settResultatSteg(false);
        settAvsnitt((eksisterendeAvsnitt: AvsnittMedId[]) => {
            return eksisterendeAvsnitt.filter((rad) => radId !== rad.avsnittId);
        });
    };

    const genererBrev = () => {
        if (personopplysninger.status !== RessursStatus.SUKSESS) return;
        if (!brevType) return;

        const brev: IFritekstBrev = {
            overskrift: overskrift,
            avsnitt: avsnitt,
            behandlingId: behandlingId,
            brevType: brevType,
        };

        axiosRequest<string, IFritekstBrev>({
            method: 'POST',
            url: `/familie-klage/api/brev/`,
            data: brev,
        }).then((respons: Ressurs<string>) => {
            if (oppdaterBrevressurs) oppdaterBrevressurs(respons);
        });
    };

    useEffect(() => {
        axiosRequest<VedtakValg, null>({
            method: 'GET',
            url: `/familie-klage/api/vurdering/${behandlingId}/vedtak`,
        }).then((res: Ressurs<VedtakValg>) => {
            let type: FritekstBrevtype = FritekstBrevtype.VEDTAK_AVSLAG;
            if (res.status === RessursStatus.SUKSESS) {
                const vedtak: VedtakValg = res.data;
                if (vedtak === VedtakValg.OMGJØR_VEDTAK) {
                    type = FritekstBrevtype.VEDTAK_INVILGELSE;
                }
            }
            endreBrevType(type);
            settOverskiftOgAvsnitt(type);
        });
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        if (mellomlagretFritekstbrev) {
            settOverskrift(mellomlagretFritekstbrev.overskrift);
            settAvsnitt(mellomlagretFritekstbrev.avsnitt);
        }
    }, [mellomlagretFritekstbrev]);

    const utsattGenererBrev = useDebouncedCallback(genererBrev, 1000);
    useEffect(utsattGenererBrev, [utsattGenererBrev, avsnitt, overskrift]);

    const settOverskiftOgAvsnitt = (brevType?: FritekstBrevtype) => {
        settOverskrift(brevType ? BrevtyperTilOverskrift[brevType] : '');
        settAvsnitt(brevType ? skjulAvsnittIBrevbygger(BrevtyperTilAvsnitt[brevType]) : []);
    };

    return (
        <DataViewer response={{ behandling }} key={behandlingId}>
            {({ behandling }) => (
                <StyledBrev>
                    <h1>Fritekstbrev for {stønadstypeTilTekst[behandling.stonadsType]}</h1>
                    <BrevInnhold
                        brevType={brevType}
                        overskrift={overskrift}
                        endreOverskrift={endreOverskrift}
                        avsnitt={avsnitt}
                        endreAvsnitt={endreAvsnitt}
                        endreDeloverskriftAvsnitt={endreDeloverskriftAvsnitt}
                        endreInnholdAvsnitt={endreInnholdAvsnitt}
                        fjernRad={fjernRad}
                        leggTilAvsnittFørst={oppdaterLeggTilAvsnittFørst}
                        leggAvsnittBakSisteSynligeAvsnitt={
                            oppdaterLeggAvsnittBakSisteSynligeAvsnitt
                        }
                        flyttAvsnittOpp={oppdaterFlyttAvsnittOppover}
                        flyttAvsnittNed={oppdaterFlyttAvsnittNedover}
                    />
                </StyledBrev>
            )}
        </DataViewer>
    );
};

export default FritekstBrev;
