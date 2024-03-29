import { Stønadstype } from './behandlingstema';
import { BehandlingStatus } from './behandlingstatus';
import { TilbakekrevingBehandlingsresultatstype } from './tilbakekreving';
import { BehandlingsÅrsak } from './behandlingsårsak';

export interface IFagsakPerson {
    id: string;
    overgangsstønad?: string;
    barnetilsyn?: string;
    skolepenger?: string;
}

export interface IFagsakPersonMedBehandlinger {
    id: string;
    overgangsstønad?: Fagsak;
    barnetilsyn?: Fagsak;
    skolepenger?: Fagsak;
}

export interface Fagsak {
    id: string;
    eksternId: number;
    fagsakPersonId: string;
    personIdent: string;
    stønadstype: Stønadstype;
    behandlinger: Behandling[];
    erLøpende: boolean;
    erMigrert: boolean;
}

export enum Fagsystem {
    EF = 'EF',
    BA = 'BA',
    KS = 'KS',
}

export enum StegType {
    FORMKRAV = 'FORMKRAV',
    VURDERING = 'VURDERING',
    BREV = 'BREV',
    SEND_TIL_BESLUTTER = 'SEND_TIL_BESLUTTER',
    VENTE_PÅ_SVAR_FRA_BESLUTTER = 'VENTE_PÅ_SVAR_FRA_BESLUTTER',
    BEHANDLING_FERDIGSTILT = 'BEHANDLING_FERDIGSTILT',
}

export const StegTypeListe: StegType[] = [
    StegType.FORMKRAV,
    StegType.VURDERING,
    StegType.BREV,
    StegType.SEND_TIL_BESLUTTER,
    StegType.VENTE_PÅ_SVAR_FRA_BESLUTTER,
    StegType.BEHANDLING_FERDIGSTILT,
];

export const behandlingStegTilTekst: Record<StegType, string> = {
    FORMKRAV: 'Formkrav',
    VURDERING: 'Vurdering',
    BREV: 'Brev',
    SEND_TIL_BESLUTTER: 'Sende til beslutter',
    VENTE_PÅ_SVAR_FRA_BESLUTTER: 'Vente på svar',
    BEHANDLING_FERDIGSTILT: 'Fullført',
};

export const behandlingStegFullførtTilTekst: Record<StegType, string> = {
    FORMKRAV: 'Formkrav er oppdatert',
    VURDERING: 'Vurdering er oppdatert',
    BREV: 'Brev er oppdatert',
    SEND_TIL_BESLUTTER: 'Klage er sendt til beslutter',
    VENTE_PÅ_SVAR_FRA_BESLUTTER: 'Venter på svar fra beslutter',
    BEHANDLING_FERDIGSTILT: 'Klagen er ferdigstilt',
};

export const behandlingStegInformasjonTilTekst: Record<StegType, string> = {
    FORMKRAV: 'Formkrav avgjør om klagen er gyldig eller ikke',
    VURDERING: 'Vurdering er saksbehandlers vurdering av klagen',
    BREV: 'Brev blir skrevet og gjort klart til sending',
    SEND_TIL_BESLUTTER: 'Klage er sendt til Kabal og lagret i JoArk',
    VENTE_PÅ_SVAR_FRA_BESLUTTER: 'Venter på vurdering fra Kabal',
    BEHANDLING_FERDIGSTILT: 'Behandling er ferdig og klageresultat er oppdatert',
};

export interface Behandling {
    id: string;
    fagsakId: string;
    personId: string;
    steg: StegType;
    status: BehandlingStatus;
    sistEndret: string;
    opprettet: string;
    resultat: BehandlingResultat;
    fagsystem: Fagsystem;
    vedtakDato?: string;
    stonadsType: Stønadstype;
    behandlingsArsak: BehandlingsÅrsak;
}

export interface IEndringerRegistergrunnlag {
    [key: string]: string[];
}

export enum BehandlingResultat {
    INNVILGET = 'INNVILGET',
    IKKE_SATT = 'IKKE_SATT',
    HENLAGT = 'HENLAGT',
    AVSLÅTT = 'AVSLÅTT',
    OPPHØRT = 'OPPHØRT',
}

export const behandlingResultatTilTekst: Record<BehandlingResultat, string> = {
    INNVILGET: 'Innvilget',
    IKKE_SATT: 'Ikke satt',
    HENLAGT: 'Henlagt',
    OPPHØRT: 'Opphørt',
    AVSLÅTT: 'Avslått',
};

export const tilbakekrevingBehandlingsresultattypeTilTekst: Record<
    TilbakekrevingBehandlingsresultatstype,
    string
> = {
    IKKE_FASTSATT: 'Ikke fastsatt',
    INGEN_TILBAKEBETALING: 'Ingen tilbakebetaling',
    DELVIS_TILBAKEBETALING: 'Delvis tilbakebetaling',
    FULL_TILBAKEBETALING: 'Full tilbakebetaling',
    HENLAGT: 'Henlagt',
};

export const BehandlingResultatInkludertTilbakekreving = {
    ...BehandlingResultat,
    ...TilbakekrevingBehandlingsresultatstype,
};

export const behandlingResultatInkludertTilbakekrevingTilTekst: Record<
    BehandlingResultat | TilbakekrevingBehandlingsresultatstype,
    string
> = { ...behandlingResultatTilTekst, ...tilbakekrevingBehandlingsresultattypeTilTekst };
