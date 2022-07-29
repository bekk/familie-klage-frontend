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
import { IFormVilkår, VilkårStatus } from '../Formkrav/utils';
import { hentBehandlingIdFraUrl } from '../BehandlingContainer';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';

const VurderingBeskrivelseStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const AlertStyled = styled(Alert)`
    margin: 2rem 4rem 2rem 4rem;
    width: 18rem;
`;

const VurderingKnapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 4rem;
`;

export const Vurdering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    // Formkravoppsummering
    const [oppfylt, settOppfylt] = useState(0);
    const [muligOppfylt, settMuligOppfylt] = useState(0);
    const [begrunnelse, settBegrunnelse] = useState('');
    const [formkravGodkjent, settForkravGodkjent] = useState(false);
    const [feilmelding, settFeilmelding] = useState('Dette er en feilmelding'); // TODO legge til enum-objekter som sier om det er begrunnelse eller vurdering som mangler
    const navigate = useNavigate();
    const { settVurderingSideGyldig, settBrevSteg, settResultatSteg } = useBehandling();

    const { vurderingData, settVurderingData, vurderingEndret, settVurderingEndret } =
        useBehandling();

    // Endringer
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    // Hent data fra formkrav
    useEffect(() => {
        axiosRequest<IFormVilkår, null>({
            method: 'GET',
            url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
        }).then((res: Ressurs<IFormVilkår>) => {
            if (res.status === RessursStatus.SUKSESS) {
                if (res.data.saksbehandlerBegrunnelse.length !== 0)
                    settBegrunnelse(res.data.saksbehandlerBegrunnelse);

                const vilkårListe = [
                    res.data.klagePart,
                    res.data.klageKonkret,
                    res.data.klagefristOverholdt,
                    res.data.klageSignert,
                ];
                settOppfylt(vilkårListe.filter((item: VilkårStatus) => item === 'OPPFYLT').length);
                settMuligOppfylt(vilkårListe.length);
            }
        });
    }, [axiosRequest, behandlingId]);

    // Hent eksisterende vurderingsdata
    useEffect(() => {
        axiosRequest<IVurdering, null>({
            method: 'GET',
            url: `/familie-klage/api/vurdering/${behandlingId}`,
        }).then((res: Ressurs<IVurdering>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settVurderingData({
                    behandlingId: res.data.behandlingId,
                    vedtak: res.data.vedtak,
                    arsak: res.data.arsak,
                    hjemmel: res.data.hjemmel,
                    beskrivelse: res.data.beskrivelse,
                });
            }
        });
    }, [axiosRequest, behandlingId, settVurderingData]);

    useEffect(() => {
        if (oppfylt < muligOppfylt || muligOppfylt == 0) {
            settForkravGodkjent(false);
            settFeilmelding('Formkrav er ikke oppfylt.');
        } else if (begrunnelse.length === 0) {
            settForkravGodkjent(false);
            settFeilmelding('Formkrav mangler en begrunnelse.');
        } else {
            settForkravGodkjent(true);
            settFeilmelding('Det har skjedd en feil');
        }
    }, [oppfylt, muligOppfylt, begrunnelse.length]);

    const [senderInn, settSenderInn] = useState<boolean>(false);

    const vent = () => {
        return new Promise((resolve) => setTimeout(resolve, 3000));
    };

    const opprettVurdering = () => {
        if (senderInn) {
            return;
        }

        settSenderInn(true);
        vent().then(() =>
            // for å demonstrere at man må vente til post-kall er ferdig
            axiosRequest<IVurdering, IVurdering>({
                method: 'POST',
                url: `/familie-klage/api/vurdering`,
                data: vurderingData,
            }).then((res: Ressurs<IVurdering>) => {
                if (res.status === RessursStatus.SUKSESS) {
                    nullstillIkkePersisterteKomponenter();
                    settVurderingSideGyldig(true);
                    settBrevSteg(true);
                }
                settSenderInn(false);
                settVurderingEndret(false);
            })
        );
    };

    return (
        <div>
            <FormkravOppsummering
                oppfylt={oppfylt}
                muligOppfylt={muligOppfylt}
                begrunnelse={begrunnelse}
                feilmelding={feilmelding}
                formkravGodkjent={formkravGodkjent}
            />
            {formkravGodkjent ? (
                <>
                    <Vedtak
                        settVedtak={settVurderingData}
                        vedtakValgt={vurderingData.vedtak}
                        vedtakValgmuligheter={vedtakValgTilTekst}
                        endring={settIkkePersistertKomponent}
                    />
                    {vurderingData.vedtak == VedtakValg.OMGJØR_VEDTAK &&
                    vurderingData.arsak !== undefined ? (
                        <Årsak
                            settÅrsak={settVurderingData}
                            årsakValgt={vurderingData.arsak}
                            årsakValgmuligheter={årsakValgTilTekst}
                            endring={settIkkePersistertKomponent}
                        />
                    ) : (
                        ''
                    )}
                    {vurderingData.vedtak == VedtakValg.OPPRETTHOLD_VEDTAK &&
                    vurderingData.hjemmel !== undefined ? (
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
                                    settBrevSteg(false);
                                    settResultatSteg(false);
                                    settIkkePersistertKomponent(e.target.value);
                                    settVurderingData((tidligereTilstand) => ({
                                        ...tidligereTilstand,
                                        beskrivelse: e.target.value,
                                    }));
                                    settVurderingEndret(true);
                                }}
                                size="medium"
                            />
                        </VurderingBeskrivelseStyled>
                    ) : (
                        ''
                    )}
                    <VurderingKnapper>
                        {vurderingEndret && (
                            <Button
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
                                Lagre vurdering
                            </Button>
                        )}
                        {!vurderingEndret && (
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() =>
                                    navigate(`/behandling/${hentBehandlingIdFraUrl()}/brev`)
                                }
                            >
                                Fortsett
                            </Button>
                        )}
                    </VurderingKnapper>
                    {!vurderingEndret ? (
                        <AlertStyled variant="success" size="medium">
                            Du har lagret vurderingen.
                        </AlertStyled>
                    ) : (
                        ''
                    )}
                </>
            ) : (
                ''
            )}
        </div>
    );
};
