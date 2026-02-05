---
sidebar_position: 1
---
# Appointment creation V2

**API specifications:**
* [API XIS](../api-xis/api-xis-v2.mdx) (version 2)

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
    alt BookableAppointmentType not configured in Spreekuur.nl or empty
       Spreekuur.nl->>Spreekuur.nl: :Log error
       Spreekuur.nl->>Patient (User): Show empty state
    else
        Patient (User)->>Spreekuur.nl: (2) Get agendas
        Spreekuur.nl->>XIS: GET /Slot
        Spreekuur.nl->>Spreekuur.nl: map distinct schedules to agendas
        Patient (User)->>Spreekuur.nl: (3) Get available timeslots for selected agenda
        Spreekuur.nl->>XIS: GET /Slot (filtered by selected schedule/agenda) 
        Patient (User)->>Spreekuur.nl: (4) Create appointment
        Spreekuur.nl->>XIS: POST /Appointment
        XIS->>Practitioner: Notify practitioner of new appointment
        alt Slot no longer available
            XIS -->> Spreekuur.nl: 409 ResourceConflict
            Spreekuur.nl->>Patient (User): Show "Timeslot no longer available, please choose another timeslot"
        end        
        alt approval workflow enabled
            Spreekuur.nl->>Spreekuur.nl: Save appointment with status "pending"
            Practitioner->>XIS: Approve or deny appointment
            XIS->>Spreekuur.nl: (5) POST /AppointmentResponse
            Spreekuur.nl->>Patient (User): Notify patient of appointment approval or rejection
        else
            Spreekuur.nl->>Spreekuur.nl: Save appointment with status "approved"
        end
    end
```
1. The `BookableAppointmentTypes` ValueSet is a list of appointment types that are bookable via Spreekuur.nl. 
    For example: `Physical appointment` or `Video-consult`. See [BookableAppointmentType](../api-xis/api-xis-v2.mdx#operation/getBookableAppointmentTypes) for more information. 
    The query parameter `service-category` can be used to filter the appointment types based on a specific system and value 
    configured in Spreekuur.nl in case a XIS has specific appointment types that can be used in Spreekuur.nl and others are only used internally. 
2. The `Slot` resource is used (for the first time) to identify the available agendas (schedules) for the requested service-category (bookable appointment type). 
   See [Slot](../api-xis/api-xis-v2.mdx#operation/getSlots) for the expected response. The distinct schedules from the available slots are mapped to 
   agendas shown to the user. `Schedule.date=ge` (start-of-day + one day), `Schedule.date=le` (start-of-day + 28 days), `status` (free) and `service-category` are used as filters.
3. The `Slot` resource is used again to get the available timeslots for one week for the selected agenda (`schedule`) and appointment type (`service-categorie`).
   Slots are paginated with a pages size of 7 days. See [Slot](../api-xis/api-xis-v2.mdx#operation/getSlots). 
4. The `Appointment` resource is used to create the appointment. See [Appointment](../api-xis/api-xis-v2.mdx#operation/createAppointment) for 
   the supported and required properties. A `409-ResourceConflict` response is expected in case the selected slot is no longer available.
5. The `AppointmentResponse` resource is used to approve or reject the appointment when an approval workflow is used by the XIS.
