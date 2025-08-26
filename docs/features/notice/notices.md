---
sidebar_position: 3
---
# Notices
**Availability:**

| Environment | status            |
|-------------|-------------------|
| Test        | 🚧 In development |
| Acceptance  | 🛑 Unavailable    |
| Production  | 🛑 Unavailable    |

**API specifications:**
* [API Spreekuur.nl](/openapi/notice-spreekuur)

## Functional summary
With the Notice feature, practitioners can send one-way messages to patients. Patients cannot respond to these messages.
Typical use cases are: 
* Informing patient about lab results
* Inviting a patient for a vaccination
* Etc.

## Send a notice
To send a notice, the flow is as follows:
```mermaid
sequenceDiagram
    actor Patient (User)
    participant Spreekuur.nl
    participant XIS
    
    XIS->>Spreekuur.nl: (1) POST: /Communication
    Spreekuur.nl->>Patient (User): (2) Notify patient of new notice
    Patient (User)->>Spreekuur.nl: (3) View notice in app
```

1. The XIS can post a Communication resource with "category" set to "notice" to Spreekuur.nl.
2. Spreekuur.nl will notify the patient of the new notice via mail and or push notification.
   1. When the patient is not registered in Spreekuur.nl yet, and the XIS provides an email address in the Communication resource,
      Spreekuur.nl will send an invitation to register.
3. The patient can view the notice in the Spreekuur.nl app.
