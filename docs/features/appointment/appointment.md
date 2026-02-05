---
sidebar_position: 1
---
# Appointments

**Availability:**

| Environment | status       |
|-------------|--------------|
| Test        | ✅ Available  |
| Acceptance  | ✅ Available  |
| Production  | ✅ Available  |

**API specifications:**
* [API Spreekuur.nl](api-spreekuur.mdx)
* [API XIS](api-xis/api-xis-v1.mdx) (version 1)
* [API XIS](api-xis/api-xis-v2.mdx) (version 2)


## Functional summary
A patient can make an appointment with a practitioner or practice via the Spreekuur.nl platform. The patient selects a
appointment type, optionally a practitioner or an agenda, a timeslot and provides a reason for the appointment. The appointment is then
sent to the XIS. It is possible to include a approval workflow in the appointment process where the practitioner has to 
approve or reject the appointment before it is confirmed. Once the appointment is confirmed, the patient will receive a 
confirmation message via the Spreekuur.nl platform. 

A confirmed appointment can be cancelled by the patient or the practitioner.

**Details:**
* [Create appointment](creation/appointment-creation-v1.md) (version 1)
* [Create appointment](creation/appointment-creation-v2.md) (version 2)
* [Cancel appointment](appointment-cancellation.md)
