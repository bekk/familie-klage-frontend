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

export enum BehandlingSteg {
    FORMALKRAV = 'FORMALKRAV',
    VURDERING = 'VURDERING',
    KABAL = 'KABAL',
    BEHANDLING_FERDIGSTILT = 'BEHANDLING_FERDIGSTILT',
}

export const behandlingStegTilTekst: Record<BehandlingSteg, string> = {
    FORMALKRAV: 'Formalkrav',
    VURDERING: 'Vurdering',
    KABAL: 'Kabal',
    BEHANDLING_FERDIGSTILT: 'Behandling ferdigstilt',
};

export interface Behandling {
    id: string;
    fagsakId: string;
    personId: string;
    steg: BehandlingSteg;
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
