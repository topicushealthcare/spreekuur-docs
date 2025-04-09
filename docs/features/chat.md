---
sidebar_position: 2
---
# Chat

## Functional summary
With the chat functionality, Spreekuur.nl offers a way for practitioners to communicate with patients via chat. This chat
can be started by the practitioner directly or by the patient by creating an e-consult.

## Technical summary

```mermaid
flowchart TD
    A[Chat] -->|Chatbot| B[Chatbot]
    A -->|Medewerker| C[Medewerker]
    B --> D[Antwoord]
    C --> D
    D --> E[Informatie]
    E --> F[Ondersteuning]
```

[Link to spec](../api/api.mdx#tag/Communication) 