// React
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';

// CSS
import styled from 'styled-components';

// Komponenter
import { Alert, Button, Textarea } from '@navikt/ds-react';
import { FormkravOppsummering } from './FormkravOppsummering';
import { Vedtak } from './Vedtak';
import { Årsak } from './Årsak';
import { Hjemmel } from './Hjemmel';
import {
    HjemmelValg,
    hjemmelValgTilTekst,
    IVurdering,
    VedtakValg,
    vedtakValgTilTekst,
    ÅrsakValg,
    årsakValgTilTekst,
} from './vurderingValg';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { IForm } from '../Formkrav/utils';
import { VilkårStatus } from '../Formkrav/utils';

const VurderingBeskrivelseStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const AlertStyled = styled(Alert)`
    margin: 2rem 4rem 2rem 4rem;
`;

const VurderingKnappStyled = styled(Button)`
    margin: 0 4rem 2rem 4rem;
`;

export const Vurdering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    // Formkravoppsummering
    const [oppfylt, settOppfylt] = useState(0);
    const [muligOppfylt, settMuligOppfylt] = useState(0);
    const [begrunnelse, settBegrunnelse] = useState('');
    const [feilmelding, settFeilmelding] = useState('Dette er en feilmelding'); // TODO legge til enum-objekter som sier om det er begrunnelse eller vurdering som mangler

    const vurderingObject: IVurdering = {
        behandlingId: behandlingId,
        vedtak: VedtakValg.VELG,
        arsak: ÅrsakValg.VELG,
        hjemmel: HjemmelValg.VELG,
        beskrivelse: '',
    };

    const [vurderingData, settVurderingData] = useState<IVurdering>(vurderingObject);

    // Resultat
    const [resultat, settResultat] = useState(false);

    // Endringer
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    // Hent eksisterende vurderingsdata

    useEffect(() => {
        axiosRequest<IVurdering, string>({
            method: 'GET',
            url: `/familie-klage/api/vurdering/${behandlingId}`,
        }).then((res: Ressurs<IVurdering>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVurderingData({
                    behandlingId: behandlingId,
                    vedtak: res.data.vedtak,
                    arsak: res.data.arsak,
                    hjemmel: res.data.hjemmel,
                    beskrivelse: res.data.beskrivelse,
                });
            }
        });
    }, [axiosRequest, behandlingId]);

    // Hent data fra formkrav
    useEffect(() => {
        axiosRequest<IForm, string>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
        }).then((res: Ressurs<IForm>) => {
            if (res.status === RessursStatus.SUKSESS) {
                const vilkårListe = [
                    res.data.klagePart,
                    res.data.klageKonkret,
                    res.data.klagefristOverholdt,
                    res.data.klageSignert,
                ];
                settOppfylt(vilkårListe.filter((item: VilkårStatus) => item === 'OPPFYLT').length);
                settMuligOppfylt(vilkårListe.length);
                settBegrunnelse(res.data.saksbehandlerBegrunnelse);
            } else {
                settOppfylt(0);
                settMuligOppfylt(0);
            }
        });
    }, [axiosRequest, behandlingId]);

    const opprettVurdering = () => {
        const v: IVurdering = {
            behandlingId: behandlingId,
            vedtak: vurderingData.vedtak,
            beskrivelse: vurderingData.beskrivelse,
        };

        if (vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK) {
            v.arsak = vurderingData.arsak;
        } else {
            v.hjemmel = vurderingData.hjemmel;
        }

        axiosRequest<IVurdering, IVurdering>({
            method: 'POST',
            url: `/familie-klage/api/vurdering`,
            data: v,
        }).then((res: Ressurs<IVurdering>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settResultat(true);
                nullstillIkkePersisterteKomponenter();
            }
        });
    };

    return (
        <div>
            <FormkravOppsummering
                oppfylt={oppfylt}
                muligOppfylt={muligOppfylt}
                begrunnelse={begrunnelse}
                feilmelding={feilmelding}
            />
            {oppfylt < muligOppfylt ? (
                ''
            ) : (
                <>
                    <Vedtak
                        settVedtak={settVurderingData}
                        vedtakValgmuligheter={vedtakValgTilTekst}
                        vedtakValgt={vurderingData.vedtak}
                        endring={settIkkePersistertKomponent}
                    />
                    {vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK ? (
                        <Årsak
                            settÅrsak={settVurderingData}
                            årsakValgt={vurderingData.arsak}
                            årsakValgmuligheter={årsakValgTilTekst}
                            endring={settIkkePersistertKomponent}
                        />
                    ) : (
                        ''
                    )}
                    {vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ? (
                        <Hjemmel
                            settHjemmel={settVurderingData}
                            hjemmelValgt={vurderingData.hjemmel}
                            hjemmelValgmuligheter={hjemmelValgTilTekst}
                            endring={settIkkePersistertKomponent}
                        />
                    ) : (
                        ''
                    )}
                    {vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ||
                    vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK ? (
                        <VurderingBeskrivelseStyled>
                            <Textarea
                                label="Vurdering"
                                value={vurderingData.beskrivelse}
                                onChange={(e) => {
                                    settIkkePersistertKomponent(e.target.value);
                                    settVurderingData((tidligereTilstand) => ({
                                        ...tidligereTilstand,
                                        beskrivelse: e.target.value,
                                    }));
                                }}
                                size="medium"
                            />
                        </VurderingBeskrivelseStyled>
                    ) : (
                        ''
                    )}
                    {resultat ? (
                        <AlertStyled variant="success" size="medium" inline>
                            Du har lagret vurderingen.
                        </AlertStyled>
                    ) : (
                        ''
                    )}

                    <VurderingKnappStyled
                        variant="primary"
                        size="medium"
                        onClick={() => {
                            opprettVurdering();
                        }}
                        disabled={
                            !(
                                vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK ||
                                vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK
                            ) ||
                            vurderingData.beskrivelse.length == 0 ||
                            (vurderingData.arsak == ÅrsakValg.VELG &&
                                vurderingData.hjemmel == HjemmelValg.VELG)
                        }
                    >
                        Large vurdering
                    </VurderingKnappStyled>
                </>
            )}
        </div>
    );
};
