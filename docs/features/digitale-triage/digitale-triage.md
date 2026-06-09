---
sidebar_position: 1
---
# Digitale triage

## Functional summary
The Spreekuur.nl Digitale Triage functionality lets other patient portals integrate the triage functionality of Spreekuur.nl
in their own portal. This flow uses an i-frame to embed the triage functionality in the patient portal. The i-frame 
ensures that the MDR (Medical Device Regulation) requirements are met by Spreekuur.nl.

Communication between the Spreekuur.nl Digitale Triage and the patient portal uses the `postMessage` API of the browser.
See the MDN documentation for more information: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage.

## Starting an e-consult with triage
To start an Digitale Triage, the flow is as follows:
```mermaid
sequenceDiagram
    autonumber
    actor P as Patient
    participant shell as Shell
    participant SU as Spreekuur.nl

    P->>shell: Start Digitale Triage
    shell->>SU: Open Spreekuur.nl Digitale Triage i-frame
    SU->>SU: Start questionnaire
    P->>SU: Answer questionnaire questions
    alt urgency = U1 or U2
        SU->>P: Show triage out
        P->>SU: Acknowledge triage out
        SU->>shell: triageOut(Encounter)
    else urgency = U3 tm U5 or no urgency
        SU-->>shell: triageCompleted(FHIR Bundle)
    end
    shell->>P: Start follow-up action
```
1. The patient starts the Digitale Triage in a third party patient portal.
2. Spreekuur.nl Digitale Triage is opened in an i-frame in the patient portal.
3. Spreekuur.nl Digitale Triage starts the triage questionnaire.
4. The patient fills in the triage questionnaire.
5. If the urgency is high (U1 or U2), a triage out message* is shown to the patient. After the patient
   acknowledges the message, a `triageOut` postMessage is sent to the patient portal containing a FHIR
   `Encounter` resource with the urgency in `priority`. No full FHIR Bundle is sent on this path, because the
   patient is being routed to emergency follow-up.
6. If the urgency is U3, U4, U5 or no urgency, a `triageCompleted` postMessage is sent to the patient portal
   containing a FHIR Bundle. The Bundle contains the `Encounter`, `Observation[S-line]`,
   `Observation[survey scores]`, and `QuestionnaireResponse` resources describing the consultation.
7. The patient portal starts the follow-up action based on the received urgency.

*The triage out message advises the patient to contact the practice by the emergency phone number.

## Embedding the i-frame
The Spreekuur.nl Digitale Triage is delivered as a single-page web application that is intended to be embedded
as an i-frame inside the patient portal. The URL of the i-frame is provided by Topicus.Healthcare per environment
(test, acceptance, production).

A minimal embedding looks like this:

```html
<iframe
    src="https://<digitale-triage-url>/"
    title="Spreekuur.nl Digitale Triage"
></iframe>

<script>
    window.addEventListener('message', (event) => {
        // Restrict to the Spreekuur.nl Digitale Triage origin
        if (event.origin !== 'https://<digitale-triage-url>') {
            return;
        }
        const { key, data } = event.data ?? {};
        // Handle key === 'triageCompleted' | 'triageOut' | 'userEvent'
    });
</script>
```

The i-frame does not require any query parameters, hash fragments, or initialization messages.
The patient starts the triage from within the i-frame itself.

### Origin validation
The Spreekuur.nl Digitale Triage currently sends messages with `targetOrigin: '*'`. The patient portal **must**
validate `event.origin` against the configured Digitale Triage URL on every incoming message before acting on the
payload, and should also restrict the embedding via a Content Security Policy (`frame-src`) and the i-frame
`sandbox` attribute as appropriate.

## postMessage messages
All messages from the Spreekuur.nl Digitale Triage to the patient portal share the same envelope:

```ts
interface PostMessage {
    key: 'triageCompleted' | 'triageOut' | 'userEvent';
    data: unknown;
}
```

