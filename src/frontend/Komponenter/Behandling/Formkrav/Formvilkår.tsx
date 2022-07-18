import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';
import { RadioknapperLesemodus } from './RadioKnapperLesemodus';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IForm, IFormvilkår, IRadioKnapper, VilkårStatus } from './utils';

const VilkårStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    margin: 0.5rem 1rem 1 rem 1rem;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
    margin: 0.5rem 1rem 1 rem 1rem;
`;

const FormKravStylingFooter = styled.div`
    width: 100%;
    display: flex;
    padding: 2% 0%;
`;

const RadioKnapperContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const RadioStyled = styled(Radio)``;

const RadioGroupStyled = styled(RadioGroup)`
    padding: 0.1rem 0;
    margin: 0.8rem 0;
    width: 100%;
`;

const ButtonStyled = styled(Button)`
    margin-bottom: 0.5rem;
`;

export const Formvilkår: React.FC<IFormvilkår> = ({
    behandlingId,
    vilkårOppfylt,
    settVilkårOppfylt,
    låst,
    settLåst,
}) => {
    const { vilkårTom, settVilkårTom } = useBehandling();
    const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
        useApp();

    const dateString = new Date().toISOString().split('T')[0];
    const formObjekt: IForm = {
        behandlingId: behandlingId,
        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
        vedtaksdato: dateString,
        klageMottatt: '',
        klageaarsak: '',
        klageBeskrivelse: '',
        klagePart: VilkårStatus.IKKE_SATT,
        klageKonkret: VilkårStatus.IKKE_SATT,
        klagefristOverholdt: VilkårStatus.IKKE_SATT,
        klageSignert: VilkårStatus.IKKE_SATT,
        saksbehandlerBegrunnelse: '',
        endretTid: dateString,
    };

    const [formData, settFormData] = useState<IForm>(formObjekt);
    const radioKnapperLeseListe: IRadioKnapper[] = [
        {
            spørsmål: 'Er klager part i saken?',
            svar: formData.klagePart,
            navn: 'klagePart',
        },
        {
            spørsmål: 'Klages det på konkrete elementer i vedtaket',
            svar: formData.klageKonkret,
            navn: 'klageKonkret',
        },
        {
            spørsmål: 'Er klagefristen overholdt?',
            svar: formData.klagefristOverholdt,
            navn: 'klagefristOverholdt',
        },
        {
            spørsmål: 'Er klagen signert?',
            svar: formData.klageSignert,
            navn: 'klageSignert',
        },
    ];

    useEffect(() => {
        if (låst) {
            axiosRequest<IForm, null>({
                method: 'GET',
                url: `/familie-klage/api/formkrav/vilkar/${behandlingId}`,
            }).then((res: Ressurs<IForm>) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settFormData((prevState) => ({
                        ...prevState,
                        fagsakId: res.data.fagsakId,
                        klagePart: res.data.klagePart,
                        klageKonkret: res.data.klageKonkret,
                        klagefristOverholdt: res.data.klagefristOverholdt,
                        klageSignert: res.data.klageSignert,
                        saksbehandlerBegrunnelse: res.data.saksbehandlerBegrunnelse,
                        endretTid: res.data.endretTid,
                    }));
                }
            });
        }
        if (vilkårTom) {
            settFormData((prevState) => ({
                ...prevState,
                klagePart: VilkårStatus.IKKE_SATT,
                klageKonkret: VilkårStatus.IKKE_SATT,
                klagefristOverholdt: VilkårStatus.IKKE_SATT,
                klageSignert: VilkårStatus.IKKE_SATT,
                saksbehandlerBegrunnelse: '',
            }));
            settVilkårTom(false);
            settVilkårOppfylt(false);
        }
    }, [låst, vilkårTom, axiosRequest, behandlingId, settVilkårTom, settVilkårOppfylt]);

    const alleFeltErBesvart = (): boolean => {
        return !(
            formData.saksbehandlerBegrunnelse === '' ||
            formData.klagePart === VilkårStatus.IKKE_SATT ||
            formData.klageKonkret === VilkårStatus.IKKE_SATT ||
            formData.klagefristOverholdt === VilkårStatus.IKKE_SATT ||
            formData.klageSignert === VilkårStatus.IKKE_SATT
        );
    };

    const opprettForm = () => {
        if (alleFeltErBesvart()) {
            settVilkårOppfylt(true);
        } else {
            settLåst(true);
        }

        axiosRequest<IForm, IForm>({
            method: 'POST',
            url: `/familie-klage/api/formkrav`,
            data: formData,
        }).then((res: Ressurs<IForm>) => {
            if (res.status === RessursStatus.SUKSESS) {
                nullstillIkkePersisterteKomponenter();
            }
        });
    };

    return (
        <VilkårStyling>
            {!vilkårOppfylt && !låst && (
                <>
                    <FormKravStylingBody>
                        <RadioKnapperContainer>
                            {radioKnapperLeseListe
                                .filter((item: IRadioKnapper) => item.spørsmål !== 'Begrunnelse')
                                .map((item: IRadioKnapper, index) => (
                                    <RadioGroupStyled
                                        legend={item.spørsmål}
                                        size="small"
                                        onChange={(val: VilkårStatus) => {
                                            settFormData((prevState) => ({
                                                ...prevState,
                                                [item.navn]: val,
                                            }));
                                            settIkkePersistertKomponent(val);
                                        }}
                                        value={item.svar}
                                        key={index}
                                    >
                                        <RadioStyled value={VilkårStatus.OPPFYLT}>Ja</RadioStyled>
                                        <RadioStyled value={VilkårStatus.IKKE_OPPFYLT}>
                                            Nei
                                        </RadioStyled>
                                    </RadioGroupStyled>
                                ))}
                        </RadioKnapperContainer>
                        <Textarea
                            label={undefined}
                            value={formData.saksbehandlerBegrunnelse}
                            onChange={(e) => {
                                settIkkePersistertKomponent(e.target.value);
                                settFormData((prevState) => ({
                                    ...prevState,
                                    saksbehandlerBegrunnelse: e.target.value,
                                }));
                            }}
                            size="small"
                            description="Vurdering"
                            maxLength={1500}
                        />
                    </FormKravStylingBody>
                    <FormKravStylingFooter>
                        <ButtonStyled variant="primary" size="medium" onClick={opprettForm}>
                            Lagre
                        </ButtonStyled>
                    </FormKravStylingFooter>
                </>
            )}
            {vilkårOppfylt && (
                <RadioknapperLesemodus
                    radioKnapper={radioKnapperLeseListe}
                    redigerHandling={settVilkårOppfylt}
                    saksbehandlerBegrunnelse={formData.saksbehandlerBegrunnelse}
                    endretTid={formData.endretTid}
                />
            )}
            {låst && (
                <RadioknapperLesemodus
                    radioKnapper={radioKnapperLeseListe}
                    redigerHandling={settLåst}
                    saksbehandlerBegrunnelse={formData.saksbehandlerBegrunnelse}
                    endretTid={formData.endretTid}
                />
            )}
        </VilkårStyling>
    );
};
