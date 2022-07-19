import * as React from 'react';
import { Heading, BodyLong } from '@navikt/ds-react';
import styled from 'styled-components';
import { Ikon } from './Ikon';

const FormkravOppsummeringStyled = styled.div`
    display: flex;
    margin: 2rem 4rem 2rem 4rem;
`;

const BegrunnelseStyled = styled.div`
    margin-left: 6rem;
`;

const OppfyltStyled = styled.div`
    display: flex;
`;

const FeilVedtaksresultatStyled = styled.div`
    display: flex;
    margin-top: 1rem;
`;

interface IFormkravOppsummering {
    oppfylt: number;
    muligOppfylt: number;
    begrunnelse: string;
    feilmelding: string;
}

export const FormkravOppsummering: React.FC<IFormkravOppsummering> = ({
    oppfylt,
    muligOppfylt,
    begrunnelse,
    feilmelding,
}) => {
    return (
        <FormkravOppsummeringStyled>
            <div>
                <Heading spacing size="medium" level="5">
                    Formkrav
                </Heading>
                {oppfylt < muligOppfylt || muligOppfylt == 0 ? (
                    <>
                        <BodyLong size="small">
                            {oppfylt} av {muligOppfylt} oppfylt
                        </BodyLong>
                        <FeilVedtaksresultatStyled>
                            <Ikon>
                                <path
                                    d="M11.999 0C5.395 0 .013 5.372 0 11.976a11.923 11.923 0 0 0 3.498 8.493A11.925 11.925 0 0 0 11.977 24H12c6.603 0 11.986-5.373 12-11.978C24.012 5.406 18.64.012 11.999 0Z"
                                    fill="#BA3A26"
                                />
                                <path
                                    d="m12 10.651 3.372-3.372a.954.954 0 1 1 1.349 1.35L13.349 12l3.372 3.372a.954.954 0 1 1-1.35 1.349L12 13.349 8.628 16.72a.954.954 0 1 1-1.349-1.35L10.651 12 7.28 8.628A.954.954 0 1 1 8.63 7.28L12 10.651Z"
                                    fill="#fff"
                                />
                            </Ikon>
                            <Heading size="xsmall" level="6">
                                {feilmelding}
                            </Heading>
                        </FeilVedtaksresultatStyled>
                    </>
                ) : (
                    <OppfyltStyled>
                        <BodyLong size="small">
                            {oppfylt} av {muligOppfylt} oppfylt
                        </BodyLong>
                        <Ikon>
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Z"
                                fill="#007C2E"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="m17.047 7.671 1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032Z"
                                fill="#fff"
                            />
                        </Ikon>
                    </OppfyltStyled>
                )}
            </div>
            <BegrunnelseStyled>
                <Heading spacing size="medium" level="5">
                    Begrunnelse
                </Heading>
                <BodyLong size="small">{begrunnelse}</BodyLong>
            </BegrunnelseStyled>
        </FormkravOppsummeringStyled>
    );
};
