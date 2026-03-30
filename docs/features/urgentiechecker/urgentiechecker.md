---
sidebar_position: 1
---
# Urgentiechecker
**Availability:**

| Environment | status            |
|-------------|-------------------|
| Test        | 🚧 In development |
| Acceptance  | 🚧 Available for integration testing (use `acceptatie`) |
| Production  | 🛑 Unavailable    |

## Functional summary
The Spreekuur.nl Urgentiechecker is a lightweight, web-component solution that can be embedded directly on a GP practice website. It lets patients quickly complete an online triage to receive an urgency assessment or self-care advice without first visiting Spreekuur.nl.

## Installation instructions
The Urgentiechecker is available as a web component that can be embedded on any website.

To install the Urgentiechecker, add the following tags to your website:

```html
<script src="https://urgentiechecker.spreekuur.nl/spreekuur-urgentiechecker.js"></script>
<link rel="stylesheet" href="https://urgentiechecker.spreekuur.nl/spreekuur-urgentiechecker.css">
```

This will load the necessary JavaScript and CSS for the Urgentiechecker component.

After adding these tags, you can add the Urgentiechecker component to your website using the following tag:

```html
<spreekuur-urgentiechecker agb-code="01054782" return-url="https://examplte-website.com/" environment="test"></spreekuur-urgentiechecker>
```

This should be added to the page where you want the Urgentiechecker to be displayed.

### Component attributes
* `agb-code`: The AGB code of the practice. This is used to identify the practice and to correctly administer the triage results.
* `return-url`: The URL to which the patient will be redirected after completing the triage. This should be the URL of the GP practice website.
* `environment`: OPTIONALLY the environment to use. Possible values are `test`, `acceptatie`. If not specified, the component will use the production environment by default.

### Acceptance environment — use `acceptatie` for integration testing

The Urgentiechecker is still under active development. For integration testing and validation (for example partner GP practice websites that need to verify behavior before production), use the acceptance environment by setting the component's `environment` attribute to `acceptatie`.

Example usage (integration testing):

```html
<script src="https://urgentiechecker.acceptatie.spreekuur.nl/spreekuur-urgentiechecker.js"></script>
<link rel="stylesheet" href="https://urgentiechecker.acceptatie.spreekuur.nl/spreekuur-urgentiechecker.css">

<spreekuur-urgentiechecker agb-code="01054782"
                          return-url="https://example-practice.nl/"
                          environment="acceptatie">
</spreekuur-urgentiechecker>
```

#### Notes
* The environment="acceptatie" attribute tells the component to use the acceptance back-end. If you omit environment, the component defaults to production.
* The acceptance environment may be less stable than production and may receive breaking changes while we iterate — expect shorter notice for changes.
* If your practice needs to be enabled in the acceptance environment (so triage results are correctly associated with your practice), contact the Spreekuur team to request access/registration for the practice AGB code.
* Use the acceptance environment only for testing and integration validation; do not use it for live patient workflows.