The `key` discriminator identifies the message type. The shape of `data` depends on the key.

### `triageCompleted`
Sent when the patient has completed the triage questionnaire and the resulting urgency is **U3, U4, U5, or no
urgency**. The `data` field contains a FHIR Bundle describing the consultation:

- `resourceType: "Bundle"` with `type: "collection"` and `entry[]` containing:
    - `Encounter` — the consultation envelope. Contains `priority` with the urgency coding (`U3` / `U4` / `U5`)
      and `reasonCode` with the patient's complaint (*klachtgebied*).
    - `Observation` (LOINC `61146-7`, *Subjective journal line*) — the SOEP "S" line. The standard S-line text
      is in `valueString`; if a Smart S-Rule is available it is added as a `Smart-S-Rule` extension.
    - `Observation` (survey scores) — one or more survey-category Observations with triage scoring results,
      including the triage criterion and complaint selection.
    - `QuestionnaireResponse` — the answers given during the triage, including extensions for S-Rule,
      Categorie, and Artsteksten metadata per item.

Example:

```json
{
    "key": "triageCompleted",
    "data": {
        "resourceType": "Bundle",
        "type": "collection",
        "entry": [
            {
                "resource": {
                    "resourceType": "Encounter",
                    "id": "1f2e3d4c-5b6a-7890-1234-567890abcdef",
                    "status": "finished",
                    "class": {
                        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                        "code": "VR",
                        "display": "virtual"
                    },
                    "priority": {
                        "coding": [
                            {
                                "system": "http://spreekuur.nl/fhir/CodeSystem/Urgentie",
                                "code": "5",
                                "display": "U5"
                            }
                        ]
                    },
                    "reasonCode": [
                        {
                            "text": "Hoofdpijn"
                        }
                    ]
                }
            },
            {
                "resource": {
                    "resourceType": "Observation",
                    "meta": {
                        "profile": [
                            "http://hl7.org/fhir/StructureDefinition/nl-core-Observation"
                        ]
                    },
                    "extension": [
                        {
                            "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Smart-S-Rule",
                            "valueString": "Minder dan 12 uur geleden buikklachten. Patiënt is misselijk met matige, stekende buikpijn. Locatie: door hele buik. Buikpijn komt in aanvallen, verergert bij beweging/druk. Klachten blijven gelijk. Ziek+. Koorts-. Zelfhulp: geen."
                        }
                    ],
                    "status": "final",
                    "code": {
                        "coding": [
                            {
                                "system": "http://loinc.org",
                                "code": "61146-7",
                                "display": "Subjective journal line"
                            }
                        ]
                    },
                    "valueString": "Digiconsult., Buikklachten:, misselijk, matige buikpijn, de buikpijn voelt: stekend, ziek+, Buikpijn: komt in aanvallen, bij beweging/druk, nog een open tekstveld, locatie: door hele buik, Klachten sinds: <12u, de klachten blijven gelijk., Bijkomend:, koorts-, Zelfhulp: geen."
                }
            },
            {
                "resource": {
                    "resourceType": "Observation",
                    "status": "final",
                    "category": [
                        {
                            "coding": [
                                {
                                    "system": "https://terminology.hl7.org/CodeSystem/observation-category",
                                    "code": "survey",
                                    "display": "survey"
                                }
                            ]
                        }
                    ],
                    "code": {
                        "coding": [
                            {
                                "system": "https://monitoring.viplive.nl/instrument/scores",
                                "code": "BKH U3 040",
                                "display": "BKH U3 040"
                            }
                        ]
                    },
                    "valueQuantity": {
                        "value": 5
                    },
                    "interpretation": [
                        {
                            "text": "U5: Hoofdpijn",
                            "extension": [
                                {
                                    "url": "https://monitoring.viplive.nl/fhir/StructureDefinition/normScoreAssessment",
                                    "valueString": "Triagecriterium"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "resource": {
                    "resourceType": "Observation",
                    "status": "final",
                    "category": [
                        {
                            "coding": [
                                {
                                    "system": "https://terminology.hl7.org/CodeSystem/observation-category",
                                    "code": "survey",
                                    "display": "survey"
                                }
                            ]
                        }
                    ],
                    "code": {
                        "coding": [
                            {
                                "system": "https://monitoring.viplive.nl/instrument/scores",
                                "code": "definitieve_klacht_keuze",
                                "display": "definitieve_klacht_keuze"
                            }
                        ]
                    },
                    "valueQuantity": {
                        "value": 13
                    }
                }
            },
            {
                "fullUrl": "https://api.monitoring.viplive.nl/rest/fhir/clients/generalmeasurements/1234567890/scores/Klachtgebied",
                "resource": {
                    "resourceType": "Observation",
                    "status": "final",
                    "category": [
                        {
                            "coding": [
                                {
                                    "system": "https://terminology.hl7.org/CodeSystem/observation-category",
                                    "code": "survey",
                                    "display": "survey"
                                }
                            ]
                        }
                    ],
                    "code": {
                        "coding": [
                            {
                                "system": "https://monitoring.viplive.nl/instrument/scores",
                                "code": "Klachtgebied",
                                "display": "Klachtgebied"
                            }
                        ]
                    },
                    "valueQuantity": {
                        "value": 13
                    }
                }
            },
            {
                "resource": {
                    "resourceType": "QuestionnaireResponse",
                    "questionnaire": {
                        "reference": "https://monitoring.viplive.nl/rest/fhir/questionnaire/Spreekuur 37.2c - icm UC 13.2c met geoptimaliseerde codeboeken"
                    },
                    "status": "completed",
                    "authored": "2025-07-15T06:46:29+00:00",
                    "item": [
                        {
                            "extension": [
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Artsteksten",
                                    "valueString": "Klachtgebied"
                                }
                            ],
                            "linkId": "klacht_keuze",
                            "text": "Waarmee kunnen we je helpen?",
                            "answer": [
                                {
                                    "valueString": "Menstruatieklachten"
                                }
                            ]
                        },
                        {
                            "extension": [
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Artsteksten",
                                    "valueString": "Geslacht"
                                }
                            ],
                            "linkId": "GZP_010",
                            "text": "Wat is je geslacht?",
                            "answer": [
                                {
                                    "valueString": "Man"
                                }
                            ]
                        },
                        {
                            "extension": [
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Artsteksten",
                                    "valueString": "Leeftijd"
                                }
                            ],
                            "linkId": "GZP_020",
                            "text": "Wat is je leeftijd?",
                            "answer": [
                                {
                                    "valueString": "24"
                                }
                            ]
                        },
                        {
                            "extension": [
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/S-Rule",
                                    "valueString": "Digiconsult."
                                },
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Categorie",
                                    "valueString": "klacht/beloop"
                                },
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Artsteksten",
                                    "valueString": "ABCD"
                                }
                            ],
                            "linkId": "ABCD_010(7)",
                            "text": "Heb je een van de volgende klachten?\nMeer antwoorden mogelijk\nIk...",
                            "answer": [
                                {
                                    "extension": [
                                        {
                                            "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Artsteksten",
                                            "valueString": "ABCD veilig"
                                        }
                                    ],
                                    "valueString": "Geen van bovenstaande"
                                }
                            ]
                        },
                        {
                            "extension": [
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Categorie",
                                    "valueString": "medicatie"
                                },
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Artsteksten",
                                    "valueString": "Medicijngebruik"
                                }
                            ],
                            "linkId": "GZP_160",
                            "text": "Gebruik je medicijnen?\nHiermee bedoelen we ook homeopathische geneesmiddelen, anticonceptie, bloedverdunners en medicijnen verkrijgbaar bij de drogist.",
                            "answer": [
                                {
                                    "valueString": "Nee"
                                }
                            ]
                        },
                        {
                            "extension": [
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Categorie",
                                    "valueString": "voorgeschiedenis/achtergrond"
                                },
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Artsteksten",
                                    "valueString": "Toestemming inzage LSP"
                                }
                            ],
                            "linkId": "GZP_202",
                            "text": "Geef je toestemming aan de waarnemend huisarts of doktersassistente om je medische gegevens op te vragen bij je eigen huisarts en apotheek?\nMet inzage in je medische gegevens kunnen we je beter helpen. Alleen de zorgverlener ziet de gegevens van jouw eigen huisarts en apotheek, deze worden niet gedeeld met Spreekuur.nl",
                            "answer": [
                                {
                                    "extension": [
                                        {
                                            "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/S-Rule",
                                            "valueString": "LSP akkoord"
                                        }
                                    ],
                                    "valueString": "Ja"
                                }
                            ]
                        },
                        {
                            "extension": [
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/S-Rule",
                                    "valueString": "overige info:"
                                },
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Categorie",
                                    "valueString": "voorgeschiedenis/achtergrond"
                                },
                                {
                                    "url": "http://monitoring.viplive.nl/fhir/StructureDefinition/Artsteksten",
                                    "valueString": "Overige informatie gezondheid"
                                }
                            ],
                            "linkId": "GZP_300",
                            "text": "Wil je verder nog iets kwijt over je gezondheid?",
                            "answer": [
                                {
                                    "valueString": "Dit is een open tekstveld waar de patiënt nog iets kan invullen."
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    }
}
```

