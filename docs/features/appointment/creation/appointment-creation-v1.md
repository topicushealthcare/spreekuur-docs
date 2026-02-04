---
sidebar_position: 1
---
# Appointment creation V1

**API specifications:**
* [API XIS](/openapi/appointment-xis) (version 1)


## Appointment creation
To create an appointment, the following steps are taken:
```mermaid
sequenceDiagram
    actor Patient (User)
    participant Spreekuur.nl
    participant XIS
    actor Practitioner

    Patient (User)->>Spreekuur.nl: (1) Get appointment types
    Spreekuur.nl->>XIS: GET /ValueSet/BookableAppointmentTypes
    Patient (User)->>Spreekuur.nl: (2) Get available practitioners
    Spreekuur.nl->>XIS: GET /PractitionerRole
    Spreekuur.nl->>XIS: GET /Schedules
    Spreekuur.nl->>Spreekuur.nl: Filter practitioners with available schedule for selected bookable appointment type
    Patient (User)->>Spreekuur.nl: (3) Get available timeslots
    Spreekuur.nl->>XIS: GET /Slot
    Patient (User)->>Spreekuur.nl: Give reason for appointment
    Patient (User)->>Spreekuur.nl: (4) Create appointment
    Spreekuur.nl->>XIS: POST /Appointment
    XIS->>Practitioner: Notify practitioner of new appointment
    alt approval workflow enabled
    Spreekuur.nl->>Spreekuur.nl: Save appointment with status "pending"
    Practitioner->>XIS: Approve or deny appointment
    XIS->>Spreekuur.nl: (5) POST /AppointmentResponse
    Spreekuur.nl->>Patient (User): Notify patient of appointment approval or rejection
    else
    Spreekuur.nl->>Spreekuur.nl: Save appointment with status "approved"
    end
```
1. The `BookableAppointmentTypes` ValueSet is a list of appointment types that are bookable via Spreekuur.nl. For example:
   `Physical appointment` or `Video-consult`. See [BookableAppointmentType](api/api-xis.mdx#operation/getBookableAppointmentTypes) 
    for more information.
2. The `PractitionerRole` resource is used to get the available practitioners for the selected appointment type. To only
   show practitioners with an available schedule, schedules for the practitioner are fetched. See 
   [PractitionerRole](api/api-xis.mdx#operation/getPractitionerRoles) and [Schedule](api/api-xis.mdx#operation/getSchedules) for the expected 
   responses.
3. The `Slot` resource is used to get the available timeslots for the selected appointment type and practitioner. The 
   selected appointment type (service category), practitioner role ids and period (schedule date) are send as filters. 
   Slots are paginated with a pages size of 7 days. See [Slot](api/api-xis.mdx#operation/getSlots).
4. The `Appointment` resource is used to create the appointment. See [Appointment](api/api-xis.mdx#operation/createAppointment) for 
   the supported and required properties.
5. The `AppointmentResponse` resource is used to approve or reject the appointment.
