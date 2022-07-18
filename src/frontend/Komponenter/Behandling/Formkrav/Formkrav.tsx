import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Formvilkår } from './Formvilkår';
import { Klageinfo } from './Klageinfo';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IForm, VilkårStatus } from './utils';

const FormKravStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 2rem 5rem 0 5rem;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
`;

export const Formkrav: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [vilkårOppfylt, settVilkårOppfylt] = useState(false);
    const { axiosRequest } = useApp();

    const formObjekt: IForm = {
        behandlingId: behandlingId,
        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
        vedtaksdato: '',
        klageMottatt: '',
        klageaarsak: '',
        klageBeskrivelse: '',
        klagePart: VilkårStatus.IKKE_SATT,
        klageKonkret: VilkårStatus.IKKE_SATT,
        klagefristOverholdt: VilkårStatus.IKKE_SATT,
        klageSignert: VilkårStatus.IKKE_SATT,
        saksbehandlerBegrunnelse: '',
        endretTid: '',
    };

    const [formkrav, settFormkrav] = useState<IForm>(formObjekt);
    const { formkravLåst, settFormkravLåst } = useBehandling();

    useEffect(() => {
        document.title = 'Oppgavebenk';
        axiosRequest<IForm, null>({
            method: 'GET',
            url: `/familie-klage/api/klageinfo/${behandlingId}`,
        }).then((res: Ressurs<IForm>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settFormkrav((prevState) => ({
                    ...prevState,
                    fagsakId: res.data.fagsakId,
                    klageMottatt: res.data.klageMottatt,
                    klageaarsak: res.data.klageaarsak,
                    klageBeskrivelse: res.data.klageBeskrivelse,
                    saksbehandlerBegrunnelse: res.data.saksbehandlerBegrunnelse,
                    vedtaksdato: res.data.vedtaksdato,
                }));
            }
        });
    }, [axiosRequest, behandlingId]);

    return (
        <FormKravStyling>
            <FormKravStylingBody>
                {formkrav !== undefined && (
                    <Klageinfo
                        vilkårOppfylt={vilkårOppfylt}
                        formkrav={formkrav}
                        låst={formkravLåst}
                    />
                )}
                <Formvilkår
                    behandlingId={behandlingId}
                    vilkårOppfylt={vilkårOppfylt}
                    settVilkårOppfylt={settVilkårOppfylt}
                    låst={formkravLåst}
                    settLåst={settFormkravLåst}
                />
            </FormKravStylingBody>
        </FormKravStyling>
    );
};