After this message is sent, the i-frame closes the wizard. The patient portal should remove or hide the i-frame
and start the follow-up action based on the urgency.

### `triageOut`
Sent when the resulting urgency is **U1 or U2** ("triage out") or when the patient ended the questionnaire
without completing it through the regular flow. The `data` field contains a FHIR `Encounter` resource with the
urgency in `priority`. No full FHIR Bundle with clinical data is sent in this case, because the patient is being
routed to emergency follow-up rather than to a regular online consultation.

Example:

```json
{
    "key": "triageOut",
    "data": {
        "resourceType": "Encounter",
        "id": "1f2e3d4c-5b6a-7890-1234-567890abcdef",
        "status": "finished",
        "class": {
            "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            "code": "VR",
            "display": "virtual"
        },
        "priority": {
            "coding": [
                {
                    "system": "http://spreekuur.nl/fhir/CodeSystem/Urgentie",
                    "code": "2",
                    "display": "U2"
                }
            ]
        }
    }
}
```

For the U1/U2 path, the Digitale Triage first shows the triage out message to the patient. The `triageOut`
message is sent only after the patient acknowledges that message by closing it. The patient portal should remove
or hide the i-frame and route the patient to the appropriate emergency follow-up.

### `userEvent`
Sent each time the patient interacts with the i-frame while the triage wizard is active. This is intended for the
patient portal to detect activity and implement its own session/inactivity logic; it does not carry triage data.

```ts
{
    key: 'userEvent',
    data: {
        trigger: 'click' | 'touchstart' | 'keydown' | 'keypress',
        timestamp: string  // ISO 8601, e.g. '2026-05-19T10:15:30.123Z'
    }
}
```

`userEvent` messages start once the wizard is opened and stop when the wizard is closed (either by
`triageCompleted`, `triageOut`, or the patient dismissing the wizard).

## Messages from the patient portal to the Digitale Triage
The Spreekuur.nl Digitale Triage does **not** listen for messages from the parent window. Communication is
unidirectional: the i-frame sends messages to the patient portal, but the patient portal cannot send commands or
data back to the i-frame.

## Patient cancellation
If the patient dismisses the wizard before the triage completes (for example by navigating away inside the
i-frame), no terminating `triageCompleted` or `triageOut` message is sent. The patient portal is responsible for
implementing its own inactivity handling — for example, by monitoring the `userEvent` messages and applying a
timeout when no events have been received for a configurable period.