---
sidebar_position: 2
---
# Authentication and multi tenancy

## Authentication
### Authentication from Spreekuur.nl to HIS / XIS
Almost all authentication (with some exceptions) from Spreekuur.nl to the HIS / XIS is done using 
[OAuth Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693). 

```mermaid
sequenceDiagram
    actor Patient (User)
    participant Spreekuur.nl
    participant XIS
    participant Authorization Server

    Patient (User)->>Authorization Server: login with credentials
    Authorization Server-->>Patient (User): Return access token
    Patient (User)->>Spreekuur.nl: Request to access HIS / XIS with access token
    Spreekuur.nl->>Authorization Server: Token exchange with access token
    Authorization Server-->>Spreekuur.nl: Return exchanged token
    Spreekuur.nl->>HIS / XIS: Use exchanged token to access HIS / XIS API
    HIS / XIS-->>Spreekuur.nl: Return response
```

### Authentication from HIS / XIS to Spreekuur.nl

The HIS / XIS must authenticate to Spreekuur.nl using the
[OAuth 2.0 Client Credentials Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4) specification.

```mermaid
sequenceDiagram
    participant XIS
    participant Spreekuur.nl
    participant Authorization Server
    HIS / XIS->>Authorization Server: Request access token
    Authorization Server-->>HIS / XIS: Return access token
    HIS / XIS->> Spreekuur.nl: Use access token to access Spreekuur.nl API
```

### Authorization server / Identity Provider
Topicus.Healthcare can provide an authorization server that can be used for all authentication / authorization. 

## Multi tenancy
Spreekuur.nl is a multi-tenant application. This means that multiple organizations can use the same application,
but each organization has its own data and settings. 

To distinguish between different organizations, all API requests from Spreekuur.nl to HIS / XIS and vice versa must include the organisation AGB code in the `organisation_agb` header. 