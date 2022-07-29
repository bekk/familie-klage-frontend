// Interface

import { kjønnType } from '@navikt/familie-typer';

export interface IPersonopplysninger {
    personIdent: string;
    navn: string;
    kjønn: kjønnType;
    telefonnummer?: string;
    adresse: string;
}

export interface INavn {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    visningsnavn: string;
}

export interface ITelefonnummer {
    landskode: string;
    nummer: string;
}
