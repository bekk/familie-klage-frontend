import { TilbakekrevingsbehandlingÅrsak } from './tilbakekreving';

export enum BehandlingsÅrsak {
    KLAGE = 'KLAGE',
    NYE_OPPLYSNINGER = 'NYE_OPPLYSNINGER',
    SANKSJON_1_MND = 'SANKSJON_1_MND',
    SØKNAD = 'SØKNAD',
    MIGRERING = 'MIGRERING',
    G_OMREGNING = 'G_OMREGNING',
    KORRIGERING_UTEN_BREV = 'KORRIGERING_UTEN_BREV',
    PAPIRSØKNAD = 'PAPIRSØKNAD',
}

export const behandlingsårsakTilTekst: Record<BehandlingsÅrsak, string> = {
    KLAGE: 'Klage',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    SANKSJON_1_MND: 'Sanksjon 1 måned',
    SØKNAD: 'Søknad',
    MIGRERING: 'Migrering',
    G_OMREGNING: 'G-omregning',
    KORRIGERING_UTEN_BREV: 'Korrigering uten brev',
    PAPIRSØKNAD: 'Papirsøknad',
};

export const behandlingsårsaker: BehandlingsÅrsak[] = [
    BehandlingsÅrsak.KLAGE,
    BehandlingsÅrsak.NYE_OPPLYSNINGER,
    BehandlingsÅrsak.SANKSJON_1_MND,
    BehandlingsÅrsak.SØKNAD,
    BehandlingsÅrsak.G_OMREGNING,
    BehandlingsÅrsak.KORRIGERING_UTEN_BREV,
];

export const behandlingOgTilbakekrevingsårsakTilTekst: Record<
    BehandlingsÅrsak | TilbakekrevingsbehandlingÅrsak,
    string
> = {
    KLAGE: 'Klage',
    NYE_OPPLYSNINGER: 'Nye opplysninger',
    SANKSJON_1_MND: 'Sanksjon 1 måned',
    SØKNAD: 'Søknad',
    MIGRERING: 'Migrering',
    G_OMREGNING: 'G-omregning',
    KORRIGERING_UTEN_BREV: 'Korrigering uten brev',
    PAPIRSØKNAD: 'Papirsøknad',
    /** De neste er revurderingsårsaker for tilbakekrevingsbehandlinger **/
    REVURDERING_KLAGE_NFP: 'Klage tilbakekreving',
    REVURDERING_KLAGE_KA: 'Klage omgjort av KA',
    REVURDERING_OPPLYSNINGER_OM_VILKÅR: 'Nye opplysninger',
    REVURDERING_OPPLYSNINGER_OM_FORELDELSE: 'Nye opplysninger',
    REVURDERING_FEILUTBETALT_BELØP_HELT_ELLER_DELVIS_BORTFALT:
        'Feilutbetalt beløp helt eller delvis bortfalt',
};
